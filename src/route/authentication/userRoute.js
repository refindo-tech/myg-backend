const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const userController = require('../../controllers/authentication/userController');
const authMiddleware = require('../../middlewares/authMiddleware');


router.use(cookieParser());

router.get('/getAllUsers', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/refresh-token', userController.refreshAccessToken);
router.delete('/logout', userController.logoutUser);
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;