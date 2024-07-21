const { UserLabel } = require('@prisma/client');
const { database } = require('../../helpers/config/db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');


async function getAllUsers() {
    return await database.user.findMany();
}

async function registerUser( email, password, UserLabel, role ) {
    const hashedPassword = await argon2.hash(password);
    return await database.user.create({
        data: {
            email,
            password: hashedPassword,
            userLabel: UserLabel,
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
}

async function loginUser(email, password) {
    const user = await database.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
        throw new Error('Invalid password');
    }

    const accessToken = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store refresh token in database
    await database.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    return { accessToken, refreshToken, user };
}


async function refreshAccessToken(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await database.refreshToken.findUnique({ where: { token: refreshToken } });

        if (!storedToken) {
            throw new Error('Invalid refresh token');
        }

        const newAccessToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        return newAccessToken;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}

async function logoutUser(refreshToken) {
    try {
        await database.refreshToken.delete({
            where: { token: refreshToken }
        });
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}

async function getUserById(userId) {
    return await database.user.findUnique({ where: { userId } });
}


module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getUserById
};