const {
    getAllProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../models/productModel');

async function listProducts(req, res) {
    try {
        const products = await getAllProducts();
        return res.status(200).json(products);
    } catch (err) {
        console.error('Erro ao listar produtos:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

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

async function updateProductHandler(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image_url } = req.body;

        const existingProduct = await getProductById(id);
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

async function deleteProductHandler(req, res) {
    try {
        const { id } = req.params;

        const existingProduct = await getProductById(id);
        if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        await deleteProduct(id);
        return res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (err) {
        console.error('Erro ao deletar produto:', err.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

async function searchProductsHandler(req, res) {
    try {
        const { name, minPrice, maxPrice } = req.query;

        // Validação dos preços
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

module.exports = {
    listProducts,
    getProduct,
    searchProductsHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler
};