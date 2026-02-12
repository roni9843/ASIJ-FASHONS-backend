const express = require('express');
const router = express.Router();
const {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase
} = require('../controllers/purchaseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createPurchase).get(protect, getPurchases);
router.route('/:id').get(protect, getPurchaseById).put(protect, updatePurchase).delete(protect, deletePurchase);

module.exports = router;
