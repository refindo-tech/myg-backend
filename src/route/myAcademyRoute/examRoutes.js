const express = require('express');
const router = express.Router();
const examController = require('../../controllers/myAcademyController/examController');


// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://92.112.192.81:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

router.get('/recommendation/:limit', examController.getAllExamComingSoon);
router.get('/past/:limit', examController.getAllExamPast);
router.get('/detail/:idExam', examController.getDetailExam);

module.exports = router;