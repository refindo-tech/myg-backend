const trainingServices = require('../../services/myAcademyServices/trainingServices');
const webResponses = require('../../helpers/web/webResponses');
const Ajv = require('ajv');
const { error } = require('ajv/dist/vocabularies/applicator/dependencies');

const ajv = new Ajv();


async function getAllTrainingComingSoon(req, res) {
    try {
        const {limit} = req.params
        const detailTraining = await trainingServices.getTrainingComingSoon(Number(limit));
        if(detailTraining){
            return res.status(200).json(webResponses.successResponse('Validate Success',detailTraining));
        }
        else{
            throw(error)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}
async function getAllTrainingPast(req, res) {
    try {
        const {limit} = req.params
        const detailTraining = await trainingServices.getTrainingPast(Number(limit));
        if(detailTraining){
            const formattedResponse = {
                trainingId:detailTraining.trainingId,
                trainingName:detailTraining.trainingName,
                description:detailTraining.description,
                dateStart:detailTraining.dateStart,
                dateFinish:detailTraining.dateFinish,
                address:detailTraining.address,
                embedMaps:detailTraining.embedMaps,
                price:detailTraining.price,
                linkMaps:detailTraining.linkMaps,
                brosur:detailTraining.materials[0].brosur,
                type:type,
            }
            return res.status(200).json(webResponses.successResponse('Validate Success',formattedResponse));
        }
        else{
            throw(error)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}
async function getDetailTraining(req, res){
    try {
        const {idTraining} =req.params
        const detailTraining = await trainingServices.detailTraining(Number(idTraining))
        if(detailTraining){
            const dateStart = new Date(detailTraining.dateStart)
            const currentDate = new Date()
            if(dateStart>=currentDate){
                const type = 'soon'
                const formattedResponse = {
                    trainingId:detailTraining.trainingId,
                    trainingName:detailTraining.trainingName,
                    description:detailTraining.description,
                    dateStart:detailTraining.dateStart,
                    dateFinish:detailTraining.dateFinish,
                    address:detailTraining.address,
                    embedMaps:detailTraining.embedMaps,
                    price:detailTraining.price,
                    linkMaps:detailTraining.linkMaps,
                    materials:detailTraining.materials,
                    brosur:detailTraining.materials[0].brosur,
                    type:type,
                }
                return res.status(200).json(webResponses.successResponse('Validate Success',formattedResponse));
            }
            else if(dateStart<=currentDate){
                const type = 'past'
                const formattedResponse = {
                    trainingId:detailTraining.trainingId,
                    trainingName:detailTraining.trainingName,
                    description:detailTraining.description,
                    dateStart:detailTraining.dateStart,
                    dateFinish:detailTraining.dateFinish,
                    address:detailTraining.address,
                    embedMaps:detailTraining.embedMaps,
                    price:detailTraining.price,
                    linkMaps:detailTraining.linkMaps,
                    materials:detailTraining.materials,
                    brosur:detailTraining.materials[0].brosur,
                    type:type,
                }
                return res.status(200).json(webResponses.successResponse('Validate Success',formattedResponse));
            }
            else{
                throw(Error)
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

module.exports = {
    getAllTrainingComingSoon,
    getDetailTraining,
    getAllTrainingPast
};