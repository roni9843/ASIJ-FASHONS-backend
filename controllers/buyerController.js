const Buyer = require('../models/Buyer');

// @desc    Create a new buyer
// @route   POST /api/buyers
// @access  Private
const createBuyer = async (req, res) => {
    try {
        const { name, companyName, phones, address, subtitle, description } = req.body;

        const buyer = await Buyer.create({
            name,
            companyName,
            phones,
            address,
            subtitle,
            description
        });

        res.status(201).json(buyer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all buyers
// @route   GET /api/buyers
// @access  Private
const getBuyers = async (req, res) => {
    try {
        const buyers = await Buyer.find({}).sort({ createdAt: -1 });
        res.json(buyers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a buyer
// @route   PUT /api/buyers/:id
// @access  Private
const updateBuyer = async (req, res) => {
    try {
        const { name, companyName, phones, address, subtitle, description } = req.body;

        const buyer = await Buyer.findById(req.params.id);

        if (buyer) {
            buyer.name = name || buyer.name;
            buyer.companyName = companyName || buyer.companyName;
            buyer.phones = phones || buyer.phones;
            buyer.address = address || buyer.address;
            buyer.subtitle = subtitle || buyer.subtitle;
            buyer.description = description || buyer.description;

            const updatedBuyer = await buyer.save();
            res.json(updatedBuyer);
        } else {
            res.status(404).json({ message: 'Buyer not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a buyer
// @route   DELETE /api/buyers/:id
// @access  Private
const deleteBuyer = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.params.id);

        if (buyer) {
            await buyer.deleteOne();
            res.json({ message: 'Buyer removed' });
        } else {
            res.status(404).json({ message: 'Buyer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get buyer statistics (purchases and shipments)
// @route   GET /api/buyers/:id/stats
// @access  Private
const getBuyerStats = async (req, res) => {
    try {
        const Purchase = require('../models/Purchase');
        const Shipment = require('../models/Shipment');
        
        const buyerId = req.params.id;
        
        // Get all purchases for this buyer
        const purchases = await Purchase.find({ buyer: buyerId });
        
        // Calculate total target items and collect item details
        let totalTargetQty = 0;
        let totalShippedQty = 0;
        const itemsMap = {}; // Track each unique item
        
        purchases.forEach(purchase => {
            if (purchase.buyerTargetSet && purchase.buyerTargetSet.length > 0) {
                purchase.buyerTargetSet.forEach(item => {
                    const itemName = item.item;
                    const qty = item.qty || 0;
                    const shipped = item.shippedQty || 0;
                    
                    totalTargetQty += qty;
                    totalShippedQty += shipped;
                    
                    // Aggregate by item name
                    if (!itemsMap[itemName]) {
                        itemsMap[itemName] = {
                            item: itemName,
                            totalQty: 0,
                            shippedQty: 0,
                            unit: item.unit || 'pc'
                        };
                    }
                    itemsMap[itemName].totalQty += qty;
                    itemsMap[itemName].shippedQty += shipped;
                });
            }
        });
        
        // Convert items map to array and calculate percentages
        const items = Object.values(itemsMap).map(item => ({
            ...item,
            pendingQty: item.totalQty - item.shippedQty,
            completionPercentage: item.totalQty > 0 
                ? Math.round((item.shippedQty / item.totalQty) * 100) 
                : 0
        }));
        
        // Calculate completion percentage
        const completionPercentage = totalTargetQty > 0 
            ? Math.round((totalShippedQty / totalTargetQty) * 100) 
            : 0;
        
        // Get shipment count
        const shipmentCount = await Shipment.countDocuments({ buyer: buyerId });
        
        res.json({
            totalPurchases: purchases.length,
            totalTargetQty,
            totalShippedQty,
            pendingQty: totalTargetQty - totalShippedQty,
            completionPercentage,
            shipmentCount,
            items // Include item-level details
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBuyer,
    getBuyers,
    updateBuyer,
    deleteBuyer,
    getBuyerStats
};
