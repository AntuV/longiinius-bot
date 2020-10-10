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

  await run("UPDATE schema_version SET version = 2");
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
