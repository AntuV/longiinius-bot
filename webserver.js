const express = require("express");
const app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
const db = require("./db.js");

app.use(express.static('website'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/website/index.html");
});

io.on("connection", function (socket) {
  console.log("Un cliente se ha conectado");

  socket.on("block", function (username) {
    db.get('SELECT * FROM blocks WHERE username = ?', [username]).then((exists) => {
      if (!exists) {
        db.run('INSERT INTO blocks(username, command) VALUES (?, ?)', [username, 'tts']);
      }
    });
  });
});


const webserver = {
  start: () => {
    server.listen(3700, () => {
      console.log(`Servidor iniciado en el puerto 3700`);
    });
  },
  tts: (user, message) => {
    io.sockets.emit("tts", { display: user['display-name'], username: user.username, message });
  }
};

module.exports = webserver;
