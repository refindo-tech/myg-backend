//Validate the data that is being sent to the server using Ajv

const productSchema = {
    type: "object",
    properties: {
        productId: { type: "integer" },
        name: { type: "string" },
        description: { type: "string" },
        priceId: { type: "integer" },
        stock: { type: "integer" },
        productImages: { type: "array", items: { type: "string" } },
        type: { type: "string", enum: ['PRODUCT','SERVICE','RETAIL','AGENT','DISTRIBUTOR'] }, 
        uploadedBy: { type: "integer" },
        // createdAt: { type: "string", format: "date-time" },
        // updatedAt: { type: "string", format: "date-time" },
        // price: { type: "array", items: { type: "object" } }, 
        // user: { type: "object" }, 
        // orderItems: { type: "array", items: { type: "object" } }, 
        // cart: { type: "array", items: { type: "object" } }, 
        // wishlist: { type: "array", items: { type: "object" } }, 
        // guideline: { type: "array", items: { type: "object" } } 
    },
    required: ["name", "description", "priceId", "stock", "productImages", "type", "uploadedBy"],
    additionalProperties: false
};

const createProductSchema = {
    ...productSchema,
    required: ["name", "description", "priceId", "stock", "productImages", "type", "uploadedBy"],
};

const updateProductSchema = {
    ...productSchema,
    required: [],
};

module.exports = {
    createProductSchema,
    updateProductSchema,
};