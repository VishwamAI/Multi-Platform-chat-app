const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { generateKeyPair, encryptMessage, decryptMessage } = require('./encryption');
const { router: authRouter, authenticateToken } = require('./auth');
const statusRouter = require('./status');
const messagesRouter = require('./messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/status', statusRouter);
app.use('/messages', messagesRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.user = user;
    next();
  });
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle message sending
  socket.on('sendMessage', async ({ publicKey, message }) => {
    try {
      const encryptedMessage = encryptMessage(publicKey, message);
      io.emit('receiveMessage', { encryptedMessage });
    } catch (error) {
      console.error('Error encrypting message:', error);
    }
  });

  // Handle message receiving
  socket.on('receiveMessage', async ({ privateKey, encryptedMessage }) => {
    try {
      const decryptedMessage = decryptMessage(privateKey, encryptedMessage);
      socket.emit('messageDecrypted', { decryptedMessage });
    } catch (error) {
      console.error('Error decrypting message:', error);
    }
  });

  // Handle video call signaling
  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from });
  });

  socket.on('acceptCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
