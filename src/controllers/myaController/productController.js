const productService = require('../../services/myaServices/productService');
const webResponses = require('../../helpers/web/webResponses');
const { createProductSchema, updateProductSchema } = require('../../validators/myaValidator/productValidator');
//Ajv is a JSON Schema validator for both server-side and client-side JavaScript environments.
const Ajv = require('ajv');
const ajv = new Ajv();

async function getAllProduct(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category || '';
        //turn isRecommended to boolean
        const isRecommended = req.query.isRecommended === 'true';
        const product = await productService.getAllProduct(limit, category, isRecommended);
        return res.status(200).json(webResponses.successResponse(product));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(Number(id));
        if (!product) {
            return res.status(404).json(webResponses.errorResponse('Product not found'));
        }
        return res.status(200).json(webResponses.successResponse(product));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function createProduct(req, res) {
    try {
        const { userId } = req.user;
        const { body } = req;
        const valid = ajv.validate(createProductSchema, body);
        if (!valid) {
            return res.status(400).json(webResponses.errorResponse(ajv.errors));
        }
        const product = await productService.createProduct(body, userId);
        return res.status(201).json(webResponses.successResponse(product));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const valid = ajv.validate(updateProductSchema, body);
        if (!valid) {
            return res.status(400).json(webResponses.errorResponse(ajv.errors));
        }
        const product = await productService.updateProduct(Number(id), body);
        return res.status(200).json(webResponses.successResponse(product));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        await productService.deleteProduct(Number(id));
        return res.status(204).json(webResponses.successResponse('Product deleted'));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
