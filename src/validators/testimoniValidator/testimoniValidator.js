const createTestimonialSchema = {
    type: 'object',
    properties: {
        // userId: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        comment: { type: 'string' },
    },
    required: ['name', 'email', 'role', 'comment'],
    additionalProperties: false,
};

const updateTestimonialSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        comment: { type: 'string' },
    },
    additionalProperties: false,
};

module.exports = {
    createTestimonialSchema,
    updateTestimonialSchema,
};
