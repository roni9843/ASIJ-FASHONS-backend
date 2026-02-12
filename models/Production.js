const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    stage: {
        type: String,
        enum: ['Cutting', 'Sewing', 'Finishing'],
        required: true,
    },
    inputQuantity: {
        type: Number,
        required: true,
    },
    outputQuantity: {
        type: Number,
        required: true,
    },
    rejectedQuantity: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    operatorName: {
        type: String,
        default: 'Unknown',
    }
}, {
    timestamps: true,
});

const Production = mongoose.model('Production', productionSchema);
module.exports = Production;
