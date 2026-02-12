const Purchase = require('../models/Purchase');

// @desc    Create a new purchase
// @route   POST /api/purchases
// @access  Private
const createPurchase = async (req, res) => {
    try {
        const {
            buyer,
            buyerDetails,
            title,
            purchaseDate,
            targetDate,
            reference,
            itemNames,
            buyerTargetSet,
            items,
            discountType,
            discountValue,
            totalAmount,
            description,
            dueAmount,
            cashAmount,
            advanceAmount
        } = req.body;

        const purchase = new Purchase({
            buyer,
            buyerDetails,
            title,
            purchaseDate,
            targetDate,
            reference,
            itemNames: itemNames || [],
            buyerTargetSet: buyerTargetSet || [],
            items,
            discountType,
            discountValue,
            totalAmount,
            description,
            dueAmount: dueAmount || 0,
            cashAmount: cashAmount || 0,
            advanceAmount: advanceAmount || 0
        });

        const createdPurchase = await purchase.save();
        res.status(201).json(createdPurchase);
    } catch (error) {
        res.status(400).json({ message: 'Invalid purchase data', error: error.message });
    }
};

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private
const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({}).populate('buyer', 'name companyName').sort({ createdAt: -1 });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get purchase by ID
// @route   GET /api/purchases/:id
// @access  Private
const getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id).populate('buyer');

        if (purchase) {
            res.json(purchase);
        } else {
            res.status(404).json({ message: 'Purchase not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update purchase
// @route   PUT /api/purchases/:id
// @access  Private
const updatePurchase = async (req, res) => {
    try {
        const {
             buyer,
            buyerDetails,
            title,
            purchaseDate,
            targetDate,
            reference,
            itemNames,
            buyerTargetSet,
            items,
            discountType,
            discountValue,
            totalAmount,
            description,
            dueAmount,
            cashAmount,
            advanceAmount
        } = req.body;

        const purchase = await Purchase.findById(req.params.id);

        if (purchase) {
            purchase.buyer = buyer || purchase.buyer;
            purchase.buyerDetails = buyerDetails || purchase.buyerDetails;
            purchase.title = title || purchase.title;
            purchase.purchaseDate = purchaseDate || purchase.purchaseDate;
            purchase.targetDate = targetDate !== undefined ? targetDate : purchase.targetDate;
            purchase.reference = reference || purchase.reference;
            purchase.itemNames = itemNames !== undefined ? itemNames : purchase.itemNames;
            purchase.buyerTargetSet = buyerTargetSet !== undefined ? buyerTargetSet : purchase.buyerTargetSet;
            purchase.items = items || purchase.items;
            purchase.discountType = discountType || purchase.discountType;
            purchase.discountValue = discountValue !== undefined ? discountValue : purchase.discountValue;
            purchase.totalAmount = totalAmount || purchase.totalAmount;
            purchase.description = description || purchase.description;
            purchase.dueAmount = dueAmount !== undefined ? dueAmount : purchase.dueAmount;
            purchase.cashAmount = cashAmount !== undefined ? cashAmount : purchase.cashAmount;
            purchase.advanceAmount = advanceAmount !== undefined ? advanceAmount : purchase.advanceAmount;

            const updatedPurchase = await purchase.save();
            res.json(updatedPurchase);
        } else {
            res.status(404).json({ message: 'Purchase not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid purchase data', error: error.message });
    }
};

// @desc    Delete purchase
// @route   DELETE /api/purchases/:id
// @access  Private
const deletePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id);

        if (purchase) {
            await purchase.deleteOne();
            res.json({ message: 'Purchase removed' });
        } else {
            res.status(404).json({ message: 'Purchase not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase
};
