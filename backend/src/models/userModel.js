const pool = require('../config/database');

async function findUserByEmail(email) {
    const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
    );
    return result.rows[0];
}

async function createUser(name, email, hashedPassword) {
    const result = await pool.query(
    `INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword]
    );
    return result.rows[0];
}

module.exports = { findUserByEmail, createUser };