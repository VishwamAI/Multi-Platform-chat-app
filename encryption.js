const crypto = require('crypto');

// Function to generate a public/private key pair
function generateKeyPair() {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    }, (err, publicKey, privateKey) => {
      if (err) {
        reject(err);
      } else {
        resolve({ publicKey, privateKey });
      }
    });
  });
}

// Function to encrypt a message using a public key
function encryptMessage(publicKey, message) {
  const buffer = Buffer.from(message, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
}

// Function to decrypt a message using a private key
function decryptMessage(privateKey, encryptedMessage) {
  const buffer = Buffer.from(encryptedMessage, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
}

module.exports = {
  generateKeyPair,
  encryptMessage,
  decryptMessage
};
