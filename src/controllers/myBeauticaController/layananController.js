const layananService = require('../../services/myBeauticaServices/layananServices');
const webResponses = require('../../helpers/web/webResponses');
const { createLayananSchema, updateLayananSchema } = require('../../validators/myBeauticaValidator/layananValidator');
const Ajv = require('ajv');

const ajv = new Ajv();

async function getAllLayanan(req, res) {
    try {
        const layanan = await layananService.getAllLayanan();
        return res.status(200).json(webResponses.successResponse(layanan));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function getLayananById(req, res) {
    try {
        const { id } = req.params;
        const layanan = await layananService.getLayananById(Number(id));
        if (!layanan) {
            return res.status(404).json(webResponses.errorResponse('Layanan tidak ditemukan'));
        }
        return res.status(200).json(webResponses.successResponse(layanan));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function createLayanan(req, res) {
    try {
        const { body } = req;
        const valid = ajv.validate(createLayananSchema, body);
        if (!valid) {
            return res.status(400).json(webResponses.errorResponse(ajv.errors));
        }
        const layanan = await layananService.createLayanan(body);
        return res.status(201).json(webResponses.successResponse(layanan));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function updateLayanan(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const valid = ajv.validate(updateLayananSchema, body);
        if (!valid) {
            return res.status(400).json(webResponses.errorResponse(ajv.errors));
        }
        const layanan = await layananService.updateLayanan(Number(id), body);
        return res.status(200).json(webResponses.successResponse(layanan));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function deleteLayanan(req, res) {
    try {
        const { id } = req.params;
        const layanan = await layananService.deleteLayanan(Number(id));
        return res.status(200).json(webResponses.successResponse(layanan));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

module.exports = {
    getAllLayanan,
    getLayananById,
    createLayanan,
    updateLayanan,
    deleteLayanan,
};
