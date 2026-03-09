const pool = require('./database');

async function runMigrations() {
try {

    // Tabela de usuários
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        name       TEXT        NOT NULL,
        email      TEXT        NOT NULL UNIQUE,
        password   TEXT        NOT NULL,
        role       TEXT        NOT NULL DEFAULT 'customer',
        created_at TIMESTAMPTZ DEFAULT NOW()
    )
    `);

    // Tabela de produtos
    await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
        id          SERIAL PRIMARY KEY,
        name        TEXT            NOT NULL,
        description TEXT,
        price       NUMERIC(10,2)   NOT NULL,
        stock       INTEGER         NOT NULL DEFAULT 0,
        image_url   TEXT,
        active      BOOLEAN         NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ DEFAULT NOW()
    )
    `);

    // Tabela de pedidos
    await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER             NOT NULL REFERENCES users(id),
        total       NUMERIC(10,2)       NOT NULL,
        status      TEXT                NOT NULL DEFAULT 'pending',
        created_at  TIMESTAMPTZ DEFAULT NOW()
    )
    `);

    // Tabela de itens do pedido
    await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
        id          SERIAL PRIMARY KEY,
        order_id    INTEGER NOT NULL REFERENCES orders(id),
        product_id  INTEGER NOT NULL REFERENCES products(id),
        quantity    INTEGER NOT NULL,
        price       NUMERIC(10,2) NOT NULL
    )
    `);

    console.log('✅ Tabelas criadas com sucesso!');

} catch (err) {
    console.error('❌ Erro ao criar tabelas:', err.message);
}
}

module.exports = runMigrations;