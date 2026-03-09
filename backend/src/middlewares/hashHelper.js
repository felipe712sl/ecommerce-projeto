const bcrypt = require('bcryptjs');

const PEPPER = process.env.BCRYPT_PEPPER;
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

async function hashPassword(password) {
  // Salt gerado explicitamente
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

  // Pepper concatenado antes de gerar o hash
    const pepperedPassword = password + PEPPER;

  // Hash final: bcrypt aplica o salt automaticamente sobre a senha+pepper
    return await bcrypt.hash(pepperedPassword, salt);
}

async function comparePassword(password, hash) {
  // Mesmo pepper aplicado antes de comparar
    const pepperedPassword = password + PEPPER;
    return await bcrypt.compare(pepperedPassword, hash);
}

module.exports = { hashPassword, comparePassword };