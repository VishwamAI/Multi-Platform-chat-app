const bcrypt = require('bcrypt');

const plaintextPassword = 'password';
const storedHash = '$2b$10$fNScSWIETW2H6PzdU5MPcOKo11jJY45y7ZfyxyqqvSUvr3z1NI2Ye';

bcrypt.compare(plaintextPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error comparing password:', err);
  } else if (result) {
    console.log('Password matches the stored hash.');
  } else {
    console.log('Password does not match the stored hash.');
  }
});
