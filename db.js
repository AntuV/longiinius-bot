const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "data.db");

const upgradeSchema = async (version) => {
  if (version < 1) {
    await db.run("CREATE TABLE anime(name TEXT UNIQUE, chapter INT)");
    await db.run("CREATE TABLE points(username TEXT UNIQUE, quantity INT)");
  }

  if (version < 2) {
    await db.run("ALTER TABLE points ADD displayname TEXT;");
  }

  if (version < 3) {
    await db.run("CREATE TABLE questions(id INT NOT NULL PRIMARY KEY, question TEXT, answers TEXT)");
    await db.run("INSERT INTO questions(id, question, answers) VALUES (1, ?, ?)", ['¿Cuántos años tiene el capi?', '24']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (2, ?, ?)", ['¿Quién es el DJ del barco?', 'shanx;sirshanx']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (3, ?, ?)", ['¿Quién es el cocinero del barco?', 'fulkom']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (4, ?, ?)", ['¿Quién fue el primer mod?', 'corpus;nax']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (5, ?, ?)", ['¿Quién era el dios romano de la guerra?', 'marte']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (6, ?, ?)", ['¿Quién era el dios de la guerra?', 'ares;marte;kratos']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (7, ?, ?)", ['¿Cuántos tentáculos tiene un calamar?', '8']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (8, ?, ?)", ['Aproximadamente, ¿qué porcentaje de la superficie de la Tierra es agua?', '70']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (9, ?, ?)", ['¿En qué año murió Bob Marley?', '1981']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (10, ?, ?)", ['¿Cuál es el nombre de la "herramienta" necesaria para jugar al billar?', 'taco']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (11, ?, ?)", ['¿Qué objeto se convirtió en el símbolo de la película de animación “Akira”?', 'moto']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (12, ?, ?)", ['¿Qué le encanta chupar al capi?', 'culos']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (13, ?, ?)", ['¿De qué juego sale el nombre Longinius?', 'dota']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (14, ?, ?)", ['¿Cuál es el anime favorito del capi?', 'one piece;onepiece']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (15, ?, ?)", ['¿Quién es el mejor mod?', 'aimardo;domarai']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (16, ?, ?)", ['¿Quién es el mejor en lol del barco?', 'elmorula;lowsenin']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (17, ?, ?)", ['¿De de qué país es Genu?', 'peru']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (18, ?, ?)", ['¿A qué juega Genu todo el día?', 'genshin;genshin impact']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (19, ?, ?)", ['¿Quién donó más subs al barco?', 'antu']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (20, ?, ?)", ['¿Qué streamers son más allegados al barco?', 'bestia;be5tia;urlan']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (21, ?, ?)", ['¿De qué se alimentan los koalas?', 'eucalipto']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (22, ?, ?)", ['¿De qué se alimentan los pandas?', 'bambu;bambú']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (23, ?, ?)", ['¿Cuál fue la primera película de Walt Disney?', 'blancanieves;blanca nieves']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (24, ?, ?)", ['En One Piece: ¿Cuántos son los Mugiwaras?', '10']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (25, ?, ?)", ['En One Piece: ¿Qué enfermedad sufre Monkey D. Luffy?', 'narcolepsia']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (26, ?, ?)", ['En One Piece: ¿Cuál es la edad de Luffy?', '19']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (27, ?, ?)", ['En One Piece: ¿Cómo se llamó el primer barco de los Mugiwaras?', 'merry']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (28, ?, ?)", ['En One Piece: ¿Cuántas mujeres hay en el barco?', '2']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (29, ?, ?)", ['En Naruto: ¿Cómo se llama el perro de Kiba?', 'akamaru']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (30, ?, ?)", ['¿Cuándo es el cumpleaños de Naruto?', '10 de octubre']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (31, ?, ?)", ['En Naruto: ¿Cuál es el equipo 8? a) Shikamaru, Choji, Ino. b) Tenten, Neji, Lee. c) Shino, Kiba, Hinata', 'c']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (32, ?, ?)", ['En Naruto: ¿Quién mató a Asuma?', 'hidan']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (33, ?, ?)", ['En Naruto: ¿A qué solían jugar Shikamaru y Asuma?', 'shogi']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (34, ?, ?)", ['¿Cuál es el personaje de anime preferido por Shanx?', 'brook']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (35, ?, ?)", ['¿Cuál es el río más largo del mundo?', 'amazonas']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (36, ?, ?)", ['¿Dónde originaron los juegos olímpicos?', 'grecia']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (37, ?, ?)", ['¿Cuándo empezó la I Guerra Mundial?', '1914']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (38, ?, ?)", ['¿Cuándo acabo la I Guerra Mundial?', '1918']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (39, ?, ?)", ['¿Cuándo empezó la II Guerra Mundial?', '1939']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (40, ?, ?)", ['¿Cuándo acabó la II Guerra Mundial?', '1945']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (41, ?, ?)", ['¿En qué país se encuentra la torre de Pisa?', 'italia']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (42, ?, ?)", ['¿Qué año llegó Cristóbal Colón a América?', '1492']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (43, ?, ?)", ['¿Qué producto cultiva más Guatemala?', 'cafe;café']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (44, ?, ?)", ['¿Qué estudia la cartografía?', 'mapa']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (45, ?, ?)", ['¿Cuál es el país más grande del mundo?', 'rusia']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (46, ?, ?)", ['¿Qué país tiene forma de bota?', 'italia']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (47, ?, ?)", ['¿Cuál es tercer planeta en el sistema solar?', 'tierra']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (48, ?, ?)", ['¿Cuál es el color que representa la esperanza?', 'verde']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (49, ?, ?)", ['¿Cuántas patas tiene la araña?', '8']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (50, ?, ?)", ['¿Cómo se llama el animal más rápido del mundo?', 'guepardo']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (51, ?, ?)", ['¿Cuál es el único mamífero capaz de volar?', 'murciélago;murcielago']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (52, ?, ?)", ['¿Cómo se llama el proceso por el cual las plantas obtienen alimento?', 'fotosintesis;fotosíntesis']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (53, ?, ?)", ['¿Cuánto vale el número pi?', '3.14159265359']);
    await db.run("INSERT INTO questions(id, question, answers) VALUES (54, ?, ?)", ['¿Cómo se llama el fundador de Facebook?', 'mark zuckerberg']);

    await db.run("UPDATE schema_version SET version = 3");
  }

  if (version < 4) {
    await db.run("CREATE TABLE blocks(username TEXT, command TEXT)");
    await db.run("UPDATE schema_version SET version = 4");
  }
  
}

const db = {
  raw: new sqlite3.Database(dbPath, async (err) => {
    let initialized = null;
    try {
      initialized = await db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version';"
      );
    } catch (err) {
      //
    }
  
    if (!initialized) {
      await db.run("CREATE TABLE schema_version(version int)");
      await db.run("INSERT INTO schema_version(version) VALUES (0)");
    }
  
    const schema = await db.get("SELECT version FROM schema_version");
  
    upgradeSchema(schema.version);
  }),
  run: (query, params) => {
    if (params === undefined) {
      params = [];
    }
  
    return new Promise((resolve, reject) => {
      db.raw.run(query, params, (err) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve();
      });
    });
  },
  get: (query, params) => {
    if (params === undefined) {
      params = [];
    }
  
    return new Promise((resolve, reject) => {
      db.raw.get(query, params, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(row);
      });
    });
  },
  all: (query, params) => {
    if (params === undefined) {
      params = [];
    }
  
    return new Promise((resolve, reject) => {
      db.raw.all(query, params, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(row);
      });
    });
  }
};

module.exports = db;
