const { database } = require('../../helpers/config/db');

async function getPurchasesByUserId(userId) {
    return await database.order.findMany({
        where: {
            userId: userId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            },
            user: true
        }
    });
}

async function getPurchaseDetailsByOrderId(orderId) {
    return await database.order.findUnique({
        where: {
            orderId: orderId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            },
            user: true
        }
    });
}

module.exports = {
    getPurchasesByUserId,
    getPurchaseDetailsByOrderId
};
