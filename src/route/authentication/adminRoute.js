// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/authentication/adminController');
const { adminUpload } = require('../../middlewares/uploadMiddleware');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const corsMiddleware = require('../../middlewares/corsMiddleware');

// Apply CORS middleware
router.use(corsMiddleware);

//router to register admin
router.post('/registerAdmin', 
    authMiddleware,
    adminUpload.upload.single('profilePicture'),
    adminController.registerAdmin
  );

//router to get all admins
router.get('/admins', authMiddleware, adminController.getAllAdmins);

//router to get admin by id
router.get('/admins/:adminId', authMiddleware, adminController.getAdminById);

//router to update admin by id
router.put('/admins/:adminId', authMiddleware, adminController.updateAdmin);

//router to delete admin by id
router.delete('/admins/:adminId', authMiddleware, adminController.deleteAdmin);

//router to update admin profile picture
router.put('/admins/:adminId/profilePicture', authMiddleware, adminUpload.upload.single('profilePicture'), adminController.updateProfilePicture);

module.exports = router;