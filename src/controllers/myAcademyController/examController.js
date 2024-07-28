const examServices = require('../../services/myAcademyServices/examServices');
const webResponses = require('../../helpers/web/webResponses');
const Ajv = require('ajv');

const ajv = new Ajv();


async function getAllExamComingSoon(req, res) {
    try {
        const {limit} = req.params
        const training = await examServices.getExamComingSoon(Number(limit));
        return res.status(200).json(webResponses.successResponse('p',training));
    } catch (error) {
        console.error(error);
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}
async function getAllExamPast(req, res) {
    try {
        const {limit} = req.params
        const training = await examServices.getExamPast(Number(limit));
        return res.status(200).json(webResponses.successResponse('p',training));
    } catch (error) {
        console.error(error);
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}
async function getDetailExam(req, res){
    try {
        const {idExam} =req.params
        const detailExam = await examServices.detailExam(Number(idExam))
        if(detailExam){
            const dateExam = new Date(detailExam.dateStart)
            const currentDate = new Date()
            if(dateExam>=currentDate){
                const type = 'soon'
                const formattedResponse = {
                    examId:detailExam.examId,
                    title:detailExam.title,
                    description:detailExam.description,
                    dateStart:detailExam.dateStart,
                    dateFinish:detailExam.dateFinish,
                    address:detailExam.address,
                    embedMaps:detailExam.embedMaps,
                    price:detailExam.price,
                    brosur:detailExam.brosur,
                    banner:detailExam.banner,
                    linkMaps:detailExam.linkMaps,
                    type:type,
                }
                return res.status(200).json(webResponses.successResponse('Validate Success',formattedResponse));
            }
            else if(dateExam<=currentDate){
                const type = 'past'
                const formattedResponse = {
                    examId:detailExam.examId,
                    title:detailExam.title,
                    description:detailExam.description,
                    dateStart:detailExam.dateStart,
                    dateFinish:detailExam.dateFinish,
                    address:detailExam.address,
                    embedMaps:detailExam.embedMaps,
                    price:detailExam.price,
                    linkMaps:detailExam.linkMaps,
                    brosur:detailExam.brosur,
                    banner:detailExam.banner,
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
    getAllExamComingSoon,
    getDetailExam,
    getAllExamPast
};