const express = require('express');
const router = express.Router();
const userController = require('../../controllers/authentication/userController');
const { authMiddleware, roleMiddleware } = require('../../middlewares/authMiddleware');

router.get('/users', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), userController.getAllUsers);
router.get('/users/:userId', authMiddleware, userController.getUserById);
router.put('/users/:userId', authMiddleware, userController.updateUser);
router.delete('/users/:userId', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), userController.deleteUser);

module.exports = router;
