const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const argon2 = require('argon2');

async function getAllUsers() {
    return await prisma.user.findMany();
}

module.exports = {
    getAllUsers,
};
