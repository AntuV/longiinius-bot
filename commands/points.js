const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const pointsname = config.get("pointsname");
const db = require("../db.js");

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const pointsCommand = (command, messageInfo) => {
  if (command.args.length === 0) {
    db.get(
      "SELECT quantity FROM points WHERE username = ?",
      [messageInfo.user["display-name"].toLowerCase()],
      (err, userPoints) => {
        if (err || !userPoints) {
          client.say(
            activeChannel,
            `@${messageInfo.user["display-name"]}, no tenés ${pointsname}`
          );
          return;
        }

        client.say(
          activeChannel,
          `@${messageInfo.user["display-name"]}, tenés ${userPoints.quantity} ${pointsname}`
        );
      }
    );
  } else if (command.args.length === 1) {
    getUsuario(command.args[0])
      .then((userPoints) => {
        client.say(
          activeChannel,
          `@${messageInfo.user["display-name"]}, ${
            userPoints.displayname
              ? userPoints.displayname
              : userPoints.username
          } tiene ${userPoints.quantity} ${pointsname}`
        );
      })
      .catch(() => {
        client.say(
          activeChannel,
          `@${messageInfo.user["display-name"]}, no se encontraron los ${pointsname} de ${command.args[0]}`
        );
        return;
      });
  } else if (command.args.length === 2) {
  } else if (command.args.length === 3) {
    if (command.args[0] === "agregar" || command.args[0] === "quitar") {
      if (!checkPermission(messageInfo)) {
        return;
      }

      if (!isNaN(command.args[2])) {
        getUsuario(command.args[1])
          .then((userPoints) => {
            const pointsToAdd =
              command.args[0] === "agregar"
                ? Number.parseInt(command.args[2], 10)
                : Number.parseInt(command.args[2] * -1, 10);

            console.log(pointsToAdd);

            const points =
              userPoints.quantity + pointsToAdd > 0
                ? userPoints.quantity + pointsToAdd
                : 0;

            console.log(points);

            db.run(
              "UPDATE points SET quantity = ? WHERE username = ?",
              [points, userPoints.username],
              (err) => {
                client.say(
                  activeChannel,
                  `@${messageInfo.user["display-name"]}, ${userPoints.displayname} ahora tiene ${points} ${pointsname}`
                );
              }
            );
          })
          .catch(() => {
            client.say(
              activeChannel,
              `@${messageInfo.user["display-name"]}, no se encontraron los ${pointsname} de ${command.args[0]}`
            );
            return;
          });
      } else {
        client.say(
          activeChannel,
          `@${messageInfo.user["display-name"]}, el número ingresado es inválido`
        );
      }
    }
  }
};

function getUsuario(username) {
  return new Promise((resolve, reject) => {
    if (username.indexOf("@") === 0) {
      username = username.substring(1).toLowerCase();
    }
    db.get(
      "SELECT * FROM points WHERE username LIKE ?",
      ["%" + username + "%"],
      (err, userPoints) => {
        if (err || !userPoints) {
          reject(err);
          return;
        }

        resolve(userPoints);
      }
    );
  });
}

module.exports = pointsCommand;
