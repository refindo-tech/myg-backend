const cartService = require('../../services/myaServices/cartService');
const webResponses = require('../../helpers/web/webResponses');
const { addToCartSchema } = require('../../validators/myaValidator/cartValidator');

class CartController {

    async addToCart(req, res) {
        try {
            const { userId } = req.user;
            const { productId } = req.params;
            const { quantity } = req.body;
            const valid = addToCartSchema.validate({ productId, quantity });
            if (!valid) {
                return res.status(400).json(webResponses.errorResponse(addToCartSchema.errors));
            }
            const cart = await cartService.addProductToCart(Number(userId), Number(productId), Number(quantity));
            return res.status(201).json(webResponses.successResponse(cart));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }
    
    async getAllCartItems(req, res) {
        try {
            const { userId } = req.params;
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
            const valid = updateCartItem.validate({ quantity });
            if (!valid) {
                return res.status(400).json(webResponses.errorResponse(updateCartItem.errors));
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