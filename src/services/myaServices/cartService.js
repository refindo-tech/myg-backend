const { database } = require('../../helpers/config/db');

//shopping cart system

class CartService {
    //get all cart cart items by user id
    async getAllCartItems(userId) {
        return await database.cart.findMany({
            where: {
                userId: userId
            },
            include:
            {
                product: true
            }
        });
    }

    //delete cart item by id
    async deleteCartItem(cartId) {
        return await database.cart.delete({
            where: {
                id: cartId
            }
        });
    }

    //update cart item by id
    async updateCartItem(cartId, quantity) {
        return await database.cart.update({
            where: {
                id: cartId
            },
            data: {
                quantity: quantity
            }
        });
    }

    //clear cart by user id
    async clearCart(userId) {
        return await database.cart.deleteMany({
            where: {
                userId: userId
            }
        });
    }

    //add product to cart
    async addProductToCart(userId, productId, quantity) {
        const existingCart = await database.cart.findFirst({
            where: {
                userId: userId,
                productId: productId
            }
        });

        if (existingCart) {
            return await database.cart.update({
                where: {
                    id: existingCart.id
                },
                data: {
                    quantity: {
                        increment: quantity
                    }
                }
            });
        } else {
            return await database.cart.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quantity: quantity
                }
            });
        }
    }
}

module.exports = new CartService();