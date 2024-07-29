const { database } = require('../../helpers/config/db');
const argon2 = require('argon2');

async function getAllUsers() {
    return await database.user.findMany({
        include: {
            userProfiles: true,
        }
    });
}

async function getUserById(userId) {
    return await database.user.findUnique({
        where: { userId },
        include: {
            userProfiles: true,
        }
    });
}

async function updateUser(userId, userProfile) {
    const { fullName, phoneNumber, birthdate, socialMedia, address, studioName, ktpPicture, studioLogo } = userProfile;
    
    // Cari user profile dengan userId
    const userProfileData = await database.userProfile.findFirst({
        where: { userId }
    });

    if (!userProfileData) {
        throw new Error('UserProfile not found');
    }

    return await database.userProfile.update({
        where: { profileId: userProfileData.profileId },
        data: {
            fullName,
            phoneNumber,
            birthdate: new Date(birthdate),
            socialMedia,
            address,
            studioName: studioName || null,
            ktpPicture: ktpPicture || null,
            studioLogo: studioLogo || null,
            updatedAt: new Date(),
        }
    });
}


async function deleteUser(userId) {
    await database.userProfile.deleteMany({
        where: { userId }
    });
    return await database.user.delete({
        where: { userId }
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};