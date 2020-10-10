const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const db = require("../db.js");

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

const pointsCommand = (command, messageInfo) => {
  if (command.args.length === 0) {
    db.get(
      "SELECT quantity FROM points WHERE username = ?",
      [messageInfo.user.username.toLowerCase()],
      (err, userPoints) => {
        if (err || !userPoints) {
          client.say(
            activeChannel,
            `@${messageInfo.user.username}, no tenés LongiPoints`
          );
          return;
        }

        client.say(
          activeChannel,
          `@${messageInfo.user.username}, tenés ${userPoints.quantity} LongiPoints`
        );
      }
    );
  } else {
    //
  }
};

module.exports = pointsCommand;
