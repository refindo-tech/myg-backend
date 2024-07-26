const express = require('express');
const router = express.Router();
const productController = require(`../../controllers/myaController/productController`);

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Update this with the URL of your frontend
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

router.get('/', productController.getAllProduct);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;