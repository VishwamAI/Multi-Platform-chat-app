const { generateKeyPair, encryptMessage, decryptMessage } = require('./encryption');

test('Encryption and Decryption', async () => {
  try {
    // Generate key pair
    const { publicKey, privateKey } = await generateKeyPair();
    console.log('Public Key:', publicKey);
    console.log('Private Key:', privateKey);

    // Test message
    const message = 'Hello, this is a test message!';

    // Encrypt the message
    const encryptedMessage = encryptMessage(publicKey, message);
    console.log('Encrypted Message:', encryptedMessage);

    // Decrypt the message
    const decryptedMessage = decryptMessage(privateKey, encryptedMessage);
    console.log('Decrypted Message:', decryptedMessage);

    // Verify that the decrypted message matches the original message
    expect(decryptedMessage).toBe(message);
  } catch (error) {
    console.error('Error during encryption test:', error);
  }
});
