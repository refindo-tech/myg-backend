const { database } = require('../../helpers/config/db');

class CartItemService {
    //get all cart items by cart id
    static async addCartItem(cartId, productId, quantity) {

        //check if cart item already exists
        const cartItem = await database.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cartId,
                    productId: productId
                }
            }
        });

        if (cartItem) {
            return await database.cartItem.update({
                where: {
                    cartId_productId: {
                        cartId: cartId,
                        productId: productId
                    }
                },
                data: {
                    quantity: cartItem.quantity + quantity
                }
            });
        }

        return await database.cartItem.create({
            data: {
                cartId: cartId,
                productId: productId,
                quantity: quantity
            }
        });
    }

    //updateCartItem
    static async updateCartItem(cartId, productId, quantity) {
        return await database.cartItem.update({
            where: {
                cartId_productId: {
                    cartId: cartId,
                    productId: productId
                }
            },
            data: {
                quantity: quantity
            }
        });
    }

    //bulk update cart items
    static async bulkUpdateCartItems(cartId, cartItems) {
        const updatePromises = cartItems.map(item =>
            database.cartItem.updateMany({
                where: {
                    cartId: cartId,
                    productId: item.productId
                },
                data: {
                    quantity: item.quantity,
                },
            })
        );
    
        return await Promise.all(updatePromises);
    }
    
    //remove cart item
    static async removeCartItem(cartId, productId) {
        return await database.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cartId,
                    productId: productId
                }
            }
        });
    }
}

module.exports = CartItemService;