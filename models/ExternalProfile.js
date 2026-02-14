const mongoose = require('mongoose');

const externalProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    details: {
        type: String,
        trim: true // Any extra notes
    }
}, {
    timestamps: true
});

const ExternalProfile = mongoose.model('ExternalProfile', externalProfileSchema);
module.exports = ExternalProfile;
