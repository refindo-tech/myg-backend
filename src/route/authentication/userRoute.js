const express = require('express');
const router = express.Router();
const userController = require('../../controllers/authentication/userController');

router.get('/getUsers', userController.getAllUsers);

module.exports = router;