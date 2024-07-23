const webResponses = require('../../helpers/web/webResponses');
const purchaseService = require('../../services/detailProfile/purchaseService');

async function getPurchases(req, res) {
    const { userId } = req.params;
    const requesterId = req.user.userId;
    const requesterRole = req.user.role;

    if (requesterId !== parseInt(userId) && requesterRole !== 'ADMIN' && requesterRole !== 'SUPER_ADMIN') {
        return res.status(403).json(webResponses.errorResponse('Access denied. Insufficient permissions.'));
    }

    try {
        const purchases = await purchaseService.getPurchasesByUserId(parseInt(userId));
        const results = purchases.map(order => ({
            code: order.code,
            description: order.orderItems[0].product.name, // Assuming one product per order
            productImages: order.orderItems[0].product.productImages,
            totalAmount: order.totalAmount,
            status: order.status,
            details: order.orderItems.map(item => ({
                productName: item.product.name,
                quantity: item.quantity,
                price: item.price,
                createdAt: order.createdAt,
                totalAmount: order.totalAmount
            }))
        }));
        res.status(200).json(webResponses.successResponse('Purchases fetched successfully', results));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch purchases'));
    }
}

async function getPurchasesByToken(req, res) {
    const userId = req.user.userId;  // Get userId from the token
    const role = req.user.role;

    try {
        let purchases;
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            purchases = await purchaseService.getPurchasesByUserId(userId);
        } else {
            purchases = await purchaseService.getPurchasesByUserId(userId);
        }

        const results = purchases.map(order => ({
            code: order.code,
            description: order.orderItems[0].product.name, // Assuming one product per order
            productImages: order.orderItems[0].product.productImages,
            totalAmount: order.totalAmount,
            status: order.status,
            details: order.orderItems.map(item => ({
                productName: item.product.name,
                quantity: item.quantity,
                price: item.price,
                createdAt: order.createdAt,
                totalAmount: order.totalAmount
            }))
        }));
        res.status(200).json(webResponses.successResponse('Purchases fetched successfully', results));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch purchases'));
    }
}

async function getPurchaseDetails(req, res) {
    const { orderId } = req.params;
    const requesterId = req.user.userId;
    const requesterRole = req.user.role;

    try {
        const purchase = await purchaseService.getPurchaseDetailsByOrderId(parseInt(orderId));

        if (!purchase) {
            return res.status(404).json(webResponses.errorResponse('Purchase not found'));
        }

        if (purchase.userId !== requesterId && requesterRole !== 'ADMIN' && requesterRole !== 'SUPER_ADMIN') {
            return res.status(403).json(webResponses.errorResponse('Access denied. Insufficient permissions.'));
        }

        const result = {
            productName: purchase.orderItems[0].product.name,
            quantity: purchase.orderItems[0].quantity,
            price: purchase.orderItems[0].price,
            createdAt: purchase.createdAt,
            totalAmount: purchase.totalAmount
        };

        res.status(200).json(webResponses.successResponse('Purchase details fetched successfully', result));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch purchase details'));
    }
}

module.exports = {
    getPurchases,
    getPurchasesByToken,
    getPurchaseDetails
};
