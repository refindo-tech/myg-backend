const jwt = require('jsonwebtoken');
const { database } = require('../helpers/config/db');
const webResponses = require('../helpers/web/webResponses');
const { AuthenticationError } = require('../helpers/errors/customErrors');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json(webResponses.errorResponse('Access denied. No token provided.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Cek tipe akun (user atau admin)
        let account;
        if (decoded.type === 'user') {
            account = await database.user.findUnique({
                where: { userId: decoded.id },
                include: { userProfiles: true }
            });
        } else if (decoded.type === 'admin') {
            account = await database.admin.findUnique({
                where: { adminId: decoded.id }
            });
        }

        if (!account) {
            return res.status(404).json(webResponses.errorResponse('Account not found.'));
        }

        // Set account info berdasarkan tipe
        req.user = {
            id: decoded.type === 'user' ? account.userId : account.adminId,
            email: account.email,
            role: account.role,
            type: decoded.type,
            ...(decoded.type === 'user' && { userProfiles: account.userProfiles })
        };
        
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json(webResponses.errorResponse('Token expired.'));
        }
        res.status(401).json(webResponses.errorResponse('Invalid token.'));
    }
};

const selfOrAdminMiddleware = async (req, res, next) => {
    const { userId } = req.params;
    const user = req.user;

    // Admin dan Super Admin memiliki akses penuh
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        return next();
    }

    // User hanya bisa mengakses datanya sendiri
    if (user.type === 'user' && user.userId === parseInt(userId)) {
        return next();
    }

    return res.status(403).json(
        webResponses.errorResponse('Access denied. Insufficient permissions.')
    );
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        // Cek apakah role pengguna termasuk dalam roles yang diizinkan
        if (!roles.includes(req.user.role)) {
            return res.status(403).json(
                webResponses.errorResponse('Access denied. Insufficient permissions.')
            );
        }
        next();
    };
};

const verifyToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json(
            webResponses.errorResponse('No refresh token provided.')
        );
    }

    try {
        // Cek token di database
        const existingToken = await database.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        if (!existingToken) {
            return res.status(403).json(
                webResponses.errorResponse('Invalid refresh token.')
            );
        }

        // Cek apakah token sudah digunakan (part of token rotation)
        if (existingToken.isUsed) {
            // Revoke semua token dalam family jika token reuse terdeteksi
            await database.refreshToken.updateMany({
                where: { familyId: existingToken.familyId },
                data: { isUsed: true }
            });
            
            return res.status(403).json(
                webResponses.errorResponse('Token reuse detected. Please login again.')
            );
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            type: decoded.type
        };
        req.refreshToken = refreshToken;  // Untuk digunakan dalam token rotation
        
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json(
                webResponses.errorResponse('Refresh token expired.')
            );
        }
        res.status(400).json(
            webResponses.errorResponse('Failed to authenticate token.')
        );
    }
};

// Middleware untuk memeriksa apakah user adalah admin
const adminOnlyMiddleware = (req, res, next) => {
    if (req.user.type !== 'admin') {
        return res.status(403).json(
            webResponses.errorResponse('Access denied. Admin only.')
        );
    }
    next();
};

module.exports = {
    authMiddleware,
    selfOrAdminMiddleware,
    roleMiddleware,
    verifyToken,
    adminOnlyMiddleware
};