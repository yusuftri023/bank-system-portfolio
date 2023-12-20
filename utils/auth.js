const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function checkPassword(password, hashedPassword) {
  const isCorrect = await bcrypt.compare(password, hashedPassword);
  return isCorrect;
}
module.exports = { checkPassword, hashPassword };
