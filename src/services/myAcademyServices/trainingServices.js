const { validateFunctionCode } = require('ajv/dist/compile/validate');
const { database } = require('../../helpers/config/db');

async function createTraining(req) {
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
async function getTrainingComingSoon(limit) {
    return database.training.findMany({
        where: {
            dateStart: {
                gte: new Date()
            }
        },
        orderBy: {
            dateStart: 'asc'
        },
        include: {
            materials: true
        },
        take: limit
    })
}
async function getTrainingPast(limit) {
    return database.training.findMany({
        where: {
            dateStart: {
                lte: new Date()
            }
        },
        orderBy: {
            dateStart: 'asc'
        },
        include: {
            materials: true
        },
        take: limit
    })
}
async function detailTraining(idTraining) {
    return database.training.findUnique({
        where: {
            trainingId: idTraining
        },
        include: {
            materials: true
        }
    })
}

module.exports = {
    createTraining,
    getTrainingComingSoon,
    detailTraining,
    getTrainingPast
}
