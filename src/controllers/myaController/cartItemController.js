const cartService = require('../../services/myaServices/cartService');
const cartItemService = require('../../services/myaServices/cartItemService');
const webResponses = require('../../helpers/web/webResponses');
const cartValidator = require('../../validators/myaValidator/cartValidator');

const Ajv = require('ajv');
const ajv = new Ajv();

class CartItemController {
    static async addCartItem(req, res) {
        try {
            const { userId } = req.user;
            const productId = parseInt(req.params.productId);
            const { quantity } = req.body;

            const cart = await cartService.getCart(Number(userId));
            if (!cart) {
                cart = await cartService.createCart(Number(userId));
            }

            const valid = ajv.validate(cartValidator.addToCartSchema, { productId, quantity });
            if (!valid) {
                return res.status(400).json(webResponses.errorResponse(ajv.errors));
            }

            console.log('cartId', cart);

            const cartItem = await cartItemService.addCartItem(cart.cartId, productId, quantity);
            return res.status(201).json(webResponses.successResponse(cartItem));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }

    static async updateCartItem(req, res) {
        try {
            const { userId } = req.user;
            const productId = parseInt(req.params.productId);
            const { quantity } = req.body;

            const cart = await cartService.getCart(Number(userId));
            if (!cart) {
                return res.status(404).json(webResponses.errorResponse('Cart not found'));
            }

            const valid = ajv.validate(cartValidator.updateCartItemSchema, { quantity });
            if (!valid) {
                return res.status(400).json(webResponses.errorResponse(ajv.errors));
            }

            const cartItem = await cartItemService.updateCartItem(cart.cartId, productId, quantity);
            return res.status(200).json(webResponses.successResponse(cartItem));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }
    
    static async bulkUpdateCartItems(req, res) {
        try {
            const { userId } = req.user;
            const cartItems = req.body;

            console.log('cartItems', cartItems);

            const cart = await cartService.getCart(Number(userId));
            if (!cart) {
                return res.status(404).json(webResponses.errorResponse('Cart not found'));
            }

            const valid = ajv.validate(cartValidator.bulkUpdateCartItemsSchema, cartItems);
            if (!valid) {
                return res.status(400).json(webResponses.errorResponse(ajv.errors));
            }

            await cartItemService.bulkUpdateCartItems(cart.cartId, cartItems);
            return res.status(200).json(webResponses.successResponse('Cart items updated successfully'));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }

    static async deleteCartItem(req, res) {
        try {
            const { userId } = req.user;
            const productId = parseInt(req.params.productId);

            const cart = await cartService.getCart(Number(userId));
            if (!cart) {
                return res.status(404).json(webResponses.errorResponse('Cart not found'));
            }

            await cartItemService.removeCartItem(cart.cartId, productId);
            return res.status(200).json(webResponses.successResponse('Cart item deleted successfully'));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }
}

module.exports = CartItemController;