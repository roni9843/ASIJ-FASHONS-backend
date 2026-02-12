const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        trim: true
    },
    phones: [{
        type: String,
        trim: true
    }],
    address: {
        type: String,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;
