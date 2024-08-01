const { database } = require('../../helpers/config/db');

async function getAllTestimonials(limit, isApproved = true) {
    console.log('isApproved:', isApproved);
    const testimonials = await database.review.findMany({
        take: limit,
        where: { isApproved: isApproved ? true : undefined },
        // include: {
        //     user: {
        //         include: {
        //             userProfiles: true,
        //         },
        //     },
        // },
    });

    // Mengubah nilai null pada studioName menjadi string kosong
    // testimonials.forEach(testimonial => {
    //     testimonial.user.userProfiles.forEach(profile => {
    //         profile.studioName = profile.studioName || '';
    //     });
    // });

    return testimonials;
}

async function getTestimonialById(id) {
    const testimonial = await database.review.findUnique({
        where: { reviewId: id },
        // include: {
        //     user: {
        //         include: {
        //             userProfiles: true,
        //         },
        //     },
        // },
    });

    // if (testimonial) {
    //     // Mengubah nilai null pada studioName menjadi string kosong
    //     testimonial.user.userProfiles.forEach(profile => {
    //         profile.studioName = profile.studioName || '';
    //     });
    // }

    return testimonial;
}

async function createTestimonial(data) {
    // Validasi userId
    // const userExists = await database.user.findUnique({
    //     where: { userId: data.userId },
    // });

    // if (!userExists) {
    //     throw new Error('Invalid userId. The specified user does not exist.');
    // }

    return await database.review.create({
        data: {
            // userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
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
            name: data.name,
            email: data.email,
            role: data.role,
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
