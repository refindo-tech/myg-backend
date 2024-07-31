const express = require('express');
const router = express.Router();
const trainingController = require('../../controllers/myAcademyController/trainingController');


// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://92.112.192.81:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

router.get('/recommendation/:limit', trainingController.getAllTrainingComingSoon);
router.get('/past/:limit', trainingController.getAllTrainingPast);
router.get('/detail/:idTraining', trainingController.getDetailTraining);

module.exports = router;