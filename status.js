const express = require('express');
const { authenticateToken } = require('./auth');
const db = require('./db');

const router = express.Router();

// Route to update user status
router.post('/status', authenticateToken, (req, res) => {
  const { username } = req.user;
  const { status } = req.body;

  const query = 'UPDATE user SET status = ? WHERE username = ?';
  db.run(query, [status, username], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Status updated successfully' });
  });
});

// Route to get user status
router.get('/status/:username', (req, res) => {
  const { username } = req.params;

  const query = 'SELECT status FROM user WHERE username = ?';
  db.get(query, [username], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ status: row.status });
  });
});

module.exports = router;
