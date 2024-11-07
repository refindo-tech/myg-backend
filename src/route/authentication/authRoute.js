// authRoute.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication/authController');
const { authMiddleware, selfOrAdminMiddleware, verifyToken } = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

// Auth routes
router.post('/register', authController.registerUser);
router.post('/login', authController.login);
router.get('/refresh-token', verifyToken, authController.refreshAccessToken);
router.delete('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;