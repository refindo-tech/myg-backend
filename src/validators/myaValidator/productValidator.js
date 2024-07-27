const productSchema = {
    type: "object",
    properties: {
        productId: { type: "integer" },
        name: { type: "string" },
        description: { type: "string" },
        stock: { type: "integer" },
        productImages: { type: "array", items: { type: "string" } },
        type: { type: "string", enum: ['PRODUCT', 'SERVICE'] },
        uploadedBy: { type: "integer" },
        price: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    type: { type: "string", enum: ['RETAIL', 'AGENT', 'DISTRIBUTOR'] },
                    price: { type: "number" }
                },
                required: ["type", "price"],
                additionalProperties: false
            },
            minItems: 3,
            uniqueItems: true
        }
    },
    required: ["name", "description", "stock", "productImages", "type", "price"],
    additionalProperties: false
};

const createProductSchema = {
    ...productSchema,
};

const updateProductSchema = {
    ...productSchema,
    required: [], // Allow partial updates
};

module.exports = {
    createProductSchema,
    updateProductSchema,
};
