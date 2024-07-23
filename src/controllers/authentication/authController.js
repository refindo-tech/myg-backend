const webResponses = require('../../helpers/web/webResponses');
const userService = require('../../services/authentication/authServices');
const { userRegistrationValidation } = require('../../validators/authentication/authValidator');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv();
addFormats(ajv);

async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.json(webResponses.successResponse('Users fetched successfully', users));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch users'));
    }
}


async function registerUser(req, res) {
    const validate = ajv.compile(userRegistrationValidation);
    const valid = validate(req.body);

    if (!valid) {
        return res.status(400).json(webResponses.errorResponse('Invalid input', validate.errors));
    }

    const { email, password, confirmPassword, userLabel, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json(webResponses.errorResponse('Passwords do not match'));
    }

    try {
        const newUser = await userService.registerUser(email, password, userLabel, role);
        res.status(201).json(webResponses.successResponse('User registered successfully', newUser));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to register user'));
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const { accessToken, refreshToken, user } = await userService.loginUser(email, password);

        // Send refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json(webResponses.successResponse('User logged in successfully', { accessToken, user }));
    } catch (error) {
        console.error(error);
        res.status(400).json(webResponses.errorResponse(error.message));
    }
}

async function refreshAccessToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json(webResponses.errorResponse('No refresh token provided'));
    }

    try {
        const newAccessToken = await userService.refreshAccessToken(refreshToken);
        res.status(200).json(webResponses.successResponse('Access token refreshed successfully', { accessToken: newAccessToken }));
    } catch (error) {
        console.error(error);
        res.status(401).json(webResponses.errorResponse('Invalid refresh token'));
    }
}

async function logoutUser(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json(webResponses.errorResponse('No refresh token provided'));
    }

    try {
        await userService.logoutUser(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).json(webResponses.successResponse('User logged out successfully'));
    } catch (error) {
        console.error(error);
        res.status(400).json(webResponses.errorResponse('Failed to logout user'));
    }
}

async function getProfile(req, res) {
    try {
        const user = await userService.getUserProfile(req.user.userId);
        if (!user) return res.status(404).json(webResponses.errorResponse('User not found'));
        res.status(200).json(webResponses.successResponse('User profile fetched successfully', user));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch user profile', error.message));
    }
}


module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getProfile
};
