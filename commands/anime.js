const client = require("../client.js");
const utils = require("../common/utils.js");
const config = require("../config.js");
const db = require("../db.js");

const animeCommand = async (command, messageInfo) => {
  if (command.args.length === 0) {
    client.say(
      config.get('channel'),
      `@${messageInfo.user["display-name"]}, tenés que ingresar el nombre del animé después del comando`
    );
    return;
  }

  switch (command.args[0]) {
    case "add":
      if (!utils.checkPermission(messageInfo)) {
        return;
      }

      if (command.args.length < 2) {
        client.say(
          config.get('channel'),
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

            client.say(config.get('channel'), "Agregado anime: " + command.args[1]);
          } catch (err) {
            console.error(err);
            client.say(
              config.get('channel'),
              "Ocurrió un error al agregar el anime " + command.args[1]
            );
          }
        } else {
          client.say(
            config.get('channel'),
            "El anime " + command.args[1] + " ya existe."
          );
        }
      } catch (err) {
        console.error(err);
        client.say(
          config.get('channel'),
          "Ocurrió un error al buscar si el anime existe"
        );
        return;
      }
      break;
    case "set":
      if (!utils.checkPermission(messageInfo)) {
        return;
      }

      if (command.args.length < 2) {
        client.say(
          config.get('channel'),
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
            config.get('channel'),
            "El anime " + command.args[1] + " no existe."
          );
        } else {
          try {
            await db.run(`UPDATE anime SET chapter = ? WHERE lower(name) = ?`, [
              command.args[2],
              command.args[1].toLowerCase(),
            ]);

            client.say(
              config.get('channel'),
              "El anime " + command.args[1] + " fue actualizado."
            );
          } catch (err) {
            console.error(err);
            client.say(
              config.get('channel'),
              "Ocurrió un error actualizando el anime " + command.args[1]
            );
          }
        }
      } catch (err) {
        console.error(err);
        client.say(
          config.get('channel'),
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
            config.get('channel'),
            "Ocurrió un error obteniendo el capítulo actual de " +
            command.args[0]
          );
        } else {
          client.say(
            config.get('channel'),
            `@${messageInfo.user["display-name"]}, ${row["name"]} va por el capítulo ${row["chapter"]}.`
          );
        }
      } catch (err) {
        client.say(
          config.get('channel'),
          "Ocurrió un error obteniendo el capítulo actual de " + command.args[0]
        );
      }
  }
};

module.exports = animeCommand;
