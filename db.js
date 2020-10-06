const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "data.db");

const db = new sqlite3.Database(dbPath, (err) => {
  db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='versions';`,
    [],
    (err, row) => {
      // Start
      if (row === undefined) {
        db.run("CREATE TABLE versions(name text, version int)", [], (err) => {
          console.log(err);
          db.run('INSERT INTO versions(name, version) VALUES ("anime", 1)');
        });
        db.run("CREATE TABLE anime(name text UNIQUE, chapter int)");
      }
    }
  );
});

module.exports = db;
