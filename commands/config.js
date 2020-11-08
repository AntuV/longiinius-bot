const client = require("../client");
const utils = require("../common/utils");
const config = require("../config");

const configCommand = async (command, messageInfo) => {
    if (!utils.checkPermission(messageInfo) || !messageInfo.channel.name.includes(config.get('bot.username').toLowerCase())) {
        return;
    }

    if (command.args.length === 0) {
        client.say(config.get('bot.username'), Object.keys(config.getAll()).join('|'));
    } else if (command.args.length === 1) {
        if (command.args[0] === 'update') {
            config.initialize().then(() => {
                client.say(config.get('bot.username'), 'Configuración actualizada');
            });
        }
    } else if (command.args.length >= 2) {
        if (command.args[0] === 'get') {
            client.say(config.get('bot.username'), `${command.args[1]}: ${JSON.stringify(config.get(command.args[1]))}`);
        } else if (command.args[0] === 'set') {
            let value = null;
            if (command.args[2] === 'true') {
                value = true;
            } else if (command.args[2] === 'false') {
                value = false;
            } else if (!isNaN(command.args[2])) {
                value = Number.parseInt(command.args[2]);
            } else if (command.args[2] !== 'null') {
                value = command.args.slice(2).join(' ');
            }
            config.set(command.args[1], value).then(() => {
                client.say(config.get('bot.username'), `${command.args[1]}: ${JSON.stringify(config.get(command.args[1]))}`);
            }).catch(err => {
                console.error(err);
                client.say(config.get('bot.username'), 'Se rompió todo, vieja BibleThump');
            });
        }
    }
};

module.exports = configCommand;