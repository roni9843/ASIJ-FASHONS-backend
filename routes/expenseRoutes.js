const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createExpense).get(protect, getExpenses);
router.route('/:id')
    .get(protect, getExpenseById)
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

module.exports = router;
