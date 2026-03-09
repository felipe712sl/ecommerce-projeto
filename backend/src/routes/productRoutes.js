const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const {
    listProducts,
    getProduct,
    searchProductsHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler
} = require('../controllers/productController');

// Rotas públicas — qualquer um pode ver produtos
router.get('/', listProducts);
router.get('/search', searchProductsHandler);
router.get('/:id', getProduct);

// Rotas protegidas — só admin pode gerenciar produtos
router.post('/', authMiddleware, adminMiddleware, createProductHandler);
router.put('/:id', authMiddleware, adminMiddleware, updateProductHandler);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProductHandler);

module.exports = router;