const { validateFunctionCode } = require('ajv/dist/compile/validate');
const { database } = require('../../helpers/config/db');

async function addTestimoni(req){
    const {body} =req
    return database.review.create({
        data:{
            name:body.name,
            comment:body.comment
        }
    })
}
module.exports={
    addTestimoni
}