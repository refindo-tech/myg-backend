const testimoniAcademyServices = require('../../services/myAcademyServices/testimoniAcademyServices');
const webResponses = require('../../helpers/web/webResponses');
const Ajv = require('ajv');
const { error } = require('ajv/dist/vocabularies/applicator/dependencies');

const ajv = new Ajv();


async function addTestimoni(req, res) {
    try {
        const dataTestimoni = await testimoniAcademyServices.addTestimoni(req);
        if(dataTestimoni){
            return res.status(200).json(webResponses.successResponse('Validate Success',dataTestimoni));
        }
        else{
            throw(error)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}


module.exports = {
    addTestimoni
};