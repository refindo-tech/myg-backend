const { database } = require('../../helpers/config/db');

async function getEventsByUserId(userId) {
    return await database.training.findMany({
        where: {
            uploadedBy: userId
        },
        include: {
            materials: true,
            user: true
        }
    });
}

async function getEventDetailsByUserId(userId) {
    return await database.material.findMany({
        where: {
            uploadedBy: userId
        },
        select: {
            description: true
        }
    });
}

module.exports = {
    getEventsByUserId,
    getEventDetailsByUserId
};
