const lolCommand = require("./commands/lol.js");
const animeCommand = require("./commands/anime.js");
const puntosCommand = require("./commands/puntos.js");
const clipCommand = require("./commands/clip.js");
const preguntaCommand = require("./commands/pregunta.js");
const apuesta = require("./commands/apuesta.js");
const ttsCommand = require("./commands/tts.js");
const historiaCommand = require("./commands/historia.js");
const configCommand = require("./commands/config.js");
const db = require("./db.js");

let state = null;

const callCommand = async (command, messageInfo) => {
  state = messageInfo;

  switch (command.command) {
    case "lol":
      lolCommand(command, messageInfo);
      break;
    case "anime":
      animeCommand(command, messageInfo);
      break;
    case "puntos":
      puntosCommand(command, messageInfo);
      break;
    case "clip":
      clipCommand(command, messageInfo);
      break;
    case "pregunta":
      preguntaCommand(command, messageInfo);
      break;
    case "apuesta":
      apuesta.command(command, messageInfo);
      break;
    case 'tts':
      ttsCommand(command, messageInfo);
      break;
    case 'historia':
      historiaCommand(command, messageInfo);
      break;


    /* 
     * ADMIN
     */
    case 'config':
      configCommand(command, messageInfo);
      break;

    default:

      if (command.command) {
        command.command = command.command.toLowerCase();

        if (apuesta.currentBet) { 
          if (!apuesta.currentBet.winner && (command.command === apuesta.currentBet.first_option || command.command === apuesta.currentBet.second_option)) {
            apuesta.option(command.command, command, messageInfo);
          }
        }
      }
      break;
  }
};

module.exports = {
  call: (command, messageInfo) => {
    callCommand(command, messageInfo);
  },
};
