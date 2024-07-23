const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication/authController');
const { authMiddleware, verifyToken } = require('../../middlewares/authMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/refresh-token', verifyToken, authController.refreshAccessToken);
router.delete('/logout', authMiddleware, authController.logoutUser);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
