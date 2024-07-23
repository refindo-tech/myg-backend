const { database } = require('../../helpers/config/db');

async function getAllMaterials() {
    return await database.material.findMany();
}

module.exports = {
    getAllMaterials,
};