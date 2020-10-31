const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const db = require("../db.js");
const webserver = require("../webserver.js");

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const ttsCommand = async (command, messageInfo) => {
    webserver.tts(messageInfo.user, command.args.join(' '));
};

module.exports = ttsCommand;
