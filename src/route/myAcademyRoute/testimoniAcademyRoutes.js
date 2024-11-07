const express = require('express');
const router = express.Router();
const testimoniAcademyController = require('../../controllers/myAcademyController/testimoniAcademyController')
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.post('/add/testimoni', testimoniAcademyController.addTestimoni);

module.exports = router;