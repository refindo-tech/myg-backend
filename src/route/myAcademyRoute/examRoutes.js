const express = require('express');
const router = express.Router();
const examController = require('../../controllers/myAcademyController/examController');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/recommendation/:limit', examController.getAllExamComingSoon);
router.get('/past/:limit', examController.getAllExamPast);
router.get('/detail/:idExam', examController.getDetailExam);

module.exports = router;