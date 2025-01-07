// routes/adminMyAcademyRoute.js
const express = require('express');
const router = express.Router();
const corsMiddleware = require('../../middlewares/corsMiddleware');
const { authMiddleware } = require('../../middlewares/authMiddleware.js'); 
const adminMyAcademy = require('../../controllers/authentication/adminMyAcademyController');

// Apply CORS middleware
router.use(corsMiddleware);

//router to create new event
router.use('/createEvent', authMiddleware,adminMyAcademy.createTraining);

//router to detail event
router.use('/detailEvent/:trainingId', authMiddleware, adminMyAcademy.detailTraining);

//router to update event
router.use('/updateEvent/:trainingId', authMiddleware, adminMyAcademy.updateTraining);

//router to delete event
router.use('/deleteEvent/:trainingId', authMiddleware, adminMyAcademy.deleteTraining);
module.exports = router;