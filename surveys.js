const db = require("./db.js");
const config = require("config");
const client = require("./client.js");
const activeChannel = config.get("channel");
const pointsname = config.get("pointsname");

const REWARD = 15;

let questionsSent = [];
let currentQuestion = null;
let endTimeout = null;

const surveys = {
  sendQuestion: async () => {
    db.all("SELECT * FROM questions", [], (err, questions) => {
      if (questions.length === questionsSent.length) {
        return;
      }

      let question = questions[Math.floor(Math.random() * questions.length)];

      while (questionsSent.indexOf(question.id) !== -1) {
        question = questions[Math.floor(Math.random() * questions.length)];
      }

      if (!question) {
        return;
      }

      client.say(
        activeChannel,
        `¡EH GUACHOS! longiiHi En un minuto cae pregunta por ${REWARD} ${pointsname}`
      );

      setTimeout(() => {
        currentQuestion = question;
        
        client.say(
          activeChannel,
          `${question.question}`
        );

        endTimeout = setTimeout(() => {

          const options = ['Son unos mancos, con razón no suben de rango KEKW', 'Por eso ella no te da bola', 'Por eso no se ganan el mod', 'Vayan a jugar a la bolita', '¡Eh, respondé put@ put@ put@ put@!'];

          client.say(
            activeChannel,
            `Expiró el tiempo para responder. ${options[Math.floor(Math.random() * options.length)]}`
          );
          currentQuestion = null;
          endTimeout = null;
        }, 5 * 60 * 1000)
      }, 60 * 1000);

    });
  },
  checkAnswer: (user, message) => {
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

        db.get(
          "SELECT * FROM points WHERE username = ?",
          [user.username],
          (err, userPoints) => {
            if (err) {
              client.action(activeChannel, "Me rompí todo :c");
              return;
            } else if (!userPoints) {
              db.run(
                "INSERT INTO points(username, displayname, quantity) VALUES (?, ?, ?)",
                [user.username, user["display-name"], REWARD]
              );
            }

            db.run(
              "UPDATE points SET quantity = ? WHERE username = ?",
              [userPoints.quantity + REWARD, userPoints.username],
              (err) => {
                client.say(
                  activeChannel,
                  `@${user["display-name"]}, respuesta correcta. ¡Ganaste ${REWARD} ${pointsname}! longiiEz`
                );
              }
            );
          }
        );
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
  reset: () => {
    questionsSent = [];
    if (endTimeout) {
      clearTimeout(endTimeout);
    }
    endTimeout = null;
  },
};

module.exports = surveys;
