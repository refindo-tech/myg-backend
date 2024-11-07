const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/myaController/orderController');
const authMiddleware = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/', authMiddleware.authMiddleware, orderController.getOrders);
router.get('/:orderId', authMiddleware.authMiddleware, orderController.getOrder);
router.post('/', authMiddleware.authMiddleware, orderController.createOrder);
router.post('/:productId', authMiddleware.authMiddleware, orderController.createOrderOneProduct);

module.exports = router;


