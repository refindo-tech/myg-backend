const { database } = require('../../helpers/config/db');
const argon2 = require('argon2');

async function getAllUsers() {
    return await database.user.findMany();
}

async function getUserById(userId) {
    return await database.user.findUnique({
        where: { userId }
    });
}

async function updateUser(userId, data) {
    if (data.password) {
        data.password = await argon2.hash(data.password);
    }
    return await database.user.update({
        where: { userId },
        data
    });
}

async function deleteUser(userId) {
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
