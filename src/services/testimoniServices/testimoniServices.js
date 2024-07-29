const { database } = require('../../helpers/config/db');

async function getAllTestimonials(limit) {
    return await database.review.findMany({
        take: limit,
        include: {
            user: {
                include: {
                    userProfiles: true,
                },
            },
        },
    });
}

async function getTestimonialById(id) {
    return await database.review.findUnique({
        where: { reviewId: id },
        include: {
            user: {
                include: {
                    userProfiles: true,
                },
            },
        },
    });
}

async function createTestimonial(data) {
    return await database.review.create({
        data: {
            userId: data.userId,
            comment: data.comment,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
}

async function updateTestimonial(id, data) {
    return await database.review.update({
        where: { reviewId: id },
        data: {
            comment: data.comment,
            updatedAt: new Date(),
        },
    });
}

async function deleteTestimonial(id) {
    return await database.review.delete({ where: { reviewId: id } });
}

module.exports = { 
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
};
