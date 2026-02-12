const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    buyerDetails: {
        name: String,
        companyName: String,
        address: String,
        phones: [String]
    },
    title: {
        type: String, // Optional title, can be auto-generated or user input
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    targetDate: {
        type: Date
    },
    reference: {
        type: String,
        trim: true
    },
    
    // Item Names - General items being purchased
    itemNames: [{
        item: { type: String },
        qty: { type: Number, default: 1 },
        unit: { type: String, default: 'pc' }
    }],
    
    // Buyer Target Set - Items for buyer's target
    buyerTargetSet: [{
        item: { type: String },
        qty: { type: Number, default: 1 },
        unit: { type: String, default: 'pc' },
        shippedQty: { type: Number, default: 0 } // Track shipped quantity
    }],
    
    items: [{
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        hasQuantity: {
            type: Boolean,
            default: true,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        discountType: {
            type: String,
            enum: ['fixed', 'percentage'],
            default: 'fixed',
        },
        discountValue: {
            type: Number,
            default: 0,
        }
    }],
    discountType: {
        type: String,
        enum: ['fixed', 'percentage'],
        default: 'fixed',
    },
    discountValue: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    
    // Payment Tracking
    dueAmount: {
        type: Number,
        default: 0
    },
    cashAmount: {
        type: Number,
        default: 0
    },
    advanceAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
