const utils = require('../common/utils.js');
const surveys = require('../schedule/surveys.js');

const preguntaCommand = (command, messageInfo) => {
  if (utils.checkPermission(messageInfo)) {
    if (command.args[0] === 'saltear') {
      surveys.skip();
    } else if (command.args[0] === 'va') {
      surveys.sendQuestion(false);
    }
  }
};

module.exports = preguntaCommand;
