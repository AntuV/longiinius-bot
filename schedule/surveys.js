const db = require("../db.js");
const client = require("../client.js");
const utils = require("../common/utils.js");
const config = require("../config.js");

const REWARD = 20;

let sent_iteration = null;
let currentQuestion = null;
let endTimeout = null;
let questions = [];

/**
 * Cada 60 minutos se fija si está en vivo y envía una pregunta
 */
setInterval(() => {
  if (surveys.running) {
    surveys.sendQuestion(true);
  }
}, 60 * 60 * 1000);

const surveys = {
  running: false,
  sendQuestion: async (notice) => {
    if (currentQuestion) {
      return;
    }

    if (sent_iteration === null) {
      sent_iteration = (await db.get('SELECT MIN(times_sent) as times_sent FROM questions')).times_sent;
    }

    if (questions.length === 0) {
      questions = await db.all("SELECT * FROM questions WHERE times_sent = ?", [sent_iteration]);

      if (questions.length === 0) {
        sent_iteration++;
        surveys.sendQuestion(notice);
      }
    }

    let question = questions[Math.floor(Math.random() * questions.length)];

    if (notice) {
      client.say(
        config.get('channel'),
        `¡EH GUACHOS! longiiHi Enseguida cae pregunta por ${REWARD} ${config.get('pointsname')}`
      );
    }

    questions = questions.filter(q => q.id !== question.id);

    const randomTime = (Math.floor(Math.random() * 3) + 1) * 30;

    setTimeout(
      () => {
        currentQuestion = question;

        client.say(config.get('channel'), `${question.question}`);

        db.run('UPDATE questions SET times_sent = ? WHERE id = ?', [sent_iteration + 1, question.id]);

        endTimeout = setTimeout(() => {
          const options = [
            "Son unos mancos, con razón no suben en LoL KEKW",
            "Por eso ella no te da bola",
            "Por eso no se ganan el mod",
            "Vayan a jugar a la bolita",
            "¡Eh, respondé put@ put@ put@ put@!",
          ];

          client.say(
            config.get('channel'),
            `Expiró el tiempo para responder. ${options[Math.floor(Math.random() * options.length)]
            }`
          );
          currentQuestion = null;
          endTimeout = null;
        }, 5 * 60 * 1000);
      },
      notice ? randomTime * 1000 : 0
    );
  },
  checkAnswer: async (user, message) => {
    if (currentQuestion) {
      const answers = currentQuestion.answers.split(";");
      if (
        answers.find((a) => message.toLowerCase().includes(a.toLowerCase()))
      ) {
        currentQuestion = null;

        if (endTimeout) {
          clearTimeout(endTimeout);
        }
        endTimeout = null;

        try {
          const userPoints = await utils.getPoints(user.username);
          await db.run(
            "UPDATE points SET quantity = ? WHERE username = ?",
            [userPoints.quantity + REWARD, userPoints.username]
          );
          client.say(
            config.get('channel'),
            `@${user["display-name"]}, respuesta correcta. ¡Ganaste ${REWARD} ${config.get('pointsname')}! longiiEz`
          );
        } catch (err) {
          client.action(config.get('channel'), "Me rompí todo :c");
          return;
        }
      }
    }
  },
  skip: () => {
    currentQuestion = null;
    if (endTimeout) {
      clearTimeout(endTimeout);
    }
    endTimeout = null;
  },
};

module.exports = surveys;
