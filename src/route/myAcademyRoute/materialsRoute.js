const express = require('express');
const router = express.Router();
const materialsController = require('../../controllers/myAcademyController/materialController');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/', materialsController.getAllMaterials);
router.get('/:idTraining', materialsController.getDetailMaterial)

module.exports = router;