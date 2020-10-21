const db = require("../db.js");
const config = require("config");
const client = require("../client.js");
const activeChannel = config.get("channel");
const pointsname = config.get("pointsname");

const REWARD = 15;

let questionsSent = [];
let currentQuestion = null;
let endTimeout = null;

/**
 * Cada 30 minutos se fija si está en vivo y envía una pregunta
 */
setInterval(() => {
  if (surveys.running) {
    surveys.sendQuestion(true);
  }
}, 30 * 60 * 1000);

const surveys = {
  running: false,
  sendQuestion: async (notice) => {
    if (currentQuestion) {
      return;
    }

    db.raw.all(
      "SELECT * FROM questions WHERE id NOT IN (" +
        questionsSent.join(",") +
        ")",
      [],
      (err, questions) => {
        // Si ya se preguntaron todas, reseteo
        if (questions.length === 0) {
          questionsSent = [];
          surveys.sendQuestion(notice);
          return;
        }

        let question = questions[Math.floor(Math.random() * questions.length)];

        if (notice) {
          client.say(
            activeChannel,
            `¡EH GUACHOS! longiiHi En un minuto cae pregunta por ${REWARD} ${pointsname}`
          );
        }

        questionsSent.push(question.id);

        setTimeout(
          () => {
            currentQuestion = question;

            client.say(activeChannel, `${question.question}`);

            endTimeout = setTimeout(() => {
              const options = [
                "Son unos mancos, con razón no suben en LoL KEKW",
                "Por eso ella no te da bola",
                "Por eso no se ganan el mod",
                "Vayan a jugar a la bolita",
                "¡Eh, respondé put@ put@ put@ put@!",
              ];

              client.say(
                activeChannel,
                `Expiró el tiempo para responder. ${
                  options[Math.floor(Math.random() * options.length)]
                }`
              );
              currentQuestion = null;
              endTimeout = null;
            }, 5 * 60 * 1000);
          },
          notice ? 60 * 1000 : 0
        );
      }
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
          const userPoints = await db.get(
            "SELECT * FROM points WHERE username = ?",
            [user.username]
          );
          if (!userPoints) {
            await db.run(
              "INSERT INTO points(username, displayname, quantity) VALUES (?, ?, ?)",
              [user.username, user["display-name"], 0]
            );
          } else {
            await db.run(
              "UPDATE points SET quantity = ? WHERE username = ?",
              [userPoints.quantity + REWARD, userPoints.username]
            );
            client.say(
              activeChannel,
              `@${user["display-name"]}, respuesta correcta. ¡Ganaste ${REWARD} ${pointsname}! longiiEz`
            );
          }
        } catch (err) {
          client.action(activeChannel, "Me rompí todo :c");
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
