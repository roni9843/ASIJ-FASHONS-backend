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

module.exports = {
    createBuyer,
    getBuyers,
    updateBuyer,
    deleteBuyer
};
