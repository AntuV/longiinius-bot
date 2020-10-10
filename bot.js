const client = require("./client.js");
const commandResolver = require("./commandResolver.js");
const pointsHandler = require("./points.js");
const twitch = require("./twitch.js");
client.connect();

const userList = [];

isLive = false;

twitch.isLive().then(live => {
  isLive = live;
}).catch(() => {});

setInterval(async () => {
  twitch.isLive().then(live => {
    isLive = live;
  }).catch(() => {});
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
      users: userList
    };
    commandResolver.resolve(channel, user, message);
  }

  if (isLive) {
    pointsHandler(user);
  }
});

client.on("join", (channel, user, self) => {
  if (!self) return;

  if (userList.indexOf(user) === -1) {
    userList.push(user);
  }
});

client.on("part", (channel, user, self) => {
  if (!self) return;

  userList.filter((u) => u !== user);
});
