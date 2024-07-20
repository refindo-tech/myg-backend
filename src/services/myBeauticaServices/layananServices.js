const { database } = require('../../helpers/config/db');

async function getAllLayanan() {
    return await database.beautyService.findMany();
}

async function getLayananById(id) {
    return await database.beautyService.findUnique({ where: { serviceId: id } });
}

async function createLayanan(data) {
    return await database.beautyService.create({
        data: {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
}

async function updateLayanan(id, data) {
    return await database.beautyService.update({
        where: { serviceId: id },
        data: {
            ...data,
            updatedAt: new Date(),
        },
    });
}

async function deleteLayanan(id) {
    return await database.beautyService.delete({ where: { serviceId: id } });
}

module.exports = { 
    getAllLayanan,
    getLayananById,
    createLayanan,
    updateLayanan,
    deleteLayanan,
};
