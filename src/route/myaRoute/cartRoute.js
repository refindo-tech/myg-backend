const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/myaController/cartController');
const authMiddleware = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/', authMiddleware.authMiddleware, cartController.getCarts);
router.delete('/clear/', authMiddleware.authMiddleware, cartController.clearCart);

module.exports = router;


