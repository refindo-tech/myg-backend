const { database } = require('../../../helpers/config/db');

class AdminTrainingServices {
    createTraining = async (req) => {
        try {
            const create = await database.training.create({
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    dateStart: req.body.dateStart,
                    dateEnd: req.body.dateEnd,
                    location: req.body.location,
                    price: req.body.price,
                    quota: req.body.quota,
                    materials: {
                        create: req.body.materials
                    }
                }
            })
            if(create){
                return create
            }
        } catch (error) {
            console.error(error)
            return{
                status: false,
                message: "Internal Server Error"
            }
        }
    }
    detailTraining = async (req) => {
        try {
            const detail = await database.training.findUnique({
                where: {
                    trainingId: parseInt(req.params.trainingId)
                },
                include: {
                    materials: true
                }
            })
            if(detail){
                return detail
            }
        } catch (error) {
            console.error(error)
            return{
                status: false,
                message: "Internal Server Error"
            }
        }
    }
    updateTraining = async (req) => {
        try {
            const update = await database.training.update({
                where: {
                    trainingId: parseInt(req.params.trainingId)
                },
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    dateStart: req.body.dateStart,
                    dateEnd: req.body.dateEnd,
                    location: req.body.location,
                    price: req.body.price,
                    quota: req.body.quota,
                    materials: {
                        create: req.body.materials
                    }
                }
            })
            if(update){
                return update
            }
        } catch (error) {
            console.error(error)
            return{
                status: false,
                message: "Internal Server Error"
            }
        }
    }
    deleteTraining = async (req) => {
        try {
            const deleted = await database.training.delete({
                where: {
                    trainingId: parseInt(req.params.trainingId)
                }
            })
            if(deleted){
                return deleted
            }
        } catch (error) {
            console.error(error)
            return{
                status: false,
                message: "Internal Server Error"
            }
        }
    }
}
module.exports = new AdminTrainingServices();