const { database } = require('../../helpers/config/db');

class ProductService {
    async getAllProduct(limit = 10, category = '') {
        const queryOptions = {
            where: category ? { category } : {},
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { price: true },
        };
        // const userLabel = 'RETAIL';
        // const products = await database.product.findMany(queryOptions);
        // products.forEach(product => {
        //     product.price = product.price.find(p => p.type === userLabel)?.price || 0;
        // });

        const products = await database.product.findMany(queryOptions);
        products.forEach(product => {
            // add each price type to the product object as a key-value pair
            product.price = product.price.reduce((acc, curr) => {
                acc[curr.type] = curr.price;
                return acc;
            }
            , {});
        }
        );

        return products;
    }

    async getProductById(id) {
        const product = await database.product.findUnique({ 
            where: { productId: id },
            include: { price: true }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // const userLabel = 'RETAIL';
        // product.price = product.price.find(p => p.type === userLabel)?.price || 0;
        // add each price type to the product object as a key-value pair
        product.price = product.price.reduce((acc, curr) => {
            acc[curr.type] = curr.price;
            return acc;
        }, {});

        return product;
    }

    async createProduct(data, userId) {
        const { price, ...productData } = data;
        const product = await database.product.create({
            data: {
                ...productData,
                uploadedBy: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
                price: {
                    create: price.map(p => ({
                        type: p.type,
                        price: p.price
                    }))
                }
            },
            include: { price: true }
        });
        return product;
    }

    async updateProduct(id, data) {
        const { price, ...productData } = data;

        const updateData = {
            ...productData,
            updatedAt: new Date(),
        };

        if (price) {
            updateData.price = {
                deleteMany: {},
                create: price.map(p => ({
                    type: p.type,
                    price: p.price
                }))
            };
        }

        const product = await database.product.update({
            where: { productId: id },
            data: updateData,
            include: { price: true }
        });

        return product;
    }

    async deleteProduct(id) {
        return await database.product.delete({ where: { productId: id } });
    }
}

module.exports = new ProductService();
