const webserver = require("../webserver.js");

const ttsCommand = async (command, messageInfo) => {
    webserver.tts(messageInfo.user, command.args.join(' '));
};

module.exports = ttsCommand;
