const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const {
    listProducts,
    listAllProductsAdmin,
    getProduct,
    searchProductsHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
    restoreProductHandler
} = require('../controllers/productController');

// Rotas públicas
router.get('/', listProducts);
router.get('/search', searchProductsHandler);
router.get('/:id', getProduct);

// Rotas protegidas — só admin
router.get('/admin/all', authMiddleware, adminMiddleware, listAllProductsAdmin);
router.post('/', authMiddleware, adminMiddleware, createProductHandler);
router.put('/:id', authMiddleware, adminMiddleware, updateProductHandler);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProductHandler);
router.patch('/:id/restore', authMiddleware, adminMiddleware, restoreProductHandler);

module.exports = router;