const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication/authController');
const { authMiddleware, verifyToken } = require('../../middlewares/authMiddleware');

// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/refresh-token', verifyToken, authController.refreshAccessToken);
router.delete('/logout', authMiddleware, authController.logoutUser);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
