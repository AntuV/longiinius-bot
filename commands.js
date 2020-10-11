const config = require('config');
const client = require('./client.js');
const activeChannel = config.get('channel');

// Commands
const lolCommand = require('./commands/lol.js');
const animeCommand = require('./commands/anime.js');
const pointsCommand = require('./commands/points.js');
const clipCommand = require('./commands/clip.js');

let state = null;

const callCommand = async (command, messageInfo) => {
  state = messageInfo;

  switch (command.command) {
    case 'lol':
      lolCommand(command, messageInfo);
      break;
    case 'anime':
      animeCommand(command, messageInfo);
      break;
    case 'puntos':
      pointsCommand(command, messageInfo);
      break;
    case 'clip':
      clipCommand(command, messageInfo);
      break;
    default:
      break
  }
}

const checkModeratorPermission = () => state.user.mod || state.user.username === activeChannel;

module.exports = {
  call: (command, messageInfo) => {
    callCommand(command, messageInfo);
  }
};
