const config = require('config');
const client = require('./client');
const activeChannel = config.get('channel');

// Commands
const lolCommand = require('./commands/lol');
const animeCommand = require('./commands/anime');

let state = null;

let searching = false;

const callCommand = async (command, messageInfo) => {
  state = messageInfo;

  switch (command.command) {
    case 'lol':
      lolCommand(command, messageInfo, searching);
      break;
    case 'anime':
      animeCommand(command, messageInfo);
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
