const jwt = require('jsonwebtoken');
const { database } = require('../helpers/config/db');
const webResponses = require('../helpers/web/webResponses');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json(webResponses.errorResponse('Access denied. No token provided.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await database.user.findUnique({
            where: { userId: decoded.userId },
            include: { userProfiles: true }
        });

        if (!user) {
            return res.status(404).json(webResponses.errorResponse('User not found.'));
        }

        req.user = user;
        next();
    } catch (ex) {
        res.status(400).json(webResponses.errorResponse('Invalid token.'));
    }
};

const selfOrAdminMiddleware = async (req, res, next) => {
    const { userId } = req.params;
    const user = req.user;

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.userId === parseInt(userId)) {
        next();
    } else {
        return res.status(403).json(webResponses.errorResponse('Access denied. Insufficient permissions.'));
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json(webResponses.errorResponse('Access denied. Insufficient permissions.'));
        }
        next();
    };
};

// pakai ini untuk mewajibkan user login untuk mengakses route tertentu
const verifyToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json(webResponses.errorResponse('No token provided.'));

    try {
        const existingToken = await database.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        if (!existingToken) return res.status(403).json(webResponses.errorResponse('Invalid refresh token.'));

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json(webResponses.errorResponse('Failed to authenticate token.'));
    }
};

module.exports = {
    authMiddleware,
    selfOrAdminMiddleware,
    roleMiddleware,
    verifyToken
};