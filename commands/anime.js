const client = require("../client");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const db = require("../db");

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const animeCommand = (command, messageInfo) => {
  console.log(command);

  if (command.args.length === 0) {
    client.say(activeChannel, "No 1 :<");
    return;
  }

  switch (command.args[0]) {
    case "add":
      if (!checkPermission(messageInfo)) {
        return;
      }

      if (command.args.length < 2) {
        client.say(activeChannel, "No 2 :<");
        return;
      }

      db.get(
        `SELECT name FROM anime WHERE name = ?`,
        [command.args[1]],
        (err, row) => {
          if (err) {
            console.error(err);
            client.say(activeChannel, "No 3 :<");
            return;
          }

          if (row === undefined) {
            db.run(
              `INSERT INTO anime(name, chapter) VALUES (?, 1)`,
              [command.args[1]],
              (err) => {
                if (err) {
                  console.error(err);
                  client.say(activeChannel, "No 3 :<");
                } else {
                  client.say(
                    activeChannel,
                    "Agregado anime: " + command.args[1]
                  );
                }
              }
            );
          } else {
            client.say(
              activeChannel,
              "El anime " + command.args[1] + " ya existe."
            );
          }
        }
      );
      break;
    case "set":
      if (!checkPermission(messageInfo)) {
        return;
      }

      if (command.args.length < 2) {
        client.say(activeChannel, "No 2 :<");
        return;
      }

      db.get(
        `SELECT name FROM anime WHERE name = ?`,
        [command.args[1]],
        (err, row) => {
          if (err) {
            console.error(err);
            client.say(activeChannel, "No 3 :<");
            return;
          }

          if (row === undefined) {
            client.say(
              activeChannel,
              "El anime " + command.args[1] + " no existe."
            );
          } else {
            db.run(
              `UPDATE anime SET chapter = ? WHERE name = ?`,
              [command.args[2], command.args[1]],
              (err) => {
                if (err) {
                  console.error(err);
                  client.say(activeChannel, "No 3 :<");
                  return;
                }

                client.say(
                  activeChannel,
                  "El anime " + command.args[1] + " fue actualizado."
                );
              }
            );
          }
        }
      );
      break;
    default:
      if (command.args.length < 1) {
        return;
      }

      db.get(
        `SELECT name, chapter FROM anime WHERE name = ?`,
        [command.args[0]],
        (err, row) => {
          if (err) {
            console.error(err);
            client.say(activeChannel, "No 3 :<");
            return;
          }

          client.say(
            activeChannel,
            `@${messageInfo.user.username}, el anime "${row["name"]}" va por el capítulo ${row["chapter"]}.`
          );
        }
      );
  }
};

module.exports = animeCommand;
