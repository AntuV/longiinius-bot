const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const db = require("../db.js");

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const animeCommand = async (command, messageInfo) => {
  if (command.args.length === 0) {
    client.say(
      activeChannel,
      `@${messageInfo.user["display-name"]}, tenés que ingresar el nombre del animé después del comando`
    );
    return;
  }

  switch (command.args[0]) {
    case "add":
      if (!checkPermission(messageInfo)) {
        return;
      }

      if (command.args.length < 2) {
        client.say(
          activeChannel,
          "Tenés que indicar el nombre del anime a agregar. Por ejemplo: !anime add Naruto"
        );
        return;
      }

      try {
        const row = await db.get(
          `SELECT name FROM anime WHERE lower(name) = ?`,
          [command.args[1].toLowerCase()]
        );
        if (row === undefined) {
          try {
            await db.run(`INSERT INTO anime(name, chapter) VALUES (?, 1)`, [
              command.args[1],
            ]);

            client.say(activeChannel, "Agregado anime: " + command.args[1]);
          } catch (err) {
            console.error(err);
            client.say(
              activeChannel,
              "Ocurrió un error al agregar el anime " + command.args[1]
            );
          }
        } else {
          client.say(
            activeChannel,
            "El anime " + command.args[1] + " ya existe."
          );
        }
      } catch (err) {
        console.error(err);
        client.say(
          activeChannel,
          "Ocurrió un error al buscar si el anime existe"
        );
        return;
      }
      break;
    case "set":
      if (!checkPermission(messageInfo)) {
        return;
      }

      if (command.args.length < 2) {
        client.say(
          activeChannel,
          "Tenés que indicar el nombre del anime y el capítulo actual. Por ejemplo: !anime set naruto 207"
        );
        return;
      }

      try {
        const row = db.get(`SELECT name FROM anime WHERE lower(name) = ?`, [
          command.args[1].toLowerCase(),
        ]);

        if (row === undefined) {
          client.say(
            activeChannel,
            "El anime " + command.args[1] + " no existe."
          );
        } else {
          try {
            await db.run(`UPDATE anime SET chapter = ? WHERE lower(name) = ?`, [
              command.args[2],
              command.args[1].toLowerCase(),
            ]);

            client.say(
              activeChannel,
              "El anime " + command.args[1] + " fue actualizado."
            );
          } catch (err) {
            console.error(err);
            client.say(
              activeChannel,
              "Ocurrió un error actualizando el anime " + command.args[1]
            );
          }
        }
      } catch (err) {
        console.error(err);
        client.say(
          activeChannel,
          "Ocurrió un error verificando si existe el anime " + command.args[1]
        );
        return;
      }
      break;
    default:
      if (command.args.length < 1) {
        return;
      }

      try {
        const row = await db.get(
          `SELECT name, chapter FROM anime WHERE lower(name) = ?`,
          [command.args[0].toLowerCase()]
        );

        if (!row) {
          client.say(
            activeChannel,
            "Ocurrió un error obteniendo el capítulo actual de " +
              command.args[0]
          );
        } else {
          client.say(
            activeChannel,
            `@${messageInfo.user["display-name"]}, ${row["name"]} va por el capítulo ${row["chapter"]}.`
          );
        }
      } catch (err) {
        client.say(
          activeChannel,
          "Ocurrió un error obteniendo el capítulo actual de " + command.args[0]
        );
      }
  }
};

module.exports = animeCommand;
