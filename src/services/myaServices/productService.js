const { database } = require('../../helpers/config/db');

async function getAllProduct({ limit}) {
    const queryOptions = {
        take: limit,
        // where: {
        //     AND: filters.categoryId ? [{ categoryId: filters.categoryId }] : [],
        // },
    };
    return await database.product.findMany(queryOptions);
}

async function getProductById(id) {
    return await database.product.findUnique({ where: { productId: id } });
}

async function createProduct(data) {
    return await database.product.create({
        data: {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
}

async function updateProduct(id, data) {
    return await database.product.update({
        where: { productId: id },
        data: {
            ...data,
            updatedAt: new Date(),
        },
    });
}

async function deleteProduct(id) {
    return await database.product.delete({ where: { productId: id } });
}

module.exports = { 
    getAllProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};