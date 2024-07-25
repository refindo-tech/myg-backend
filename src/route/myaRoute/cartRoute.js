const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/myaController/cartController');
const authMiddleware = require('../../middlewares/authMiddleware');


router.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }
    next();
});

router.post('/add/:productId', authMiddleware.verifyToken, cartController.addToCart);
//get cart item based on user id
router.get('/', authMiddleware.verifyToken, cartController.getAllCartItems);
router.delete('/delete/:cartId', cartController.deleteCartItem);
router.put('/update/:cartId', authMiddleware.verifyToken, cartController.updateCartItem);
router.delete('/clear/:userId', authMiddleware.verifyToken, cartController.clearCart);

module.exports = router;


