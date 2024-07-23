const webResponses = require('../../helpers/web/webResponses');
const authService = require('../../services/authentication/authServices');
const { userRegistrationValidation } = require('../../validators/authentication/authValidator');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv();
addFormats(ajv);


async function registerUser(req, res) {
    const validate = ajv.compile(userRegistrationValidation);
    const valid = validate(req.body);

    if (!valid) {
        return res.status(400).json(webResponses.errorResponse('Invalid input', validate.errors));
    }

    const { email, password, confirmPassword, userProfile, role = 'MEMBER' } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json(webResponses.errorResponse('Passwords do not match'));
    }

    try {
        const newUser = await authService.registerUser(email, password, userProfile, role);
        res.status(201).json(webResponses.successResponse('User registered successfully', newUser));
    } catch (error) {
        console.error(error);

        if (error.code === 'P2002' && error.meta && error.meta.target === 'User_email_key') {
            return res.status(400).json(webResponses.errorResponse('Email is already in use'));
        }

        res.status(500).json(webResponses.errorResponse('Failed to register user', error.message));
    }
}


async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const { accessToken, refreshToken, user } = await authService.loginUser(email, password);

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
        const newAccessToken = await authService.refreshAccessToken(refreshToken);
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
        await authService.logoutUser(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).json(webResponses.successResponse('User logged out successfully'));
    } catch (error) {
        console.error(error);
        res.status(400).json(webResponses.errorResponse('Failed to logout user'));
    }
}

async function getProfile(req, res) {
    try {
        const userId = req.user.userId;
        const user = await authService.getUserProfile(userId);

        const result = {
            userId: user.userId,
            email: user.email,
            userLabel: user.userLabel,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            profilePicture: user.userProfiles[0]?.profilePicture || null
        };

        res.status(200).json(webResponses.successResponse('User profile fetched successfully', result));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch user profile'));
    }
}



module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getProfile
};
