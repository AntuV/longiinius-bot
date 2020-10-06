const client = require('../client');
const fetch = require("node-fetch");
const champions = require('../champions');
const config = require('config');
const activeChannel = config.get('channel');

const lolCommand = async (command, messageInfo, searching) => {

  // No busco simultáneamente
  if (searching) {
    return;
  }

  searching = true;

  // Si no escribió nombre de campeón
  if (command.args.length === 0) {
    searching = false;
    return client.say(activeChannel, '@' + messageInfo.user.username + ', se debe buscar el nombre del campeón. Por ejemplo: !lol Jhin.');
  }

  // Busco la partida actual
  try {
    let response = await fetch(config.get('lol.url') + '/lol/spectator/v4/active-games/by-summoner/' + config.get('lol.account_id'), {
      headers: { "X-Riot-Token": config.get('lol.api_key') }
    })
    let currentMatch = await response.json();

    if (!currentMatch) {
      searching = false;
      return;
    }

    // No se encuentra en partida
    if (currentMatch.status && currentMatch.status.status_code === 404) {
      searching = false;
      return client.say(activeChannel, '@' + messageInfo.user.username + ', el capi no está en partida.');
    } else if (currentMatch.status && currentMatch.status.status_code !== 200) {
      searching = false;
      return;
    }

    // Matcheo el campeón buscado
    let championId = null;
    let championName = null;

    for (let i = 0; i < champions.length; i++) {
      if (champions[i].name.toLowerCase().includes(command.args[0].toLowerCase())) {
        championId = champions[i].key;
        championName = champions[i].name;
        break;
      }
    }

    // No encontré el campeón buscado
    if (!championId) {
      searching = false;
      return client.say(activeChannel, '@' + messageInfo.user.username + ', no pude encontrar el campeón.');
    }

    // Busco nombre del invocador
    let summonerName = null

    for (let i = 0; i < currentMatch.participants.length; i++) {
      if (currentMatch.participants[i].championId === championId) {
        summonerName = currentMatch.participants[i].summonerName;
      }
    }

    // No encontré nombre del invocador
    if (!summonerName) {
      searching = false;
      return client.say(activeChannel, '@' + messageInfo.user.username + ', no se encontró al campeón dentro de la partida.');
    }

    // Busco IDs del invocador
    response = await fetch(config.get('lol.url') + '/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(summonerName), {
      headers: { "X-Riot-Token": config.get('lol.api_key') }
    });
    summonerData = await response.json();

    if (summonerData.status && summonerData.status.status_code !== 200) {
      console.error('No pude buscar al invocador ' + summonerName);
      client.say(activeChannel, 'Falló al buscar los datos del invocador.');
      searching = false;
      return;
    }

    const summonerId = summonerData.id;

    // Busco historial de partidas ranked SoloQ 5v5 con el campeón buscado
    response = await fetch(config.get('lol.url') + '/lol/match/v4/matchlists/by-account/' + summonerData.accountId + '?champion=' + championId + '&queue=420', {
      headers: { "X-Riot-Token": config.get('lol.api_key') }
    });
    matchList = await response.json();

    
    if (matchList.status) {
      if (matchList.status.status_code === 404) {
        client.say(activeChannel, summonerName + ' es first time ' + championName + ' LUL');
        searching = false;
        return;
      } else {
        console.error('No pude encontrar el historial de ' + summonerName);
        client.say(activeChannel, 'Falló al buscar el historial de partidas.');
        searching = false;
        return;
      }
    }

    // Busco cada partida y calculo el ratio de victorias
    const maxMatchCount = matchList.matches.length > 20 ? 20 : matchList.matches.length;
    let totalMatches = maxMatchCount;
    let ratio = maxMatchCount;

    client.say(activeChannel, 'Buscando historial de partidas de ' + summonerName + ' con ' + championName + '...');

    for (let i = 0; i < maxMatchCount; i++) {

      try {
        response = await fetch(config.get('lol.url') + '/lol/match/v4/matches/' + matchList.matches[i].gameId, {
          headers: { "X-Riot-Token": config.get('lol.api_key') }
        });
        matchData = await response.json();
      } catch (err) {
        totalMatches--;
        ratio--;
        continue;
      }

      if (matchData.status && matchData.status.status_code !== 200) {
        console.error('No pude encontrar la partida ' + matchList.matches[i].gameId + ' del invocador ' + summonerName);
        continue;
      }

      let participantId = null;

      for (let i = 0; i < matchData.participantIdentities.length; i++) {
        if (matchData.participantIdentities[i].player.summonerName === summonerName) {
          participantId = matchData.participantIdentities[i].participantId;
          break;
        }
      }

      if (!participantId) {
        continue;
      }

      for (let i = 0; i < matchData.participants.length; i++) {
        if (matchData.participants[i].participantId === participantId) {              
          if (!matchData.participants[i].stats.win) {
            ratio--;
          }
          break;
        }
      }

    }

    // Busco datos del rank de invocador
    response = await fetch(config.get('lol.url') + '/lol/league/v4/entries/by-summoner/' + summonerId, {
      headers: { "X-Riot-Token": config.get('lol.api_key') }
    });
    rankData = await response.json();

    if (rankData.status && rankData.status.status_code !== 200) {
      console.error('No pude encontrar el rank de ' + summonerName);
      searching = false;
      client.say(activeChannel, 'Falló la API de LoL');
      return;
    }

    rankData = rankData[0];

    // Devuelvo mensaje con resultado al chat
    if (rankData.queueType === 'RANKED_SOLO_5x5') {
      client.say(activeChannel, summonerName + ' (' + championName + '): ' + rankData.tier + ' ' + rankData.rank + ' ' + rankData.leaguePoints + 'LP - WR ' + rankData.wins + '/' + rankData.losses + ' - Ganó ' + ratio + ' de las últimas ' + totalMatches + ' partidas con ' + championName + '.');
    } else {
      client.say(activeChannel, summonerName + ' (' + championName + '): Ganó ' + ratio + ' de las últimas ' + totalMatches + ' partidas con ' + championName + '.');
    }
    searching = false;

  } catch (err) {
    console.log('error');
    console.error(err);
    client.action(activeChannel, 'Me rompí todo :c');
    searching = false;
  }

}

module.exports = lolCommand;
