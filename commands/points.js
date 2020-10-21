const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const pointsname = config.get("pointsname");
const db = require("../db.js");

let cooldown = false;

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const pointsCommand = async (command, messageInfo) => {
  if (cooldown && !checkPermission(messageInfo)) {
    return;
  }

  cooldown = true;

  setTimeout(() => {
    cooldown = false;
  }, 5 * 1000);

  if (command.args.length === 0) {
    getUsuario(messageInfo.user.username)
      .then((userPoints) => {
        client.say(
          activeChannel,
          `@${messageInfo.user["display-name"]}, tenés ${userPoints.quantity} ${pointsname}`
        );
      })
      .catch(() => {
        client.say(
          activeChannel,
          `@${messageInfo.user["display-name"]}, no tenés ${pointsname}`
        );
      });
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
      });
  } else if (command.args.length === 2) {
  } else if (command.args.length === 3) {
    if (command.args[0] === "agregar" || command.args[0] === "quitar") {
      if (!isNaN(command.args[2])) {
        getUsuario(command.args[1])
          .then(async (userPoints) => {
            const pointsToAdd =
              command.args[0] === "agregar"
                ? Number.parseInt(command.args[2], 10)
                : Number.parseInt(command.args[2] * -1, 10);

            const points =
              userPoints.quantity + pointsToAdd > 0
                ? userPoints.quantity + pointsToAdd
                : 0;

            if (!checkPermission(messageInfo)) {
              let valid = false;

              if (pointsToAdd > 0) {
                try {
                  const originUser = await getUsuario(messageInfo.user.username);
                  if (originUser.quantity >= pointsToAdd) {
                    try {
                      await db.run(
                        "UPDATE points SET quantity = ? WHERE username = ?",
                        [
                          originUser.quantity - pointsToAdd,
                          messageInfo.user.username,
                        ]
                      );
                      valid = true;
                    } catch (err) {
                      console.error(err);
                    }
                  }
                } catch (err) {
                  console.error(err);
                }
              }

              if (!valid) {
                return client.say(
                  activeChannel,
                  `@${messageInfo.user["display-name"]}, no podés transferir esa cantidad.`
                );
              }
            }

            try {
              await db.run(
                "UPDATE points SET quantity = ? WHERE username = ?",
                [points, userPoints.username]
              );
              client.say(
                activeChannel,
                `@${messageInfo.user["display-name"]}, ${
                  userPoints.displayname
                    ? userPoints.displayname
                    : userPoints.username
                } ahora tiene ${points} ${pointsname}`
              );
            } catch (err) {
              console.error(err);
            }
          })
          .catch(() => {
            client.say(
              activeChannel,
              `@${messageInfo.user["display-name"]}, no se encontraron los ${pointsname} de ${command.args[1]}`
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
  return new Promise(async (resolve, reject) => {
    if (username.indexOf("@") === 0) {
      username = username.substring(1);
    }
    username = username.toLowerCase();

    try {
      const userPoints = await db.get(
        "SELECT * FROM points WHERE username LIKE ?",
        ["%" + username + "%"]
      );
      if (!isNan(userPoints)) {
        resolve(userPoints);
      } else {
        reject();
      }
    } catch (err) {
      db.run(
        "INSERT INTO points(username, displayname, quantity) VALUES (?, ?, ?)",
        [username, null, 0]
      ).then(() => {
        resolve ({
          username,
          displayname: null,
          quantity: 0
        });
      }).catch(e => {
        reject(e);
      });
    }
  });
}

module.exports = pointsCommand;
