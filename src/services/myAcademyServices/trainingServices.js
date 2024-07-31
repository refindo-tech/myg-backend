const { validateFunctionCode } = require('ajv/dist/compile/validate');
const { database } = require('../../helpers/config/db');


async function getTrainingComingSoon(limit){
    return database.training.findMany({
        where:{
            dateStart:{
                gte:new Date()
            }
        },
        orderBy:{
            dateStart:'asc'
        },
        include:{
            materials:true
        },
        take:limit
    })
}
async function getTrainingPast(limit){
    return database.training.findMany({
        where:{
            dateStart:{
                lte:new Date()
            }
        },
        orderBy:{
            dateStart:'asc'
        },
        include:{
            materials:true
        },
        take:limit
    })
}
async function detailTraining (idTraining){
    return database.training.findUnique({
        where:{
            trainingId:idTraining
        },
        include:{
            materials:true
        }
    })
}
module.exports={
    getTrainingComingSoon,
    detailTraining,
    getTrainingPast
}