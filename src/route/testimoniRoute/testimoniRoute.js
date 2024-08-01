const express = require('express');
const testimoniController = require('../../controllers/testimoniController/testimoniController');
const { authMiddleware, roleMiddleware, selfOrAdminMiddleware } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.use((req, res, next) => {
    const allowedOrigins = ['https://92.112.192.81:3000', 'http://127.0.0.1:3000','http://localhost:3001', 'http://127.0.0.1:3001', 'https://myg.app'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }
    next();
});

router.get('/testimonials', testimoniController.getAllTestimonials);
router.get('/testimonials/:id', testimoniController.getTestimonialById);
router.post('/testimonials', testimoniController.createTestimonial);
router.put('/testimonials/:id', testimoniController.updateTestimonial);
router.delete('/testimonials/:id', authMiddleware, testimoniController.deleteTestimonial);

module.exports = router;
