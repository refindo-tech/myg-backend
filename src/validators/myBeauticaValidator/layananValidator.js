const createLayananSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        imageUrl: { type: 'string', nullable: true },
        viewCount: { type: 'number', nullable: true },
    },
    required: ['title', 'description', 'price', 'uploadedBy'],
    additionalProperties: false,
};

const updateLayananSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        imageUrl: { type: 'string', nullable: true },
        viewCount: { type: 'number', nullable: true },
    },
    additionalProperties: false,
};

module.exports = {
    createLayananSchema,
    updateLayananSchema,
};
