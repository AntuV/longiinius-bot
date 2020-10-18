let tmi = require ('tmi.js');
const config = require('config');

let client = new tmi.client({
    options: {
      debug: config.get('options.debug')
    },
    connection: {
      cluster: config.get('connection.cluster'),
      reconnect: config.get('connection.reconnect')
    },
    identity: {
      username: config.get('bot.username'),
      password: config.get('bot.oauth_token')
    },
    channels: [config.get('channel')]
  });

module.exports = client;
