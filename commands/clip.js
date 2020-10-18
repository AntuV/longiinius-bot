const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const twitch = require("../twitch.js");

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const clipCommand = async (command, messageInfo) => {
  if (checkPermission(messageInfo)) {
    try {
      const clip = await twitch.createClip();
      if (!clip) {
        return;
      }

      client.say(activeChannel, `https://clips.twitch.tv/${clip.id}`);
    } catch (err) {
      client.say(activeChannel, '@' + messageInfo.user['display-name'] + ', ocurrió un error al crear el clip.');
    }
  }
};

module.exports = clipCommand;
