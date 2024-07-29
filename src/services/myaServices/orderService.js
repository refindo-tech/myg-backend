const { database } = require('../../helpers/config/db');

class OrderService {

    //get all orders by user id
    static async getOrdersByUser(userId) {
        return await database.order.findMany({
            where: { userId: userId },
            include: { orderItems: { include: { product: true } } }
        });
    }

    //get order by id
    static async getOrderById(orderId) {
        const data = await database.order.findUnique({
            where: { orderId: orderId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                productImages: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        userId: true,
                        userProfiles: {
                            select: {
                                fullName: true,
                                address: true,
                                phoneNumber: true
                            }
                        }
                    }
                }
            }
        });

        //add totalPrice to orderItems
        data.orderItems.forEach(orderItem => {
            orderItem.total = orderItem.quantity * orderItem.price;
        }
        );

        return data;
    }

    static async createOrder(userId) {
        // Fetch user's cart and user label in a single query
        const userData = await database.user.findUnique({
            where: { userId: userId },
            select: {
                userLabel: true,
                cart: {
                    include: {
                        cartItems: {
                            include: {
                                product: {
                                    include: { price: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        const cart = userData?.cart;
        const userLabel = userData?.userLabel || 'RETAIL';

        if (!cart || cart.cartItems.length === 0) {
            throw new Error('Cart is empty or not found');
        }

        // Determine user label if not present
        let label = userLabel;
        //if label is RETAIL or AGENT
        if (label === 'RETAIL' || label === 'AGENT') {
            const tempAmount = cart.cartItems.reduce((total, item) => {
                const price = item.product.price.find(p => p.type === label)?.price || 0;
                return total + item.quantity * price;
            }, 0);

            console.log(tempAmount);

            if (tempAmount > 10000000) {
                label = 'DISTRIBUTOR';
                console.log('DISTRIBUTOR');
            } else if (tempAmount > 3000000) {
                label = 'AGENT';
            }

            // Update user label
            if (label !== userLabel) {
                await database.user.update({
                    where: { userId: userId },
                    data: { userLabel: label }
                });
            }
        }

        // Calculate total amount with the determined label
        const totalAmount = cart.cartItems.reduce((total, item) => {
            const price = item.product.price.find(p => p.type === label)?.price || 0;
            return total + item.quantity * price;
        }, 0);

        // Create the order
        const order = await database.order.create({
            data: {
                userId: userId,
                totalAmount: totalAmount,
                code: `ORD-${Date.now()}`, // Simple order code generation
                status: 'PENDING', // Initial status
                orderItems: {
                    create: cart.cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price.find(p => p.type === label)?.price || 0
                    }))
                }
            }
        });

        // Clear the cart
        await database.cartItem.deleteMany({ where: { cartId: cart.cartId } });

        return order;
    }

    // Create order one product by product id
    static async createOrderOneProduct(userId, productId) {
        const product = await database.product.findUnique({
            where: { productId: productId },
            include: { price: true }
        });

        if (!product) {
            throw new Error('Product not found');
        }

        const userLabel = (await database.user.findUnique({
            where: { userId: userId },
            select: { userLabel: true }
        }))?.userLabel || 'RETAIL';

        const price = product.price.find(p => p.type === userLabel)?.price || 0;

        const order = await database.order.create({
            data: {
                userId: userId,
                totalAmount: price,
                code: `ORD-${Date.now()}`, // Simple order code generation
                status: 'PENDING', // Initial status
                orderItems: {
                    create: {
                        productId: productId,
                        quantity: 1,
                        price: price
                    }
                }
            }
        });

        return order;
    }

}

module.exports = OrderService;
