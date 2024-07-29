const OrderService = require('../../services/myaServices/orderService');
const webResponses = require('../../helpers/web/webResponses');
const xenditConfig = require('../../helpers/config/xenditConfig');

//xendit
const { Invoice } = xenditConfig;
const invoice = new Invoice();

class OrderController {

    static async getOrders(req, res) {
        try {
            const { userId } = req.user;
            const orders = await OrderService.getOrdersByUser(userId);
            return res.status(200).json(webResponses.successResponse(orders));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }

    static async createOrder(req, res) {
        try {
            const { userId } = req.user;

            const order = await OrderService.createOrder(userId);

            //Xendit API call to create payment

            return res.status(201).json(webResponses.successResponse(order));
        } catch (error) {
            return res.status(500).json(webResponses.errorResponse(error.message));
        }
    }

    // Other order-related methods (e.g., getOrderById, getOrdersByUser, etc.) can go here...
}

module.exports = OrderController;