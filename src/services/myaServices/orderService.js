const { database } = require('../../helpers/config/db');

class OrderService {

    //get all orders by user id
    static async getOrdersByUser(userId) {
        return await database.order.findMany({
            where: { userId: userId },
            include: { orderItems: { include: { product: true } } }
        });
    }

    static async createOrder(userId) {
        // Get user's cart
        const cart = await database.cart.findUnique({
            where: { userId: userId },
            include: { cartItems: { include: { product: { include: { price: true } } } } }
        });

        if (!cart || cart.cartItems.length === 0) {
            throw new Error('Cart is empty or not found');
        }

        // Get user's label
        const user = await database.user.findUnique({
            where: { userId: userId },
            select: { userLabel: true }
        });

        const userLabel = user.userLabel || 'RETAIL'; // Default to 'RETAIL' if no label provided

        // Calculate total amount
        const totalAmount = cart.cartItems.reduce((total, item) => {
            const price = item.product.price.find(p => p.type === userLabel)?.price || 0;
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
                        price: item.product.price.find(p => p.type === userLabel)?.price || 0
                    }))
                }
            }
        });

        // Clear the cart
        await database.cartItem.deleteMany({ where: { cartId: cart.cartId } });

        return order;
    }
}

module.exports = OrderService;
