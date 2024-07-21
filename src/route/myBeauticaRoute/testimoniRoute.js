const express = require('express');
const testimoniController = require('../../controllers/myBeauticaController/testimoniController');

const router = express.Router();

router.get('/testimonials', testimoniController.getAllTestimonials);
router.get('/testimonials/:id', testimoniController.getTestimonialById);
router.post('/testimonials', testimoniController.createTestimonial);
router.put('/testimonials/:id', testimoniController.updateTestimonial);
router.delete('/testimonials/:id', testimoniController.deleteTestimonial);

module.exports = router;
