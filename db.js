const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "data.db");

const db = new sqlite3.Database(dbPath, async (err) => {
  let initialized = null;
  try {
    initialized = await get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version';"
    );
  } catch (err) {
    //
  }

  if (!initialized) {
    await run("CREATE TABLE schema_version(version int)");
    await run("INSERT INTO schema_version(version) VALUES (0)");
  }

  const schema = await get("SELECT version FROM schema_version");

  if (schema.version === 0) {
    await run("CREATE TABLE anime(name TEXT UNIQUE, chapter INT)");
    await run("CREATE TABLE points(username TEXT UNIQUE, quantity INT)");
  }

  if (schema.version === 1) {
    await run("ALTER TABLE points ADD displayname TEXT;");
  }

  if (schema.version === 2) {
    await run("CREATE TABLE questions(id INT NOT NULL PRIMARY KEY, question TEXT, answers TEXT)");
    await run("INSERT INTO questions(id, question, answers) VALUES (1, ?, ?)", ['¿Cuántos años tiene el capi?', '24']);
    await run("INSERT INTO questions(id, question, answers) VALUES (2, ?, ?)", ['¿Quién es el DJ del barco?', 'shanx;sirshanx']);
    await run("INSERT INTO questions(id, question, answers) VALUES (3, ?, ?)", ['¿Quién es el cocinero del barco?', 'fulkom']);
    await run("INSERT INTO questions(id, question, answers) VALUES (4, ?, ?)", ['¿Quién fue el primer mod?', 'corpus;nax']);
    await run("INSERT INTO questions(id, question, answers) VALUES (5, ?, ?)", ['¿Quién era el dios romano de la guerra?', 'marte']);
    await run("INSERT INTO questions(id, question, answers) VALUES (6, ?, ?)", ['¿Quién era el dios de la guerra?', 'ares;marte;kratos']);
    await run("INSERT INTO questions(id, question, answers) VALUES (7, ?, ?)", ['¿Cuántos tentáculos tiene un calamar?', '8']);
    await run("INSERT INTO questions(id, question, answers) VALUES (8, ?, ?)", ['Aproximadamente, ¿qué porcentaje de la superficie de la Tierra es agua?', '70']);
    await run("INSERT INTO questions(id, question, answers) VALUES (9, ?, ?)", ['¿En qué año murió Bob Marley?', '1981']);
    await run("INSERT INTO questions(id, question, answers) VALUES (10, ?, ?)", ['¿Cuál es el nombre de la "herramienta" necesaria para jugar al billar?', 'taco']);
    await run("INSERT INTO questions(id, question, answers) VALUES (11, ?, ?)", ['¿Qué objeto se convirtió en el símbolo de la película de animación “Akira”?', 'moto']);
    await run("INSERT INTO questions(id, question, answers) VALUES (12, ?, ?)", ['¿Qué le encanta chupar al capi?', 'culos']);
    await run("INSERT INTO questions(id, question, answers) VALUES (13, ?, ?)", ['¿De qué juego sale el nombre Longinius?', 'dota']);
    await run("INSERT INTO questions(id, question, answers) VALUES (14, ?, ?)", ['¿Cuál es el anime favorito del capi?', 'one piece;onepiece']);
    await run("INSERT INTO questions(id, question, answers) VALUES (15, ?, ?)", ['¿Quién es el mejor mod?', 'aimardo;domarai']);
    await run("INSERT INTO questions(id, question, answers) VALUES (16, ?, ?)", ['¿Quién es el mejor en lol del barco?', 'elmorula;lowsenin']);
    await run("INSERT INTO questions(id, question, answers) VALUES (17, ?, ?)", ['¿De de qué país es Genu?', 'peru']);
    await run("INSERT INTO questions(id, question, answers) VALUES (18, ?, ?)", ['¿A qué juega Genu todo el día?', 'genshin;genshin impact']);
    await run("INSERT INTO questions(id, question, answers) VALUES (19, ?, ?)", ['¿Quién donó más subs al barco?', 'antu']);
    await run("INSERT INTO questions(id, question, answers) VALUES (20, ?, ?)", ['¿Qué streamers son más allegados al barco?', 'bestia;be5tia;urlan']);
    await run("INSERT INTO questions(id, question, answers) VALUES (21, ?, ?)", ['¿De qué se alimentan los koalas?', 'eucalipto']);
    await run("INSERT INTO questions(id, question, answers) VALUES (22, ?, ?)", ['¿De qué se alimentan los pandas?', 'bambu;bambú']);
    await run("INSERT INTO questions(id, question, answers) VALUES (23, ?, ?)", ['¿Cuál fue la primera película de Walt Disney?', 'blancanieves;blanca nieves']);
    await run("INSERT INTO questions(id, question, answers) VALUES (24, ?, ?)", ['En One Piece: ¿Cuántos son los Mugiwaras?', '10']);
    await run("INSERT INTO questions(id, question, answers) VALUES (25, ?, ?)", ['En One Piece: ¿Qué enfermedad sufre Monkey D. Luffy?', 'narcolepsia']);
    await run("INSERT INTO questions(id, question, answers) VALUES (26, ?, ?)", ['En One Piece: ¿Cuál es la edad de Luffy?', '19']);
    await run("INSERT INTO questions(id, question, answers) VALUES (27, ?, ?)", ['En One Piece: ¿Cómo se llamó el primer barco de los Mugiwaras?', 'merry']);
    await run("INSERT INTO questions(id, question, answers) VALUES (28, ?, ?)", ['En One Piece: ¿Cuántas mujeres hay en el barco?', '2']);
    await run("INSERT INTO questions(id, question, answers) VALUES (29, ?, ?)", ['En Naruto: ¿Cómo se llama el perro de Kiba?', 'akamaru']);
    await run("INSERT INTO questions(id, question, answers) VALUES (30, ?, ?)", ['¿Cuándo es el cumpleaños de Naruto?', '10 de octubre']);
    await run("INSERT INTO questions(id, question, answers) VALUES (31, ?, ?)", ['En Naruto: ¿Cuál es el equipo 8? a) Shikamaru, Choji, Ino. b) Tenten, Neji, Lee. c) Shino, Kiba, Hinata', 'c']);
    await run("INSERT INTO questions(id, question, answers) VALUES (32, ?, ?)", ['En Naruto: ¿Quién mató a Asuma?', 'hidan']);
    await run("INSERT INTO questions(id, question, answers) VALUES (33, ?, ?)", ['En Naruto: ¿A qué solían jugar Shikamaru y Asuma?', 'shogi']);
    await run("INSERT INTO questions(id, question, answers) VALUES (34, ?, ?)", ['¿Cuál es el personaje de anime preferido por Shanx?', 'brook']);
    await run("INSERT INTO questions(id, question, answers) VALUES (35, ?, ?)", ['¿Cuál es el río más largo del mundo?', 'amazonas']);
    await run("INSERT INTO questions(id, question, answers) VALUES (36, ?, ?)", ['¿Dónde originaron los juegos olímpicos?', 'grecia']);
    await run("INSERT INTO questions(id, question, answers) VALUES (37, ?, ?)", ['¿Cuándo empezó la I Guerra Mundial?', '1914']);
    await run("INSERT INTO questions(id, question, answers) VALUES (38, ?, ?)", ['¿Cuándo acabo la I Guerra Mundial?', '1918']);
    await run("INSERT INTO questions(id, question, answers) VALUES (39, ?, ?)", ['¿Cuándo empezó la II Guerra Mundial?', '1939']);
    await run("INSERT INTO questions(id, question, answers) VALUES (40, ?, ?)", ['¿Cuándo acabó la II Guerra Mundial?', '1945']);
    await run("INSERT INTO questions(id, question, answers) VALUES (41, ?, ?)", ['¿En qué país se encuentra la torre de Pisa?', 'italia']);
    await run("INSERT INTO questions(id, question, answers) VALUES (42, ?, ?)", ['¿Qué año llegó Cristóbal Colón a América?', '1492']);
    await run("INSERT INTO questions(id, question, answers) VALUES (43, ?, ?)", ['¿Qué producto cultiva más Guatemala?', 'cafe;café']);
    await run("INSERT INTO questions(id, question, answers) VALUES (44, ?, ?)", ['¿Qué estudia la cartografía?', 'mapa']);
    await run("INSERT INTO questions(id, question, answers) VALUES (45, ?, ?)", ['¿Cuál es el país más grande del mundo?', 'rusia']);
    await run("INSERT INTO questions(id, question, answers) VALUES (46, ?, ?)", ['¿Qué país tiene forma de bota?', 'italia']);
    await run("INSERT INTO questions(id, question, answers) VALUES (47, ?, ?)", ['¿Cuál es tercer planeta en el sistema solar?', 'tierra']);
    await run("INSERT INTO questions(id, question, answers) VALUES (48, ?, ?)", ['¿Cuál es el color que representa la esperanza?', 'verde']);
    await run("INSERT INTO questions(id, question, answers) VALUES (49, ?, ?)", ['¿Cuántas patas tiene la araña?', '8']);
    await run("INSERT INTO questions(id, question, answers) VALUES (50, ?, ?)", ['¿Cómo se llama el animal más rápido del mundo?', 'guepardo']);
    await run("INSERT INTO questions(id, question, answers) VALUES (51, ?, ?)", ['¿Cuál es el único mamífero capaz de volar?', 'murciélago;murcielago']);
    await run("INSERT INTO questions(id, question, answers) VALUES (52, ?, ?)", ['¿Cómo se llama el proceso por el cual las plantas obtienen alimento?', 'fotosintesis;fotosíntesis']);
    await run("INSERT INTO questions(id, question, answers) VALUES (53, ?, ?)", ['¿Cuánto vale el número pi?', '3.14159265359']);
    await run("INSERT INTO questions(id, question, answers) VALUES (54, ?, ?)", ['¿Cómo se llama el fundador de Facebook?', 'mark zuckerberg']);
  }

  await run("UPDATE schema_version SET version = 3");
});

function run(query, params) {
  if (params === undefined) {
    params = [];
  }

  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function get(query, params) {
  if (params === undefined) {
    params = [];
  }

  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
}

module.exports = db;
