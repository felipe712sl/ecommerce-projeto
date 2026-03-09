const {
    getAllProducts,
    getAllProductsAdmin,
    getProductById,
    getProductByIdAdmin,
    searchProducts,
    createProduct,
    updateProduct,
    softDeleteProduct,
    restoreProduct
} = require('../models/productModel');

// Público — lista apenas produtos ativos
async function listProducts(req, res) {
    try {
        const products = await getAllProducts();
        return res.status(200).json(products);
    } catch (err) {
        console.error('Erro ao listar produtos:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// Admin — lista todos incluindo inativos
async function listAllProductsAdmin(req, res) {
    try {
        const products = await getAllProductsAdmin();
        return res.status(200).json(products);
    } catch (err) {
        console.error('Erro ao listar produtos admin:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// Público — busca por ID apenas se ativo
async function getProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await getProductById(id);

        if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        return res.status(200).json(product);
    } catch (err) {
        console.error('Erro ao buscar produto:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// Público — busca com filtros
async function searchProductsHandler(req, res) {
    try {
        const { name, minPrice, maxPrice } = req.query;

        if (minPrice && isNaN(minPrice)) {
        return res.status(400).json({ error: 'Preço mínimo inválido.' });
        }

        if (maxPrice && isNaN(maxPrice)) {
        return res.status(400).json({ error: 'Preço máximo inválido.' });
        }

        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return res.status(400).json({ error: 'Preço mínimo não pode ser maior que o máximo.' });
        }

        const products = await searchProducts({
        name,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null
        });

        if (products.length === 0) {
        return res.status(404).json({ message: 'Nenhum produto encontrado.' });
        }

        return res.status(200).json(products);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// Admin — cria produto
async function createProductHandler(req, res) {
    try {
        const { name, description, price, stock, image_url } = req.body;

        if (!name || !price) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
        }

        if (price <= 0) {
        return res.status(400).json({ error: 'O preço deve ser maior que zero.' });
        }

        if (stock < 0) {
        return res.status(400).json({ error: 'O estoque não pode ser negativo.' });
        }

        const product = await createProduct(
        name,
        description || null,
        price,
        stock || 0,
        image_url || null
        );

        return res.status(201).json(product);
    } catch (err) {
        console.error('Erro ao criar produto:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// Admin — atualiza produto
async function updateProductHandler(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image_url } = req.body;

        const existingProduct = await getProductByIdAdmin(id);
        if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        if (price <= 0) {
        return res.status(400).json({ error: 'O preço deve ser maior que zero.' });
        }

        if (stock < 0) {
        return res.status(400).json({ error: 'O estoque não pode ser negativo.' });
        }

        const product = await updateProduct(
        id,
        name || existingProduct.name,
        description ?? existingProduct.description,
        price || existingProduct.price,
        stock ?? existingProduct.stock,
        image_url ?? existingProduct.image_url
        );

        return res.status(200).json(product);
    } catch (err) {
        console.error('Erro ao atualizar produto:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// Admin — soft delete
async function deleteProductHandler(req, res) {
    try {
        const { id } = req.params;

        const existingProduct = await getProductByIdAdmin(id);
        if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        if (!existingProduct.active) {
        return res.status(400).json({ error: 'Produto já está inativo.' });
        }

        const product = await softDeleteProduct(id);
        return res.status(200).json({
        message: 'Produto desativado com sucesso.',
        product
        });
    } catch (err) {
        console.error('Erro ao desativar produto:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// Admin — restaura produto inativo
async function restoreProductHandler(req, res) {
    try {
        const { id } = req.params;

        const existingProduct = await getProductByIdAdmin(id);
        if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        if (existingProduct.active) {
        return res.status(400).json({ error: 'Produto já está ativo.' });
        }

        const product = await restoreProduct(id);
        return res.status(200).json({
        message: 'Produto restaurado com sucesso.',
        product
        });
    } catch (err) {
        console.error('Erro ao restaurar produto:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

module.exports = {
    listProducts,
    listAllProductsAdmin,
    getProduct,
    searchProductsHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
    restoreProductHandler
};