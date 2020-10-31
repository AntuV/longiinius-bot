const userDict = {};
const dayjs = require("dayjs");
const db = require("../db.js");
const config = require("config");
const utils = require("../common/utils.js");

const pointsHandler = async (user) => {
  if (!userDict[user.username]) {
    userDict[user.username] = dayjs();
    return;
  }

  if (
    config.get("options.debug") ||
    userDict[user.username].isBefore(dayjs().subtract(5, "minute"))
  ) {
    try {
      const userPoints = await utils.getPoints(user.username);

      if (!userPoints.displayname) {
        await db.run("UPDATE points SET displayname = ? WHERE username = ?", [
          user["display-name"],
          user.username,
        ]);
      }

      await db.run("UPDATE points SET quantity = ? WHERE username = ?", [
        userPoints.quantity + 1,
        user.username,
      ]);

      userDict[user.username] = dayjs();
    } catch (err) {
      //
    }
  }
};

module.exports = pointsHandler;
