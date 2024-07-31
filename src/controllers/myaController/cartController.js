const cartService = require('../../services/myaServices/cartService');
const webResponses = require('../../helpers/web/webResponses');

class CartController {

    static async getCarts(req, res) {
        try {
            const { userId } = req.user;
            const cart = await cartService.getCart(Number(userId));
            return res.status(200).json(webResponses.successResponse(cart));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }

    static async clearCart(req, res) {
        try {
            const { userId } = req.user;
            await cartService.clearCart(Number(userId));
            return res.status(200).json(webResponses.successResponse('Cart cleared successfully'));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }
}

module.exports = CartController;