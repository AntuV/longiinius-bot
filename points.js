const userDict = {};
const dayjs = require("dayjs");
const db = require("./db.js");

const pointsHandler = (user) => {
  if (!userDict[user.username]) {
    userDict[user.username] = dayjs();
    return;
  }

  console.log(userDict[user.username].toISOString());

  if (userDict[user.username].isBefore(dayjs().subtract(5, "minute"))) {
    db.get(
      "SELECT quantity FROM points WHERE username = ?",
      [user.username.toLowerCase()],
      (err, userPoints) => {
        if (err || !userPoints) {
          db.run("INSERT INTO points(username, quantity) VALUES (?, ?)", [
            user.username.toLowerCase(),
            1,
          ]);
          return;
        }

        db.run("UPDATE points SET quantity = ? WHERE username = ?", [
          userPoints.quantity + 1,
          user.username.toLowerCase(),
        ]);
      }
    );

    userDict[user.username] = dayjs();
    return;
  }
};

module.exports = pointsHandler;
