// This code was developed with assistance from OpenAI's ChatGPT

const mysql = require("mysql");
const STRINGS = require("./lang/en/en.js");

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: STRINGS.db.host,
      port: STRINGS.db.port,
      user: STRINGS.db.user,
      password: STRINGS.db.password,
      database: STRINGS.db.database,
    });

    this.initialize();
  }

  initialize() {
    this.connection.connect((err) => {
      if (err) throw err;
      console.log(STRINGS.db.connectSuccess);

      const createTable = `
        CREATE TABLE IF NOT EXISTS patient (
          patientid INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          dateOfBirth DATETIME
        ) ENGINE=InnoDB;
      `;
      this.connection.query(createTable, (err) => {
        if (err) throw err;
        console.log(STRINGS.db.tableReady);
      });
    });
  }

  query(sql, callback) {
    this.connection.query(sql, callback);
  }
}

module.exports = Database;