const webResponses = require('../../helpers/web/webResponses');
const userService = require('../../services/authentication/userServices');
const multer = require('multer');
const path = require('path');

// Setup Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
    }
});

const upload = multer({ storage: storage });


async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(webResponses.successResponse('Users fetched successfully', users));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch users'));
    }
}

async function getUserById(req, res) {
    const { userId } = req.params;

    try {
        const user = await userService.getUserById(parseInt(userId));
        if (!user) return res.status(404).json(webResponses.errorResponse('User not found'));
        res.status(200).json(webResponses.successResponse('User fetched successfully', user));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch user'));
    }
}

async function updateUser(req, res) {
    const { userId } = req.params;
    const userProfile = req.body;
    const filePaths = {};

    if (req.files && req.files['profilePicture']) {
        filePaths.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.files['profilePicture'][0].filename}`;
    }
    if (req.files && req.files['ktpPicture']) {
        filePaths.ktpPicture = `${req.protocol}://${req.get('host')}/uploads/${req.files['ktpPicture'][0].filename}`;
    }
    if (req.files && req.files['studioLogo']) {
        filePaths.studioLogo = `${req.protocol}://${req.get('host')}/uploads/${req.files['studioLogo'][0].filename}`;
    }

    try {
        const updatedUser = await userService.updateUser(parseInt(userId), userProfile, filePaths);
        res.status(200).json(webResponses.successResponse('User updated successfully', updatedUser));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update user'));
    }
}

async function deleteUser(req, res) {
    const { userId } = req.params;

    try {
        await userService.deleteUser(parseInt(userId));
        res.status(200).json(webResponses.successResponse('User deleted successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to delete user'));
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser: [upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'ktpPicture', maxCount: 1 },
        { name: 'studioLogo', maxCount: 1 }
    ]), updateUser],
    deleteUser
};
