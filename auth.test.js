const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateKeyPair } = require('./encryption');
const db = require('./db');
const { router } = require('./auth');

const app = express();
app.use(express.json());
app.use('/auth', router);

const JWT_SECRET = 'your_jwt_secret';

describe('Authentication Routes', () => {
  beforeAll((done) => {
    db.run('DELETE FROM user', done);
  });

  test('User registration', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('publicKey');

    const query = 'SELECT * FROM user WHERE username = ?';
    db.get(query, ['testuser'], (err, row) => {
      expect(row).toBeTruthy();
      expect(row.username).toBe('testuser');
      bcrypt.compare('testpassword', row.password, (err, result) => {
        expect(result).toBe(true);
      });
    });
  });

  test('User login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('publicKey');
  });

  test('Invalid login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid username or password');
  });
});
