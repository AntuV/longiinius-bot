const client = require("../client.js");
const db = require("../db.js");
const utils = require("../common/utils.js");
const config = require("../config.js");
const dayjs = require("dayjs");

const TIMEOUT = 5;

let bets = [];

// Tiempo en minutos
let betTimeout = 0;

let interval = null;

const apostar = {
  currentBet: null,
  command: async (command, messageInfo) => {
    if (!utils.checkPermission(messageInfo)) {
      return;
    }

    if (apostar.currentBet && command.args.length === 0) {
      client.say(
        config.get('channel'),
        `Apuesta en curso: ${apostar.currentBet.subject}. Escribí !${apostar.currentBet.first_option} o !${apostar.currentBet.second_option} y la cantidad de ${config.get('pointsname')} a apostar`
      );
      return;
    }

    switch (command.args[0]) {
      case "ultima":
      case "anterior":
        const lastBet = await db.get('SELECT *, MAX(id) FROM bets WHERE winner IS NOT NULL');
        if (lastBet.id) {

          const betsFirstOption = [];
          const betsSecondOption = [];

          const userBets = await db.all('SELECT * FROM bets_users WHERE bet_id = ?', [lastBet.id])
          for (let i = 0; i < userBets.length; i++) {
            if (lastBet.first_option === userBets[i].option) {
              betsFirstOption.push({ username: userBets[i].username, points: userBets[i].bet });
            } else {
              betsSecondOption.push({ username: userBets[i].username, points: userBets[i].bet });
            }
          }

          const first = betsFirstOption.map(bet => `${bet.username} (${bet.points})`).join(', ');
          const second = betsSecondOption.map(bet => `${bet.username} (${bet.points})`).join(', ');

          client.say(
            config.get('channel'),
            `Última apuesta: ${lastBet.subject} | Ganó "${lastBet.winner}" | "${lastBet.first_option}": ${first ? first : 'nadie'} | "${lastBet.second_option}": ${second ? second : 'nadie'}.`
          );
        }
        break;
      case "extender":
      case "alargar":
        if (apostar.currentBet && !isNaN(command.args[1])) {
          betTimeout += Number.parseInt(command.args[1], 10);
        }
        break;
      case "frenar":
      case "parar":
      case "stop":
      case "cerrar":
        if (interval) {
          clearInterval(interval);
        }
        betTimeout = 0;
        client.say(
          config.get('channel'),
          "Se terminó el tiempo. ¡Mucha suerte a todos! longiiHi"
        );
        break;
      default:
        command.args[0] = command.args[0].toLowerCase();

        if (apostar.currentBet && (command.args[0] === apostar.currentBet.first_option || command.args[0] === apostar.currentBet.second_option)) {
          if (!apostar.currentBet) {
            return;
          }

          if (interval) {
            clearInterval(interval);
          }
          betTimeout = 0;

          const winners = bets.filter((b) => b.option === command.args[0]);
          const losers = bets.filter((b) => b.option !== command.args[0]);

          let winnersAmount = 0;
          for (let i = 0; i < winners.length; i++) {
            winnersAmount += winners[i].points;
          }

          let losersAmount = 0;
          for (let i = 0; i < losers.length; i++) {
            losersAmount += losers[i].points;
          }

          let totalAmount = 0;
          for (let j = 0; j < bets.length; j++) {
            totalAmount += bets[j].points;
          }

          let message = `Ganó la opción "${command.args[0]}" con un monto acumulado de ${totalAmount}.`;

          if (winners.length > 0) {
            message += " ¡Felicitaciones a los ganadores! longiiEz";
          } else {
            message += " No hubo ganadores BibleThump";
          }

          client.say(config.get('channel'), message);

          for (let i = 0; i < bets.length; i++) {
            const bet = bets[i];

            try {
              const userPoints = await utils.getPoints(bet.username);
              if (userPoints) {
                let pointsToAdd = 0;
                if (bet.option === command.args[0]) {
                  const percentage = bet.points / winnersAmount;
                  pointsToAdd = Math.floor(losersAmount * percentage);
                } else {
                  if (userPoints.quantity >= bet.points) {
                    pointsToAdd = bet.points * -1;
                  } else {
                    pointsToAdd = userPoints.quantity * -1;
                  }
                }

                try {
                  await db.run(
                    "UPDATE points SET quantity = ? WHERE username = ?",
                    [userPoints.quantity + pointsToAdd, bet.username]
                  );
                } catch (err) {
                  console.error(err);
                  client.say(
                    config.get('channel'),
                    `Ocurrió un error actualizando los puntos de ${bet.username}`
                  );
                }
              }
            } catch (err) {
              console.error(err);
              client.say(
                config.get('channel'),
                `Ocurrió un error verificando la apuesta de ${bet.username}`
              );
            }
          }

          await db.run('UPDATE bets SET winner = ? WHERE id = ?', [command.args[0], apostar.currentBet.id]);

          apostar.currentBet = null;
          bets = [];
          return;
        } else if (apostar.currentBet) {
          return;
        }

        betTimeout = TIMEOUT;

        interval = setInterval(() => {
          if (betTimeout === 0) {
            clearInterval(interval);
            client.say(
              config.get('channel'),
              "Se terminó el tiempo. ¡Mucha suerte a todos! longiiHi"
            );
          } else if (betTimeout > 0) {
            betTimeout--;
          }
        }, 60 * 1000);

        let options = ['si', 'no'];
        if (command.args[0].includes('/') && command.args[0].split('/').length === 2) {
          options = command.args[0].split('/').slice(0, 2);
          command.args = command.args.slice(1);
        }

        const subject = command.args.join(" ");

        const id = await db.getNextId('bets');

        apostar.currentBet = {
          id,
          subject,
          date: dayjs().toISOString(),
          first_option: options[0],
          second_option: options[1],
          winner: null
        };

        await db.run('INSERT INTO bets(id, subject, date, first_option, second_option) VALUES (?, ?, ?, ?, ?)', [id, subject, apostar.currentBet.date, apostar.currentBet.first_option, apostar.currentBet.second_option]);

        client.say(
          config.get('channel'),
          `¡Nueva apuesta! ${subject}. Escribí !${options[0]} o !${options[1]} y la cantidad de ${config.get('pointsname')} a apostar`
        );
        break;
    }
  },
  option: async (option, command, messageInfo) => {
    if (!apostar.currentBet) {
      return client.say(
        config.get('channel'),
        "@" + messageInfo.user["display-name"] + ", no hay apuesta en curso."
      );
    } else if (betTimeout === 0) {
      return;
    }

    if (command.args.length === 0) {
      return client.say(
        config.get('channel'),
        `@${messageInfo.user["display-name"]}, tenés que indicar cuántos ${config.get('pointsname')} vas a apostar.`
      );
    }

    if (bets.find((b) => b.username === messageInfo.user.username)) {
      return client.say(
        config.get('channel'),
        `@${messageInfo.user["display-name"]}, ya hiciste tu apuesta.`
      );
    }

    let pointsToBet = 0;

    try {
      const userPoints = await utils.getPoints(messageInfo.user.username);
      if (userPoints) {
        if (
          isNaN(Number.parseInt(command.args[0], 10)) &&
          ["all", "allin", "all-in", "todo"].indexOf(command.args[0]) !== -1
        ) {
          pointsToBet = userPoints.quantity;
        } else if (
          !isNaN(Number.parseInt(command.args[0], 10)) &&
          Number.parseInt(command.args[0], 10) > 0
        ) {
          if (Number.parseInt(command.args[0], 10) <= userPoints.quantity) {
            pointsToBet = Number.parseInt(command.args[0], 10);
          } else {
            return client.say(
              config.get('channel'),
              `@${messageInfo.user["display-name"]}, no tenés puntos suficientes.`
            );
          }
        }

        if (pointsToBet === 0) {
          return client.say(
            config.get('channel'),
            `@${messageInfo.user["display-name"]}, tu apuesta no es válida.`
          );
        }

        await db.run('INSERT INTO bets_users(bet_id, username, option, bet) VALUES (?, ?, ?, ?)', [apostar.currentBet.id, messageInfo.user.username, option, pointsToBet]);

        bets.push({
          username: messageInfo.user.username,
          points: pointsToBet,
          option,
        });

        return client.say(
          config.get('channel'),
          `@${messageInfo.user["display-name"]}, hiciste tu apuesta a la opción "${option}" por ${pointsToBet} ${config.get('pointsname')} longiiLetsgoluffy`
        );
      } else {
        return client.say(
          config.get('channel'),
          `@${messageInfo.user["display-name"]}, no tenés puntos para apostar.`
        );
      }
    } catch (err) {
      return client.say(
        config.get('channel'),
        `@${messageInfo.user["display-name"]}, no tenés puntos para apostar.`
      );
    }
  },
};

// Busco apuesta en progreso
db.get('SELECT *, MAX(id) FROM bets WHERE winner IS NULL').then(bet => {
  if (bet.id) {
    apostar.currentBet = bet;

    betTimeout = 5 - dayjs().diff(dayjs(bet.date), 'minute');
    if (betTimeout < 0) {
      betTimeout = 0;
    }
    bets = [];

    db.all('SELECT * FROM bets_users WHERE bet_id = ?', [bet.id]).then(userBets => {
      for (let i = 0; i < userBets.length; i++) {
        const userBet = userBets[i];
        bets.push({
          username: userBet.username,
          points: userBet.bet,
          option: userBet.option,
        });
      }
    });
  }
});

module.exports = apostar;
