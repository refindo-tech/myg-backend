// routes/adminMyAcademyRoute.js
const express = require('express');
const multer = require('multer')
const handleFormData = multer();
const router = express.Router();
const { adminUpload } = require('../../middlewares/uploadMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');
const { authMiddleware } = require('../../middlewares/authMiddleware.js'); 
const adminMyAcademy = require('../../controllers/authentication/adminMyAcademyController');

// Apply CORS middleware
router.use(corsMiddleware);

//router to create new event
router.post('/createEvent', authMiddleware, adminUpload.upload.single('posteracara'), adminMyAcademy.createTraining);

//router to list event
router.get('/listEvent', authMiddleware, adminMyAcademy.listTraining)

//router to detail event
router.get('/detailEvent/:trainingId', authMiddleware, adminMyAcademy.detailTraining);

//router to update event
router.put('/updateEvent/:trainingId', authMiddleware, adminUpload.upload.single('posteracara'), adminMyAcademy.updateTraining);

//router to delete event
router.delete('/deleteEvent/:trainingId', authMiddleware, adminMyAcademy.deleteTraining);
module.exports = router;