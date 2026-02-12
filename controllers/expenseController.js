const Expense = require('../models/Expense');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private/Admin
const createExpense = async (req, res) => {
    try {
        const { title, subtitle, description, items, discountType, discountValue, totalAmount, expenseDate, reference } = req.body;

        const expense = await Expense.create({
            title,
            subtitle,
            description,
            items,
            discountType,
            discountValue,
            totalAmount,
            date: expenseDate,
            reference
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({}).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            res.json(expense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private/Admin
const updateExpense = async (req, res) => {
    try {
        const { title, subtitle, description, items, discountType, discountValue, totalAmount, expenseDate, reference } = req.body;

        const expense = await Expense.findById(req.params.id);

        if (expense) {
            expense.title = title || expense.title;
            expense.subtitle = subtitle || expense.subtitle;
            expense.description = description || expense.description;
            expense.items = items || expense.items;
            expense.discountType = discountType || expense.discountType;
            expense.discountValue = discountValue || expense.discountValue;
            expense.totalAmount = totalAmount || expense.totalAmount;
            expense.date = expenseDate || expense.date;
            expense.reference = reference || expense.reference;

            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            await expense.deleteOne();
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
};
