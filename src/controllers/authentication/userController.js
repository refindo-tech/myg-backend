webResponses = require('../../helpers/web/webResponses');
const userService = require('../../services/authentication/userService');
const { userValidationSchema } = require('../../validators/userValidator');
const Ajv = require('ajv');
const ajv = new Ajv();

async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        return webResponses.success(res, users);
    } catch (error) {
        return webResponses.error(res, error);
    }
}

module.exports = {
    getAllUsers,
};