const { validateFunctionCode } = require('ajv/dist/compile/validate');
const { database } = require('../../helpers/config/db');


async function getExamComingSoon(limit){
    return database.exam.findMany({
        where:{
            dateStart:{
                gte:new Date()
            }
        },
        orderBy:{
            dateStart:'asc'
        },
        // select:{
        //     trainingId:true,
        //     trainingName:true,
        //     description:true,
        //     dateTraining:true,
        //     materials:true
        // },
        take:limit
    })
}
async function getExamPast(limit){
    return database.exam.findMany({
        where:{
            dateStart:{
                lte:new Date()
            }
        },
        orderBy:{
            dateStart:'asc'
        },
        // select:{
        //     trainingId:true,
        //     trainingName:true,
        //     description:true,
        //     dateTraining:true,
        //     materials:true
        // },
        take:limit
    })
}
async function detailExam (idExam){
    return database.exam.findUnique({
        where:{
            examId:idExam
        }
    })
}
module.exports={
    getExamComingSoon,
    detailExam,
    getExamPast
}