const pool = require('../config/database');

// Lista apenas produtos ativos
async function getAllProducts() {
    const result = await pool.query(
        'SELECT * FROM products WHERE active = true ORDER BY created_at DESC'
    );
    return result.rows;
}

// Busca por ID apenas se ativo
async function getProductById(id) {
    const result = await pool.query(
        'SELECT * FROM products WHERE id = $1 AND active = true',
        [id]
    );
    return result.rows[0];
}

// Busca por ID ignorando o active (uso interno — para update e soft delete)
async function getProductByIdAdmin(id) {
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

// Busca com filtros — apenas produtos ativos
async function searchProducts({ name, minPrice, maxPrice }) {
    // Constrói a query dinamicamente conforme os filtros enviados
    const conditions = ['active = true'];
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

    const result = await pool.query(
        `SELECT * FROM products WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
        values
    );

    return result.rows;
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
        WHERE id = $6 AND active = true
        RETURNING *`,
        [name, description, price, stock, image_url, id]
    );
    return result.rows[0];
}

// Soft delete — marca como inativo em vez de deletar
async function softDeleteProduct(id) {
    const result = await pool.query(
        `UPDATE products SET active = false WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
}

// Lista todos os produtos incluindo inativos (uso admin)
async function getAllProductsAdmin() {
    const result = await pool.query(
        'SELECT * FROM products ORDER BY created_at DESC'
    );
    return result.rows;
}

// Restaura um produto inativo
async function restoreProduct(id) {
    const result = await pool.query(
        `UPDATE products SET active = true WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
}

module.exports = {
    getAllProducts,
    getAllProductsAdmin,
    getProductById,
    getProductByIdAdmin,
    searchProducts,
    createProduct,
    updateProduct,
    softDeleteProduct,
    restoreProduct
};