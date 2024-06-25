const express = require('express');
const { authenticateToken } = require('./auth');
const db = require('./db');

const router = express.Router();

// Route to send a message from one user to another
router.post('/send', authenticateToken, (req, res) => {
  const { sender, receiver, message } = req.body;

  const query = 'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)';
  db.run(query, [sender, receiver, message], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Message sent successfully' });
  });
});

// Route to get message history between two users
router.get('/history/:user1/:user2', authenticateToken, (req, res) => {
  const { user1, user2 } = req.params;

  const query = `
    SELECT * FROM messages
    WHERE (sender = ? AND receiver = ?)
       OR (sender = ? AND receiver = ?)
    ORDER BY timestamp ASC
  `;
  db.all(query, [user1, user2, user2, user1], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ messages: rows });
  });
});

module.exports = router;
