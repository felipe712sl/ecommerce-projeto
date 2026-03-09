require('dotenv').config();
const { hashPassword } = require('./src/middlewares/hashHelper');
hashPassword('teste123')
  .then(h => console.log('Hash gerado:', h))
  .catch(err => console.error('Erro no hash:', err.message));
