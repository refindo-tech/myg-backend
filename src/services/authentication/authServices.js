const { database } = require('../../helpers/config/db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');


async function registerUser(email, password, userProfile, role = 'MEMBER') {
    const hashedPassword = await argon2.hash(password);
    return await database.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
            userProfiles: {
                create: {
                    fullName: userProfile.fullName,
                    phoneNumber: userProfile.phoneNumber,
                    birthdate: new Date(userProfile.birthdate),
                    socialMedia: userProfile.socialMedia,
                    address: userProfile.address,
                    profilePicture: userProfile.profilePicture || null,
                    studioName: userProfile.studioName || null,
                    // ktpPicture: userProfile.ktpPicture || null,
                    // studioLogo: userProfile.studioLogo || null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        },
        include: {
            userProfiles: true
        }
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
    console.log(process.env.JWT_SECRET);
    const accessToken = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store tokens in database
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

async function getUserProfile(userId) {
    const user = await database.user.findUnique({
        where: { userId },
        include: {
            userProfiles: {
                select: {
                    profilePicture: true
                }
            }
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getUserProfile
};
