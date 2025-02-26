const express = require('express');
const router = express.Router();
const userController = require('../../controllers/authentication/userController');
const { authMiddleware, roleMiddleware, selfOrAdminMiddleware } = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

router.get('/users', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), userController.getAllUsers);
router.get('/users/:userId', authMiddleware, selfOrAdminMiddleware, userController.getUserById);
router.put('/users/:userId', authMiddleware, selfOrAdminMiddleware, userController.updateUser);
router.delete('/users/:userId', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), userController.deleteUser);


module.exports = router;