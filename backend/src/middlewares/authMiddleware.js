const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

  // Verifica se o token foi enviado no formato correto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

  // Extrai o token do cabeçalho "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role } disponível em todas as rotas protegidas
        next();
    } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}

module.exports = authMiddleware;