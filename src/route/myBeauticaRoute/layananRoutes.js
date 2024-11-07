const express = require('express');
const router = express.Router();
const layananController = require(`../../controllers/myBeauticaController/layananController`);
const { layananUpload } = require('../../middlewares/uploadMiddleware');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/', layananController.getAllLayanan);
router.get('/:id', layananController.getLayananById);
router.post('/', authMiddleware,layananUpload.upload.single('imageUrl'), layananController.createLayanan);
router.put('/:id', authMiddleware,layananUpload.upload.single('imageUrl'),layananController.updateLayanan);
router.delete('/:id', authMiddleware, layananController.deleteLayanan);

module.exports = router;