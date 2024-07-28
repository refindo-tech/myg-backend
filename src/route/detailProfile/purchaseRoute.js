const express = require('express');
const router = express.Router();
const purchaseController = require('../../controllers/detailProfile/purchaseController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.get('/purchases/:userId', authMiddleware, purchaseController.getPurchases);
router.get('/purchases', authMiddleware, purchaseController.getPurchasesByToken);
router.get('/purchase-details/:orderId', authMiddleware, purchaseController.getPurchaseDetails);

module.exports = router;
