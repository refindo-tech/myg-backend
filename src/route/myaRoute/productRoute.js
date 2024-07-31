const express = require('express');
const router = express.Router();
const productController = require(`../../controllers/myaController/productController`);
const authMiddleware = require('../../middlewares/authMiddleware');

router.use((req, res, next) => {
    const allowedOrigins = ['http://92.112.192.81:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'];
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

router.get('/', productController.getAllProduct);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware.verifyToken, productController.createProduct);
router.put('/:id', authMiddleware.verifyToken, productController.updateProduct);
router.delete('/:id', authMiddleware.verifyToken, productController.deleteProduct);

module.exports = router;