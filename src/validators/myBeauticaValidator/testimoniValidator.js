const createTestimonialSchema = {
    type: 'object',
    properties: {
        userId: { type: 'number' },
        serviceId: { type: 'number' },
        comment: { type: 'string' },
    },
    required: ['userId', 'serviceId', 'comment'],
    additionalProperties: false,
};

const updateTestimonialSchema = {
    type: 'object',
    properties: {
        comment: { type: 'string' },
    },
    additionalProperties: false,
};

module.exports = {
    createTestimonialSchema,
    updateTestimonialSchema,
};
