const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const db = require("../db.js");
const { run } = require("../db.js");
const pointsname = config.get("pointsname");

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const TIMEOUT = 5;

let bets = [];

// Hay una apuesta en curso
let runningBet = false;

// Tiempo en minutos
let betTimeout = 0;

let interval = null;

const apostar = {
  command: async (command, messageInfo) => {
    if (!checkPermission(messageInfo) || command.args.length === 0) {
      return;
    }

    switch (command.args[0]) {
      case "extender":
      case "alargar":
        if (runningBet && !isNaN(command.args[1])) {
          betTimeout += Number.parseInt(command.args[1], 10);
        }
        break;
      case "frenar":
      case "parar":
      case "stop":
        betTimeout = 0;
        if (interval) {
          clearInterval(interval);
        }
        client.say(
          activeChannel,
          "Se terminó el tiempo. ¡Mucha suerte a todos! longiiHi"
        );
        break;
      default:
        if (["si", "no"].indexOf(command.args[0]) !== -1) {
          if (!runningBet) {
            return;
          }

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

          client.say(activeChannel, message);

          for (let i = 0; i < bets.length; i++) {
            const bet = bets[i];

            try {
              const userPoints = await db.get(
                "SELECT * FROM points WHERE username = ?",
                [messageInfo.user.username]
              );
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
                    activeChannel,
                    `Ocurrió un error actualizando los puntos de ${bet.username}`
                  );
                }
              }
            } catch (err) {
              console.error(err);
              client.say(
                activeChannel,
                `Ocurrió un error verificando la apuesta de ${bet.username}`
              );
            }
          }

          runningBet = false;
          bets = [];
          return;
        } else if (runningBet) {
          return;
        }

        runningBet = true;

        betTimeout = TIMEOUT;

        interval = setInterval(() => {
          if (betTimeout === 0) {
            clearInterval(interval);
            client.say(
              activeChannel,
              "Se terminó el tiempo. ¡Mucha suerte a todos! longiiHi"
            );
          } else if (betTimeout > 0) {
            betTimeout--;
          }
        }, 60 * 1000);

        const subject = command.args.join(" ");

        client.say(
          activeChannel,
          `¡Nueva apuesta! ${subject}. Escribí !si o !no y la cantidad de ${pointsname} a apostar`
        );
        break;
    }
  },
  option: async (option, command, messageInfo) => {
    if (!runningBet) {
      return client.say(
        activeChannel,
        "@" + messageInfo.user["display-name"] + ", no hay apuesta en curso."
      );
    } else if (betTimeout === 0) {
      return;
    }

    if (command.args.length === 0) {
      return client.say(
        activeChannel,
        `@${messageInfo.user["display-name"]}, tenés que indicar cuántos ${pointsname} vas a apostar.`
      );
    }

    if (bets.find((b) => b.username === messageInfo.user.username)) {
      return client.say(
        activeChannel,
        `@${messageInfo.user["display-name"]}, ya hiciste tu apuesta.`
      );
    }

    let pointsToBet = 0;

    try {
      const userPoints = await db.get(
        "SELECT * FROM points WHERE username = ?",
        [messageInfo.user.username]
      );
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
              activeChannel,
              `@${messageInfo.user["display-name"]}, no tenés puntos suficientes.`
            );
          }
        }

        if (pointsToBet === 0) {
          return client.say(
            activeChannel,
            `@${messageInfo.user["display-name"]}, tu apuesta no es válida.`
          );
        }

        bets.push({
          username: messageInfo.user.username,
          points: pointsToBet,
          option,
        });

        return client.say(
          activeChannel,
          `@${messageInfo.user["display-name"]}, hiciste tu apuesta a la opción "${option}" por ${pointsToBet} ${pointsname} longiiLetsgoluffy`
        );
      } else {
        return client.say(
          activeChannel,
          `@${messageInfo.user["display-name"]}, no tenés puntos para apostar.`
        );
      }
    } catch (err) {
      return client.say(
        activeChannel,
        `@${messageInfo.user["display-name"]}, no tenés puntos para apostar.`
      );
    }
  },
};

module.exports = apostar;
