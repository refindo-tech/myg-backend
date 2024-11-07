const express = require('express');
const router = express.Router();
const productController = require(`../../controllers/myaController/productController`);
const authMiddleware = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/', productController.getAllProduct);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware.verifyToken, productController.createProduct);
router.put('/:id', authMiddleware.verifyToken, productController.updateProduct);
router.delete('/:id', authMiddleware.verifyToken, productController.deleteProduct);

module.exports = router;