const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication/authController');
const { authMiddleware, verifyToken } = require('../../middlewares/authMiddleware');

// Middleware untuk menambahkan header CORS
// router.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });

router.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000','http://localhost:3001', 'http://127.0.0.1:3001'];
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

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/refresh-token', verifyToken, authController.refreshAccessToken);
router.delete('/logout', authMiddleware, authController.logoutUser);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
