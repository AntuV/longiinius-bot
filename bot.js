const dayjs = require("dayjs");
const config = require("./config");

isLive = false;

config.initialize().then(() => {

  const commandResolver = require("./commandResolver.js");
  const pointsHandler = require("./schedule/points.js");
  const twitch = require("./twitch.js");
  // const surveys = require('./schedule/surveys.js');
  const webserver = require("./webserver.js");
  const utils = require("./common/utils.js");
  const client = require("./client.js");

  client.connect().then(() => {

    webserver.start().then(() => {

      twitch.isLive().then(live => {
        isLive = live;
        // surveys.running = live;
      }).catch(() => { });

      /**
       * Cada 5 minutos se fija si está en vivo
       */
      setInterval(async () => {
        twitch.isLive().then(live => {
          isLive = live;
          // surveys.running = live;
        }).catch(() => { });
      }, 5 * 60 * 1000);

      // Commands
      client.on("chat", (channel, user, message, self) => {
        // bot message
        if (self) {
          return;
        }

        // if message has symbol whats mean command - !
        if (message.indexOf("!") === 0) {
          channel = {
            name: channel,
            users: utils.userList
          };
          commandResolver.resolve(channel, user, message);
        }

        if (config.get('options.debug') || isLive) {
          pointsHandler(user);
          // surveys.checkAnswer(user, message);
        }
      });

      client.on("join", (channel, user, self) => {
        if (!self) return;

        if (channel.includes(config.get('bot.username').toLowerCase())) {
          return;
        }

        if (utils.userList.indexOf(user) === -1) {
          utils.userList.push(user);
        }
      });

      client.on("part", (channel, user, self) => {
        if (!self) return;

        if (channel.includes(config.get('bot.username').toLowerCase())) {
          return;
        }

        utils.userList = utils.userList.filter((u) => u !== user);
      });
    });
  });
});
