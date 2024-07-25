const cartService = require('../../services/myaServices/cartService');
const webResponses = require('../../helpers/web/webResponses');
const cartValidator = require('../../validators/myaValidator/cartValidator');

const Ajv = require('ajv');
const ajv = new Ajv();

class CartController {

    async addToCart(req, res) {
        try {
            const { userId } = req.user;
            const productId = parseInt(req.params.productId);
            const { quantity } = req.body;
            const valid = ajv.validate(cartValidator.addToCartSchema, { productId, quantity });
            if (!valid) {
                return res.status(400).json(webResponses.errorResponse(ajv.errors));
            }
            const cart = await cartService.addProductToCart(Number(userId), Number(productId), Number(quantity));
            return res.status(201).json(webResponses.successResponse(cart));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }
    
    async getAllCartItems(req, res) {
        console.log('Get all cart items');
        try {
            const { userId } = req.user;
            const cart = await cartService.getAllCartItems(Number(userId));
            return res.status(200).json(webResponses.successResponse(cart));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }

    async deleteCartItem(req, res) {
        try {
            const { cartId } = req.params;
            await cartService.deleteCartItem(Number(cartId));
            return res.status(200).json(webResponses.successResponse('Cart item deleted successfully'));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }

    async updateCartItem(req, res) {
        try {
            const { cartId } = req.params;
            const { quantity } = req.body;
            const valid = ajv.validate(cartValidator.updateCartItemSchema, { quantity });
            if (!valid) {
                return res.status(400).json(webResponses.errorResponse(ajv.errors));
            }
            await cartService.updateCartItem(Number(cartId), Number(quantity));
            return res.status(200).json(webResponses.successResponse('Cart item updated successfully'));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }

    async clearCart(req, res) {
        try {
            const { userId } = req.user;
            await cartService.clearCart(Number(userId));
            return res.status(200).json(webResponses.successResponse('Cart cleared successfully'));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }
}

module.exports = new CartController();