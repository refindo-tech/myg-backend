const materialsService = require('../../services/myAcademyServices/materialServices');
const webResponses = require('../../helpers/web/webResponses');
const Ajv = require('ajv');

const ajv = new Ajv();


async function getAllMaterials(req, res) {
    try {
        const materials = await materialsService.getAllMaterials();
        return res.status(200).json(webResponses.successResponse(materials));
    } catch (error) {
        console.error(error);
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

module.exports = {
    getAllMaterials,
};