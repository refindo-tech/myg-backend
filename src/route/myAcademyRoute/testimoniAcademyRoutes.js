const express = require('express');
const router = express.Router();
const testimoniAcademyController = require('../../controllers/myAcademyController/testimoniAcademyController')



// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

router.post('/add/testimoni', testimoniAcademyController.addTestimoni);

module.exports = router;