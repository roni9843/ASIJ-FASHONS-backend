const ExternalProfile = require('../models/ExternalProfile');

// Get all profiles
const getProfiles = async (req, res) => {
    try {
        const profiles = await ExternalProfile.find({}).sort({ name: 1 });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new profile
const createProfile = async (req, res) => {
    try {
        const { name, phone, address, details } = req.body;
        
        const profileExists = await ExternalProfile.findOne({ name });
        if (profileExists) {
            return res.status(400).json({ message: 'Profile already exists' });
        }

        const profile = await ExternalProfile.create({
            name,
            phone,
            address,
            details
        });

        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, details } = req.body;
        const profile = await ExternalProfile.findById(req.params.id);

        if (profile) {
            profile.name = name || profile.name;
            profile.phone = phone || profile.phone;
            profile.address = address || profile.address;
            profile.details = details || profile.details;

            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete profile
const deleteProfile = async (req, res) => {
    try {
        const profile = await ExternalProfile.findById(req.params.id);
        if (profile) {
            await profile.deleteOne();
            res.json({ message: 'Profile removed' });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfiles,
    createProfile,
    updateProfile,
    deleteProfile
};
