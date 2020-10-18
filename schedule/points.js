const userDict = {};
const dayjs = require("dayjs");
const db = require("../db.js");
const config = require('config');

const pointsHandler = (user) => {
  if (!userDict[user.username]) {
    userDict[user.username] = dayjs();
    return;
  }

  if (userDict[user.username].isBefore(dayjs().subtract(5, "minute"))) {
    db.get(
      "SELECT quantity, displayname FROM points WHERE username = ?",
      [user.username],
      (err, userPoints) => {
        if (err || !userPoints) {
          db.run(
            "INSERT INTO points(username, displayname, quantity) VALUES (?, ?, ?)",
            [user.username, user['display-name'], 1]
          );
          return;
        }

        if (!userPoints.displayname) {
          db.run("UPDATE points SET displayname = ? WHERE username = ?", [
            user['display-name'],
            user.username,
          ]);
        }

        db.run("UPDATE points SET quantity = ? WHERE username = ?", [
          userPoints.quantity + 1,
          user.username,
        ]);
      }
    );

    userDict[user.username] = dayjs();
    return;
  }
};

module.exports = pointsHandler;
