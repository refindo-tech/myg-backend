const trainingServices = require('../../services/myAcademyServices/trainingServices');
const webResponses = require('../../helpers/web/webResponses');
const Ajv = require('ajv');

const ajv = new Ajv();


async function getAllTrainingComingSoon(req, res) {
    try {
        const {limit} = req.params
        const training = await trainingServices.getTrainingComingSoon(Number(limit));
        return res.status(200).json(webResponses.successResponse('p',training));
    } catch (error) {
        console.error(error);
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}
async function getAllTrainingPast(req, res) {
    try {
        const {limit} = req.params
        const training = await trainingServices.getTrainingPast(Number(limit));
        return res.status(200).json(webResponses.successResponse('p',training));
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