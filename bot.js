const client = require('./client.js');
const commandResolver = require('./commandResolver.js');
client.connect();

// Commands
client.on('chat', (channel, user, message, self) => {
  // bot message
  if (self) {
    return;
  }

  // if message has symbol whats mean command - !
  if ((message.indexOf('!')) !== -1) {
    commandResolver.resolve(channel, user, message);
  }
})
