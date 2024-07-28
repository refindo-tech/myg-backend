const { database } = require('../../helpers/config/db');

class ProductService {
    async getAllProduct({ limit }) {
        const queryOptions = {
            take: limit,
            // where: {
            //     AND: filters.categoryId ? [{ categoryId: filters.categoryId }] : [],
            // },
        };
        return await database.product.findMany(queryOptions);
    }

    async getProductById(id) {
        return await database.product.findUnique({ where: { productId: id } });
    }

    async createProduct(data) {
        return await database.product.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async updateProduct(id, data) {
        return await database.product.update({
            where: { productId: id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async deleteProduct(id) {
        return await database.product.delete({ where: { productId: id } });
    }
}

module.exports = new ProductService();
