const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const username = 'exampleUser';

const query = 'SELECT status FROM user WHERE username = ?';
db.get(query, [username], (err, row) => {
  if (err) {
    console.error('Database query error:', err);
  } else if (!row) {
    console.log('User not found');
  } else {
    console.log('User status:', row.status);
  }
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err);
    } else {
      console.log('Database connection closed.');
    }
  });
});
