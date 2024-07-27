const { validateFunctionCode } = require('ajv/dist/compile/validate');
const { database } = require('../../helpers/config/db');

async function getAllMaterials() {
    return await database.material.findMany();
}
async function getDetailMaterial(idTraining) {
    return await database.material.findFirst({
        where:{
            trainingId:idTraining
        }
    })
}
// async function getRecommendationEvent(){
//     return await database.material.findFirst()
// }

module.exports = {
    getAllMaterials,
    getDetailMaterial
};