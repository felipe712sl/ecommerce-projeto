const express = require('express');
const cors = require('cors');
const runMigrations = require('./config/migrations');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cria as tabelas ao iniciar
runMigrations();

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

module.exports = app;