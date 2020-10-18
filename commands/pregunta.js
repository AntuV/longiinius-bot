const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const surveys = require('../surveys.js');

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const preguntaCommand = (command, messageInfo) => {
  if (checkPermission(messageInfo)) {
    if (command.args[0] === 'saltear') {
      surveys.skip();
    } else if (command.args[0] === 'va') {
      surveys.sendQuestion(false);
    }
  }
};

module.exports = preguntaCommand;
