const express = require('express');
const router = express.Router();
const { createBuyer, getBuyers, updateBuyer, deleteBuyer } = require('../controllers/buyerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBuyer)
    .get(protect, getBuyers);

router.route('/:id')
    .put(protect, updateBuyer)
    .delete(protect, deleteBuyer);

module.exports = router;
