const pool = require('../config/database');

async function getAllProducts() {
    const result = await pool.query(
        'SELECT * FROM products ORDER BY created_at DESC'
    );
    return result.rows;
}

async function getProductById(id) {
    const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

async function createProduct(name, description, price, stock, image_url) {
    const result = await pool.query(
        `INSERT INTO products (name, description, price, stock, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [name, description, price, stock, image_url]
    );
    return result.rows[0];
}

async function updateProduct(id, name, description, price, stock, image_url) {
    const result = await pool.query(
        `UPDATE products
        SET name = $1, description = $2, price = $3, stock = $4, image_url = $5
        WHERE id = $6
        RETURNING *`,
        [name, description, price, stock, image_url, id]
    );
    return result.rows[0];
}

async function deleteProduct(id) {
    const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
}

async function searchProducts({ name, minPrice, maxPrice }) {
    // Constrói a query dinamicamente conforme os filtros enviados
    const conditions = [];
    const values = [];
    let index = 1;

    if (name) {
        conditions.push(`name ILIKE $${index}`);
        values.push(`%${name}%`);
        index++;
    }

    if (minPrice) {
        conditions.push(`price >= $${index}`);
        values.push(minPrice);
        index++;
    }

    if (maxPrice) {
        conditions.push(`price <= $${index}`);
        values.push(maxPrice);
        index++;
    }

    const where = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const result = await pool.query(
        `SELECT * FROM products ${where} ORDER BY created_at DESC`,
        values
    );

    return result.rows;
}

module.exports = {
    getAllProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
};