const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const db = require('../db.js');

const utils = {
  userList: [],
  checkPermission: (messageInfo) => {
    return (
      !!messageInfo.user.mod ||
      messageInfo.user.username === activeChannel.toLowerCase() ||
      messageInfo.user.username === owner.toLowerCase()
    );
  },
  getPoints: (username) => {
    return new Promise(async (resolve, reject) => {
      if (username.indexOf("@") === 0) {
        username = username.substring(1);
      }
      username = username.toLowerCase();
  
      try {
        const userPoints = await db.get('SELECT * FROM points WHERE username = ?', [username]);
        if (userPoints) {
          resolve(userPoints);
        } else {
          reject();
        }
      } catch (err) {
        db.run(
          "INSERT INTO points(username, displayname, quantity) VALUES (?, ?, ?)",
          [username, null, 0]
        ).then(() => {
          resolve ({
            username,
            displayname: null,
            quantity: 0
          });
        }).catch(e => {
          reject();
        });
      }
    });
  }
};

module.exports = utils;
