const dayjs = require("dayjs");
const config = require("../config.js");
const db = require('../db.js');

const utils = {
  userList: [],
  checkPermission: (messageInfo) => {
    return (
      !!messageInfo.user.mod ||
      messageInfo.user.username === config.get('channel').toLowerCase() ||
      messageInfo.user.username === config.get('owner').toLowerCase()
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
  },
  setCooldown: async (username, command, expiration) => {
    const cooldown = await db.get('SELECT * FROM cooldowns WHERE username = ? AND command = ?', [username, command]);
    if (!cooldown) {
      await db.run('INSERT INTO cooldowns(username, command, expiration) VALUES (?, ?, ?)', [username, command, expiration.toISOString()]);
    } else {
      await db.run('UPDATE cooldowns SET expiration = ? WHERE username = ? AND command = ?', [expiration.toISOString(), username, command]);
    }
  },
  hasCooldown: async (username, command) => {
    const now = dayjs();
    const cooldown = await db.get('SELECT * FROM cooldowns WHERE username = ? AND command = ?', [username, command]);
    console.log(dayjs(cooldown.expiration));
    if (cooldown) {
      return now.isBefore(dayjs(cooldown.expiration));
    } else {
      return false;
    }
  }
};

module.exports = utils;
