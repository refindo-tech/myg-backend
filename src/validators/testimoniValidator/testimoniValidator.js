const createTestimonialSchema = {
    type: 'object',
    properties: {
        userId: { type: 'number' },
        comment: { type: 'string' },
    },
    required: ['userId', 'comment'],
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
