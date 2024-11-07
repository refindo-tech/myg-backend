const express = require('express');
const router = express.Router();
const cartItemController = require('../../controllers/myaController/cartItemController');
const authMiddleware = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.post('/item/:productId', authMiddleware.authMiddleware, cartItemController.addCartItem);
router.put('/item/bulk', authMiddleware.authMiddleware, cartItemController.bulkUpdateCartItems);
router.put('/item/:productId', authMiddleware.authMiddleware, cartItemController.updateCartItem);
router.delete('/item/:productId', authMiddleware.authMiddleware, cartItemController.deleteCartItem);

module.exports = router;


