const client = require("../client.js");
const config = require("config");
const activeChannel = config.get("channel");
const owner = config.get("owner");
const db = require("../db.js");
const utils = require("../common/utils.js");
const dayjs = require("dayjs");

const checkPermission = (state) =>
  state.user.mod ||
  state.user.username === activeChannel.toLowerCase() ||
  state.user.username === owner.toLowerCase();

let globalCooldown = false;
let userCooldown = {};

const historiaCommand = async (command, messageInfo) => {
  if (globalCooldown) {
    return;
  }

  if (userCooldown[messageInfo.user.username]) {
    if (dayjs().isBefore(userCooldown[messageInfo.user.username].add(1, 'hour'))) {
      return;
    }
  }

  const storyNumber = 1/*Math.floor(Math.random() * 2) + 1*/;
  const random = Math.floor(Math.random() * 2);

  console.log(storyNumber);

  let username = null;

  if (command.args[0]) {
    username = command.args[0];
    if (username.indexOf("@") === 0) {
      username = username.substring(1);
    }
  }

  switch (storyNumber) {
    case 1:
      if (username) {
        const users = [messageInfo.user.username, username];
        const user1 = users[random];
        const user2 = user1 === messageInfo.user.username ? username : messageInfo.user['display-name'];
        client.action(activeChannel, `${user1} y ${user2} iban en el barco y encontraron un tesoro. ${user1} le disparó a ${user2} y se quedo con el tesoro (+25 GC).`);
        client.timeout(activeChannel, user2, 5 * 60, "!historia");
        try {
          const userPoints = await utils.getPoints(user1);
          console.log(userPoints);
          if (userPoints) {
            await db.run('UPDATE points SET quantity = ? WHERE username = ?', [userPoints.quantity + 25, user1]);
          }
        } catch (err) {
          //
        }
      } else {
        const user = messageInfo.user.username;
        if (Math.floor(Math.random() * 2)) {
          client.action(activeChannel, `${user} iba en el barco y ve una isla a lo lejos. En el trayecto es devorado por un monstruo marino.`);
          client.timeout(activeChannel, user, 5 * 60, "!historia");
        } else {
          client.action(activeChannel, `${user} iba en el barco y ve una isla a lo lejos. Para su sorpresa, ¡encuentra un tesoro! longiiEz (+25 GC).`);
          client.timeout(activeChannel, user, 5 * 60, "!historia");
        }
      }
      break;
    case 2:
      client.action(activeChannel, "Se muere " + command.args[0]);
      client.timeout(activeChannel, command.args[0], 5 * 60, "!historia");
      break;
    default:
      break;
  }

  globalCooldown = true;
  setTimeout(() => {
    globalCooldown = false;
  }, 5 * 60 * 1000);

  userCooldown[messageInfo.user.username] = dayjs();
};

module.exports = historiaCommand;
