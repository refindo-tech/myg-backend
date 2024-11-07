const express = require('express');
const router = express.Router();
const trainingController = require('../../controllers/myAcademyController/trainingController');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/recommendation/:limit', trainingController.getAllTrainingComingSoon);
router.get('/past/:limit', trainingController.getAllTrainingPast);
router.get('/detail/:idTraining', trainingController.getDetailTraining);

module.exports = router;