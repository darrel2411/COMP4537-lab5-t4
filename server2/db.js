// This code was developed with assistance from OpenAI's ChatGPT

const mysql = require("mysql");
const STRINGS = require("./lang/en/en.js");

// Single source of truth for the table DDL
const TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS patient (
    patientid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    dateOfBirth DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;
`;

class Database {
  constructor() {
    // Use STRINGS values; you can also override with env vars if you want
    this.connection = mysql.createConnection({
      host: STRINGS.db.host,
      port: STRINGS.db.port,
      user: STRINGS.db.user,
      password: STRINGS.db.password,
      database: STRINGS.db.database,
      // TiDB Serverless requires TLS; empty object enables default OS CA trust
      ssl: {}
    });

    this.initialize();
  }

  initialize() {
    this.connection.connect((err) => {
      if (err) throw err;
      console.log(STRINGS.db.connectSuccess);

      // Ensure table exists on startup
      this.ensureTable((e) => {
        if (e) throw e;
        console.log(STRINGS.db.tableReady);
      });
    });
  }

  ensureTable(cb) {
    this.connection.query(TABLE_SQL, cb);
  }

  /**
   * Run a query; if table is missing (errno 1146), auto-create then retry once.
   */
  query(sql, callback, _retried = false) {
    this.connection.query(sql, (err, rows) => {
      if (err && err.code === "ER_NO_SUCH_TABLE" && !_retried) {
        // Table was dropped during runtime: recreate and retry once
        return this.ensureTable((createErr) => {
          if (createErr) return callback(createErr);
          this.query(sql, callback, true);
        });
      }
      callback(err, rows);
    });
  }

  // Optional: clean shutdown helper
  close(cb) {
    this.connection.end(cb);
  }
}

module.exports = Database;
