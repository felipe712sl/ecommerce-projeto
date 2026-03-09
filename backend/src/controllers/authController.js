const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../middlewares/hashHelper');

async function register(req, res) {
try {
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    // Verifica se email já existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }

    // Gera hash com salt explícito + pepper
    const hashedPassword = await hashPassword(password);

    // Salva no banco
    const user = await createUser(name, email, hashedPassword);

    // Gera o token JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(201).json({ user, token });

    } catch (err) {
        console.error('Erro no cadastro:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

async function login(req, res) {
try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // Busca o usuário no banco
    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    // Compara senha + pepper com o hash do banco
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove a senha antes de enviar a resposta
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword, token });

} catch (err) {
    console.error('Erro no login:', err.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

module.exports = { register, login };