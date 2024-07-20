const express = require('express');
const router = express.Router();
const userController = require('../../controllers/authentication/userController');

router.get('/getAllUsers', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/refresh-token', userController.refreshAccessToken);
router.delete('/logout', userController.logoutUser);

module.exports = router;