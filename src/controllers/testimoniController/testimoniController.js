const testimoniService = require('../../services/testimoniServices/testimoniServices');
const webResponses = require('../../helpers/web/webResponses');
const { createTestimonialSchema, updateTestimonialSchema } = require('../../validators/testimoniValidator/testimoniValidator');
const Ajv = require('ajv');

const ajv = new Ajv();


async function getAllTestimonials(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 3;
        // const isApproved = req.query.isApproved === 'true';
        //if empty, isApproved will be true, if 1, will also be true, if 0, will be false
        const isApproved = req.query.isApproved === 'false' || req.query.isApproved === '0' ? false : true;
        const testimonials = await testimoniService.getAllTestimonials(limit, isApproved);
        // const formattedTestimonials = testimonials.map(testimonial => {
        //     const fullName = testimonial.user.userProfiles[0]?.fullName || 'Unknown';
        //     return {
        //         reviewId: testimonial.reviewId,
        //         fullName: fullName,
        //         role: testimonial.user.role,
        //         comment: testimonial.comment,
        //     };
        // });
        // return res.status(200).json(webResponses.successResponse(formattedTestimonials));
        return res.status(200).json(webResponses.successResponse(testimonials));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function getTestimonialById(req, res) {
    try {
        const { id } = req.params;
        const testimonial = await testimoniService.getTestimonialById(Number(id));
        if (!testimonial) {
            return res.status(404).json(webResponses.errorResponse('Testimoni tidak ditemukan'));
        }
        // const fullName = testimonial.user.userProfiles[0]?.fullName || 'Unknown';
        // const formattedTestimonial = {
        //     reviewId: testimonial.reviewId,
        //     fullName: fullName,
        //     role: testimonial.user.role,
        //     comment: testimonial.comment,
        // };
        return res.status(200).json(webResponses.successResponse(testimonial));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function createTestimonial(req, res) {
    try {
        const { body } = req;
        const valid = ajv.validate(createTestimonialSchema, body);
        if (!valid) {
            return res.status(400).json(webResponses.errorResponse(ajv.errors));
        }
        const testimonial = await testimoniService.createTestimonial(body);
        return res.status(201).json(webResponses.successResponse(testimonial));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function updateTestimonial(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const valid = ajv.validate(updateTestimonialSchema, body);
        if (!valid) {
            return res.status(400).json(webResponses.errorResponse(ajv.errors));
        }
        const testimonial = await testimoniService.updateTestimonial(Number(id), body);
        return res.status(200).json(webResponses.successResponse(testimonial));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

async function deleteTestimonial(req, res) {
    try {
        const { id } = req.params;
        const testimonial = await testimoniService.deleteTestimonial(Number(id));
        return res.status(200).json(webResponses.successResponse(testimonial));
    } catch (error) {
        return res.status(500).json(webResponses.errorResponse(error.message));
    }
}

module.exports = {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
};