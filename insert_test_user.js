const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "database.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const username = 'testuser';
const password = 'password';
const publicKey = 'publicKeyPlaceholder';
const privateKey = 'privateKeyPlaceholder';

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  const insert = 'INSERT INTO user (username, password, publicKey, privateKey) VALUES (?,?,?,?)';
  db.run(insert, [username, hashedPassword, publicKey, privateKey], function (err) {
    if (err) {
      console.error('Error inserting test user:', err.message);
    } else {
      console.log('Test user created successfully with ID:', this.lastID);
    }
  });
});
