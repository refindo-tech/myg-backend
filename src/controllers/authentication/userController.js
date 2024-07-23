const webResponses = require('../../helpers/web/webResponses');
const userService = require('../../services/authentication/userSevices');

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
    const data = req.body;

    try {
        const updatedUser = await userService.updateUser(parseInt(userId), data);
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
    updateUser,
    deleteUser
};
