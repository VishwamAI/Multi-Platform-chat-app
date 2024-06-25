const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateKeyPair } = require('./encryption');
const { db } = require('./db'); // Correctly destructure the db object

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret'; // Use environment variable for JWT secret

// User registration route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM user WHERE username = ?';
  db.get(query, [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (row) {
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { publicKey, privateKey } = await generateKeyPair();
      const insert = 'INSERT INTO user (username, password, publicKey, privateKey) VALUES (?,?,?,?)';
      db.run(insert, [username, hashedPassword, publicKey, privateKey], function (err) {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, publicKey });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error generating key pair', error });
    }
  });
});

// User login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log(`Login attempt with username: ${username} and password: ${password}`);

  const query = 'SELECT * FROM user WHERE username = ?';
  db.get(query, [username], async (err, row) => {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (!row) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, row.password);
    console.log(`Password match: ${passwordMatch}`);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, publicKey: row.publicKey });
  });
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = { router, authenticateToken };