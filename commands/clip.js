const client = require("../client.js");
const utils = require("../common/utils.js");
const config = require("../config.js");
const twitch = require("../twitch.js");

const clipCommand = async (command, messageInfo) => {
  if (utils.checkPermission(messageInfo)) {
    try {
      const clip = await twitch.createClip();
      if (!clip) {
        return;
      }

      client.say(config.get('channel'), `https://clips.twitch.tv/${clip.id}`);
    } catch (err) {
      client.say(config.get('channel'), '@' + messageInfo.user['display-name'] + ', ocurrió un error al crear el clip.');
    }
  }
};

module.exports = clipCommand;
