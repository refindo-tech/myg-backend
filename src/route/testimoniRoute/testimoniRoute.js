const express = require('express');
const testimoniController = require('../../controllers/testimoniController/testimoniController');
const { authMiddleware, } = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

const router = express.Router();

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/testimonials', testimoniController.getAllTestimonials);
router.get('/testimonials/:id', testimoniController.getTestimonialById);
router.post('/testimonials', testimoniController.createTestimonial);
router.put('/testimonials/:id', testimoniController.updateTestimonial);
router.delete('/testimonials/:id', authMiddleware, testimoniController.deleteTestimonial);
router.patch('/testimonials/:id/approve', authMiddleware, testimoniController.toggleApprovalStatus);


module.exports = router;