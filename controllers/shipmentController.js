const Shipment = require('../models/Shipment');
const Purchase = require('../models/Purchase');

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Private
const createShipment = async (req, res) => {
    try {
        const {
            purchase,
            buyer,
            buyerDetails,
            shipmentDate,
            reference,
            shippedItems,
            totalAmount,
            notes
        } = req.body;

        const shipment = new Shipment({
            purchase,
            buyer,
            buyerDetails,
            shipmentDate,
            reference,
            shippedItems: shippedItems || [],
            totalAmount,
            notes
        });

        const createdShipment = await shipment.save();

        // Update the purchase to deduct shipped quantities
        if (purchase && shippedItems && shippedItems.length > 0) {
            const purchaseDoc = await Purchase.findById(purchase);
            
            if (purchaseDoc && purchaseDoc.buyerTargetSet) {
                // Update each target item's shippedQty
                shippedItems.forEach(shippedItem => {
                    const targetItem = purchaseDoc.buyerTargetSet.find(
                        item => item.item === shippedItem.item
                    );
                    
                    if (targetItem) {
                        // Add the shipped quantity to the existing shippedQty
                        targetItem.shippedQty = (targetItem.shippedQty || 0) + shippedItem.qty;
                    }
                });
                
                await purchaseDoc.save();
            }
        }

        res.status(201).json(createdShipment);
    } catch (error) {
        res.status(400).json({ message: 'Invalid shipment data', error: error.message });
    }
};

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({})
            .populate('buyer', 'name companyName')
            .populate('purchase', 'title reference')
            .sort({ createdAt: -1 });
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get shipment by ID
// @route   GET /api/shipments/:id
// @access  Private
const getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id)
            .populate('buyer')
            .populate('purchase');

        if (shipment) {
            res.json(shipment);
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get shipments by buyer
// @route   GET /api/shipments/buyer/:buyerId
// @access  Private
const getShipmentsByBuyer = async (req, res) => {
    try {
        const shipments = await Shipment.find({ buyer: req.params.buyerId })
            .populate('purchase', 'title reference')
            .sort({ createdAt: -1 });
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update shipment
// @route   PUT /api/shipments/:id
// @access  Private
const updateShipment = async (req, res) => {
    try {
        const {
            purchase,
            buyer,
            buyerDetails,
            shipmentDate,
            reference,
            shippedItems,
            totalAmount,
            notes
        } = req.body;

        const shipment = await Shipment.findById(req.params.id);

        if (shipment) {
            shipment.purchase = purchase || shipment.purchase;
            shipment.buyer = buyer || shipment.buyer;
            shipment.buyerDetails = buyerDetails || shipment.buyerDetails;
            shipment.shipmentDate = shipmentDate || shipment.shipmentDate;
            shipment.reference = reference || shipment.reference;
            shipment.shippedItems = shippedItems !== undefined ? shippedItems : shipment.shippedItems;
            shipment.totalAmount = totalAmount !== undefined ? totalAmount : shipment.totalAmount;
            shipment.notes = notes || shipment.notes;

            const updatedShipment = await shipment.save();
            res.json(updatedShipment);
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid shipment data', error: error.message });
    }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Private
const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (shipment) {
            await shipment.deleteOne();
            res.json({ message: 'Shipment removed' });
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createShipment,
    getShipments,
    getShipmentById,
    getShipmentsByBuyer,
    updateShipment,
    deleteShipment
};
