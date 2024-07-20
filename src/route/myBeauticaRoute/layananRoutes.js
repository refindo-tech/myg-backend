const express = require('express');
const router = express.Router();
const layananController = require(`../../controllers/myBeauticaController/layananController`);

// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

router.get('/', layananController.getAllLayanan);
router.get('/:id', layananController.getLayananById);
router.post('/', layananController.createLayanan);
router.put('/:id', layananController.updateLayanan);
router.delete('/:id', layananController.deleteLayanan);

module.exports = router;