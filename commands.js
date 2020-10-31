const config = require("config");
const activeChannel = config.get("channel");

// Commands
const lolCommand = require("./commands/lol.js");
const animeCommand = require("./commands/anime.js");
const pointsCommand = require("./commands/points.js");
const clipCommand = require("./commands/clip.js");
const preguntaCommand = require("./commands/pregunta.js");
const apuesta = require("./commands/apuesta.js");
const ttsCommand = require("./commands/tts.js");
const historiaCommand = require("./commands/historia.js");

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
      pointsCommand(command, messageInfo);
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
    case "si":
      apuesta.option("si", command, messageInfo);
      break;
    case "no":
      apuesta.option("no", command, messageInfo);
      break;
    case 'tts':
      ttsCommand(command, messageInfo);
      break;
    case 'historia':
      historiaCommand(command, messageInfo);
      break;
    default:
      break;
  }
};

module.exports = {
  call: (command, messageInfo) => {
    callCommand(command, messageInfo);
  },
};
