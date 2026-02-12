const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNo: {
        type: String,
        required: true,
        unique: true,
    },
    buyerName: {
        type: String,
        required: true,
    },
    styleNo: {
        type: String,
        required: true,
    },
    items: [{
        itemType: String, // e.g., Shirt, Pant
        quantity: Number,
        size: String,
        color: String
    }],
    totalQuantity: {
        type: Number,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Production', 'Completed', 'Shipped'],
        default: 'Pending',
    }
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
