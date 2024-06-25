const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateKeyPair } = require('./encryption');
const db = require('./db');

const router = express.Router();

const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret in production

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

  const query = 'SELECT * FROM user WHERE username = ?';
  db.get(query, [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (!row || !(await bcrypt.compare(password, row.password))) {
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
