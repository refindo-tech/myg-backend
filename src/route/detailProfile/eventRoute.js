const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/detailProfile/eventController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.get('/events/:userId', authMiddleware, eventController.getEvents);
router.get('/events', authMiddleware, eventController.getEventsByToken);
router.get('/event-details', authMiddleware, eventController.getEventDetails);

module.exports = router;
