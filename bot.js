const client = require('./client.js');
const commandResolver = require('./commandResolver.js');
const pointsHandler = require('./points.js');
client.connect();

// Commands
client.on('chat', (channel, user, message, self) => {
  // bot message
  if (self) {
    return;
  }

  // if message has symbol whats mean command - !
  if (message.indexOf('!') === 0) {
    commandResolver.resolve(channel, user, message);
  }

  pointsHandler(user);
});
