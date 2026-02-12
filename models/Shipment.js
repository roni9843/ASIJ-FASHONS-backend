const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    buyerDetails: {
        name: String,
        companyName: String,
        address: String,
        phones: [String]
    },
    shipmentDate: {
        type: Date,
        default: Date.now
    },
    reference: {
        type: String,
        trim: true
    },
    // Items that were shipped from the purchase's Target Items
    shippedItems: [{
        item: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        unit: { type: String, default: 'pc' },
        unitPrice: { type: Number, default: 0 },
        discountType: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' },
        discountValue: { type: Number, default: 0 },
        amount: { type: Number, required: true, default: 0 }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Shipment', shipmentSchema);
