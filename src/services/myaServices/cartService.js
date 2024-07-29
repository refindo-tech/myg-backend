const { database } = require('../../helpers/config/db');

//shopping cart system

class CartService {
    //get all cart cart items by user id
    static async getCart(userId) {
        return await database.cart.findUnique({
            where: {
                userId: userId
            },
            include:
            {
                cartItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                                productImages: true
                            }
                        }
                    }
                }
            }
        });
    }

    //create cart item
    static async createCart(userId) {
        return await database.cart.create({
            data: {
                userId: userId
            }
        });
    }

    //delete cart item by id
    static async clearCart(userId) {
        const cart = await database.cart.findUnique({
            where: {
                userId: userId,
            }
        });

        if (!cart) {
            return;
        }

        await database.cartItem.deleteMany({
            where: {
                cartId: cart.cartId
            }
        });
        return cart;
    }
}

module.exports = CartService;