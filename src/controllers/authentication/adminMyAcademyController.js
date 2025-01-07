const webResponses = require('../../helpers/web/webResponses');
const trainingService = require('../../services/myAcademyServices/admin/adminTrainingServices.js');

class AdminMyAcademy{
    createTraining = async (req, res) => {
        try {
            const newTraining = await trainingService.createTraining(req);
            return res.status(201).json(
                webResponses.successResponse('Training created successfully', newTraining)
            );
        } catch (error) {
            return this.handleError(error, res);
        }
    }
    detailTraining = async (req, res) => {
        try {
            const training = await trainingService.detailTraining(req);
            return res.status(200).json(
                webResponses.successResponse('Training retrieved successfully', training)
            );
        } catch (error) {
            return this.handleError(error, res);
        }
    }
    updateTraining = async (req, res) => {
        try {
            const updatedTraining = await trainingService.updateTraining(req);
            return res.status(200).json(
                webResponses.successResponse('Training updated successfully', updatedTraining)
            );
        } catch (error) {
            return this.handleError(error, res);
        }
    }
    deleteTraining = async (req, res) => {
        try {
            const deletedTraining = await trainingService.deleteTraining(req);
            return res.status(200).json(
                webResponses.successResponse('Training deleted successfully', deletedTraining)
            );
        } catch (error) {
            return this.handleError(error, res);
        }
    }
    handleError = (error, res) => {
        console.error(error);
        return res.status(500).json(
            webResponses.errorResponse('Internal Server Error')
        );
    }
}
module.exports = new AdminMyAcademy();