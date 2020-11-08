const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "data.db");

const upgradeSchema = async (version) => {
  if (version < 1) {
    await db.run("CREATE TABLE anime(name TEXT UNIQUE, chapter INT)");
    await db.run("CREATE TABLE points(username TEXT UNIQUE, quantity INT)");
  }

  if (version < 2) {
    await db.run("ALTER TABLE points ADD displayname TEXT");
  }

  if (version < 3) {
    await db.run("CREATE TABLE questions(id INT NOT NULL PRIMARY KEY, question TEXT, answers TEXT)");
    await db.run("UPDATE schema_version SET version = 3");
  }

  if (version < 4) {
    await db.run("CREATE TABLE blocks(username TEXT, command TEXT)");
    await db.run("UPDATE schema_version SET version = 4");
  }

  if (version < 5) {
    await db.run("CREATE TABLE cooldowns(username TEXT, command TEXT, expiration TEXT)");
    await db.run("ALTER TABLE questions ADD times_sent INT");
    await db.run("UPDATE questions SET times_sent = 0");
    await db.run("UPDATE schema_version SET version = 5");
  }

  if (version < 6) {
    await db.run("CREATE TABLE config(key TEXT, value TEXT)");
    const initialConfig = {
      'options.debug': false,
      'bot.username': 'LongiBot',
      'bot.client_id': '',
      'bot.oauth_token': '',
      'lol.url': 'LAS',
      'lol.api_key': '',
      'lol.account_name': 'Longiniuss',
      'lol.account_id': '1k00Ns1LLRqGtEbP-ew0CmN-2Ru5qvZoRCIj_55clYKm0w',
      'twitch.client_id': '',
      'twitch.secret': '',
      'twitch.broadcaster_id': '58010200',
      'channel': 'Longiinius',
      'owner': "AntuV",
      'pointsname': 'Gold Coins'
    };

    const keys = Object.keys(initialConfig);
    for (let i = 0; i < keys.length; i++) {
      const value = initialConfig[keys[i]];
      await db.run('INSERT INTO config(key, value) VALUES (?, ?)', [keys[i], JSON.stringify(value)]);
    }

    await db.run("UPDATE schema_version SET version = 6");
  }

  if (version < 7) {
    await db.run("CREATE TABLE bets(id INT NOT NULL PRIMARY KEY, subject TEXT, date TEXT, first_option TEXT, second_option TEXT, winner TEXT)");
    await db.run("CREATE TABLE bets_users(bet_id INT NOT NULL, username TEXT, option TEXT, bet INT)");
    await db.run("UPDATE schema_version SET version = 7");
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
  },
  getNextId: async (tableName) => {
    try {
      const row = await db.get(`SELECT MAX(id) as lastId FROM ${tableName}`);
      if (!row) {
        return 1;
      }

      return row.lastId + 1;
    } catch (err) {
      console.error(err);
      return 1;
    }
  }
};

module.exports = db;
