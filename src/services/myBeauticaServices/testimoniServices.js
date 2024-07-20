const { database } = require('../../helpers/config/db');

async function getAllTestimonials() {
    return await database.review.findMany({
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
    // Validasi serviceId
    const serviceExists = await database.beautyService.findUnique({
        where: { serviceId: data.serviceId },
    });

    if (!serviceExists) {
        throw new Error('Invalid serviceId. The specified service does not exist.');
    }

    return await database.review.create({
        data: {
            userId: data.userId,
            serviceId: data.serviceId,
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
