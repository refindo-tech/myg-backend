const Ajv = require("ajv");

const ajv = new Ajv();

const addToCartSchema = {
    type: "object",
    properties: {
        productId: { type: "integer" },
        quantity: { type: "integer", minimum: 1 },
    },
    required: ["productId", "quantity"],
    additionalProperties: false,
};

const updateCartItemSchema = {
    type: "object",
    properties: {
        quantity: { type: "integer", minimum: 1 },
    },
    required: ["quantity"],
    additionalProperties: false,
};

module.exports = {
    addToCartSchema,
    updateCartItemSchema,
    bulkUpdateCartItemSchema,
    
};
