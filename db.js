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
          // Table already created, check for missing columns
          db.run(`ALTER TABLE user ADD COLUMN status TEXT`, (err) => {
            if (err) {
              // Column already exists or another error
              console.log('Status column already exists or another error:', err.message);
            } else {
              console.log('Status column added successfully.');
            }
          });
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

// Function to check if a user exists by username
function userExists(username, callback) {
  const query = 'SELECT * FROM user WHERE username = ?';
  db.get(query, [username], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, !!row);
    }
  });
}

module.exports = { db, userExists };
