const express = require('express');
const router = express.Router();
const purchaseController = require('../../controllers/detailProfile/purchaseController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.use((req, res, next) => {
    const allowedOrigins = ['http://92.112.192.81:3000', 'http://127.0.0.1:3000','http://localhost:3001', 'http://127.0.0.1:3001', 'https://myg.app'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }
    next();
});

router.get('/purchases/:userId', authMiddleware, purchaseController.getPurchases);
router.get('/purchases', authMiddleware, purchaseController.getPurchasesByToken);
router.get('/purchase-details/:orderId', authMiddleware, purchaseController.getPurchaseDetails);

module.exports = router;
