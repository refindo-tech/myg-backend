// testimoniService.js
const { database } = require('../../helpers/config/db');

class TestimonialService {
    async getAllTestimonials(limit = 6, offset = 0, isApproved = true) {
        try {
            return await database.review.findMany({
                take: limit,
                skip: offset,  // Tambahkan offset untuk pagination
                where: { 
                    isApproved: isApproved ? true : undefined 
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            throw new Error(`Failed to fetch testimonials: ${error.message}`);
        }
    }


    async getTestimonialById(id) {
        try {
            const testimonial = await database.review.findUnique({
                where: { reviewId: Number(id) }
            });
            
            if (!testimonial) {
                throw new Error('Testimonial not found');
            }
            
            return testimonial;
        } catch (error) {
            throw new Error(`Failed to fetch testimonial: ${error.message}`);
        }
    }

    async createTestimonial(data) {
        try {
            return await database.review.create({
                data: {
                    name: data.name.trim(),
                    email: data.email.toLowerCase().trim(),
                    role: data.role.trim(),
                    comment: data.comment.trim(),
                    isApproved: false, // Default to false for moderation
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
        } catch (error) {
            throw new Error(`Failed to create testimonial: ${error.message}`);
        }
    }

    async updateTestimonial(id, data) {
        try {
            // Check if testimonial exists
            const exists = await this.getTestimonialById(id);
            
            if (!exists) {
                throw new Error('Testimonial not found');
            }

            return await database.review.update({
                where: { reviewId: Number(id) },
                data: {
                    name: data.name?.trim(),
                    email: data.email?.toLowerCase().trim(),
                    role: data.role?.trim(),
                    comment: data.comment?.trim(),
                    updatedAt: new Date(),
                }
            });
        } catch (error) {
            throw new Error(`Failed to update testimonial: ${error.message}`);
        }
    }

    async deleteTestimonial(id) {
        try {
            // Check if testimonial exists
            const exists = await this.getTestimonialById(id);
            
            if (!exists) {
                throw new Error('Testimonial not found');
            }

            return await database.review.delete({
                where: { reviewId: Number(id) }
            });
        } catch (error) {
            throw new Error(`Failed to delete testimonial: ${error.message}`);
        }
    }

    
    async toggleApprovalStatus(id, status) {
        try {
            // Check if testimonial exists
            const exists = await this.getTestimonialById(id);
            
            if (!exists) {
                throw new Error('Testimonial not found');
            }

            return await database.review.update({
                where: { reviewId: Number(id) },
                data: {
                    isApproved: status,
                    updatedAt: new Date(),
                }
            });
        } catch (error) {
            throw new Error(`Failed to update approval status: ${error.message}`);
        }
    }
}


module.exports = new TestimonialService();