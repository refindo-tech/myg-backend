// testimoniController.js
const testimoniService = require('../../services/testimoniServices/testimoniServices');
const webResponses = require('../../helpers/web/webResponses');
const { createTestimonialSchema, updateTestimonialSchema } = require('../../validators/testimoniValidator/testimoniValidator');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Adds support for formats like email

class TestimonialController {
    async getAllTestimonials(req, res) {
        try {
            const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 10, 50)); // Limit antara 1 dan 50
            const page = Math.max(1, parseInt(req.query.page) || 1); // Default page adalah 1
            const offset = (page - 1) * limit; // Hitung offset

            const isApproved = req.query.isApproved === 'false' || req.query.isApproved === '0' ? false : true;
            
            const testimonials = await testimoniService.getAllTestimonials(limit, offset, isApproved);

            return res.status(200).json(webResponses.successResponse(testimonials));
        } catch (error) {
            console.error('Get all testimonials error:', error);
            return res.status(500).json(webResponses.errorResponse('Gagal mengambil data testimoni'));
        }
    }


    async getTestimonialById(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return res.status(400).json(webResponses.errorResponse('ID testimoni tidak valid'));
            }

            const testimonial = await testimoniService.getTestimonialById(Number(id));
            return res.status(200).json(webResponses.successResponse(testimonial));
        } catch (error) {
            if (error.message === 'Testimonial not found') {
                return res.status(404).json(webResponses.errorResponse('Testimoni tidak ditemukan'));
            }
            console.error('Get testimonial by id error:', error);
            return res.status(500).json(webResponses.errorResponse('Gagal mengambil data testimoni'));
        }
    }

    async createTestimonial(req, res) {
        try {
            const valid = ajv.validate(createTestimonialSchema, req.body);
            
            if (!valid) {
                const errors = ajv.errors.map(error => ({
                    field: error.instancePath.slice(1),
                    message: error.message
                }));
                return res.status(400).json(webResponses.errorResponse('Data tidak valid', errors));
            }

            const testimonial = await testimoniService.createTestimonial(req.body);
            return res.status(201).json(webResponses.successResponse(testimonial, 'Testimoni berhasil dibuat'));
        } catch (error) {
            console.error('Create testimonial error:', error);
            return res.status(500).json(webResponses.errorResponse('Gagal membuat testimoni'));
        }
    }

    async updateTestimonial(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return res.status(400).json(webResponses.errorResponse('ID testimoni tidak valid'));
            }

            const valid = ajv.validate(updateTestimonialSchema, req.body);
            if (!valid) {
                const errors = ajv.errors.map(error => ({
                    field: error.instancePath.slice(1),
                    message: error.message
                }));
                return res.status(400).json(webResponses.errorResponse('Data tidak valid', errors));
            }

            const testimonial = await testimoniService.updateTestimonial(Number(id), req.body);
            return res.status(200).json(webResponses.successResponse(testimonial, 'Testimoni berhasil diperbarui'));
        } catch (error) {
            if (error.message === 'Testimonial not found') {
                return res.status(404).json(webResponses.errorResponse('Testimoni tidak ditemukan'));
            }
            console.error('Update testimonial error:', error);
            return res.status(500).json(webResponses.errorResponse('Gagal memperbarui testimoni'));
        }
    }

    async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return res.status(400).json(webResponses.errorResponse('ID testimoni tidak valid'));
            }

            await testimoniService.deleteTestimonial(Number(id));
            return res.status(200).json(webResponses.successResponse(null, 'Testimoni berhasil dihapus'));
        } catch (error) {
            if (error.message === 'Testimonial not found') {
                return res.status(404).json(webResponses.errorResponse('Testimoni tidak ditemukan'));
            }
            console.error('Delete testimonial error:', error);
            return res.status(500).json(webResponses.errorResponse('Gagal menghapus testimoni'));
        }
    }

    
    async toggleApprovalStatus(req, res) {
        try {
            const { id } = req.params;
            const { isApproved } = req.body;
            
            // Validasi ID
            if (!id || isNaN(id)) {
                return res.status(400).json(webResponses.errorResponse('ID testimoni tidak valid'));
            }

            // Validasi isApproved harus boolean
            if (typeof isApproved !== 'boolean') {
                return res.status(400).json(webResponses.errorResponse('Status approval harus berupa boolean (true/false)'));
            }

            const testimonial = await testimoniService.toggleApprovalStatus(Number(id), isApproved);
            
            const message = isApproved 
                ? 'Testimoni berhasil disetujui' 
                : 'Persetujuan testimoni berhasil dibatalkan';
                
            return res.status(200).json(webResponses.successResponse(testimonial, message));
        } catch (error) {
            if (error.message === 'Testimonial not found') {
                return res.status(404).json(webResponses.errorResponse('Testimoni tidak ditemukan'));
            }
            console.error('Toggle approval status error:', error);
            return res.status(500).json(webResponses.errorResponse('Gagal mengubah status persetujuan testimoni'));
        }
    }
}

module.exports = new TestimonialController();