const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            publicKey TEXT,
            privateKey TEXT,
            status TEXT
        )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          const insert = 'INSERT INTO user (username, password, publicKey, privateKey, status) VALUES (?,?,?,?,?)';
          db.run(insert, ["admin", "admin123456", "publicKey", "privateKey", ""]);
        }
      });

    db.run(`CREATE TABLE messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT,
            receiver TEXT,
            message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender) REFERENCES user (username),
            FOREIGN KEY (receiver) REFERENCES user (username)
        )`,
      (err) => {
        if (err) {
          // Table already created
        }
      });
  }
});

module.exports = db;
