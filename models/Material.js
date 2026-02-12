const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String, // e.g., 'Fabric', 'Accessories', 'Thread'
        required: true,
    },
    unit: {
        type: String, // e.g., 'Meters', 'Pcs'
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    minLevel: {
        type: Number,
        default: 10, // Alert threshold
    },
    costPerUnit: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;
