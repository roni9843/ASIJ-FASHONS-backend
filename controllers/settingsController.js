const Settings = require('../models/Settings');
const bcrypt = require('bcryptjs');

const DEFAULT_PASSWORD = '11223344';

// @desc    Get all settings or specific setting by key
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.find({});
        const settingsObj = {};
        
        let actionPasswordExists = false;

        settings.forEach(s => {
            if (s.key === 'actionPassword') {
                actionPasswordExists = true;
                settingsObj[s.key] = true; 
            } else {
                settingsObj[s.key] = s.value;
            }
        });

        // Inform frontend if using default
        settingsObj.isDefaultPassword = !actionPasswordExists;

        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update action password
// @route   POST /api/settings/action-password
// @access  Private/Admin
const updateActionPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }
        if (!oldPassword) {
            return res.status(400).json({ message: 'Current password is required' });
        }

        const setting = await Settings.findOne({ key: 'actionPassword' });

        if (setting) {
            // Verify old password against DB
            const isMatch = await bcrypt.compare(oldPassword, setting.value);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect current password' });
            }
        } else {
            // No password set, check against default
            if (oldPassword !== DEFAULT_PASSWORD) {
                return res.status(401).json({ message: 'Incorrect current password (default is 11223344)' });
            }
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await Settings.findOneAndUpdate(
            { key: 'actionPassword' },
            { 
                key: 'actionPassword', 
                value: hashedPassword, 
                description: 'Password required for sensitive actions like delete/edit' 
            },
            { upsert: true, new: true }
        );

        res.json({ message: 'Action password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify action password
// @route   POST /api/settings/verify-action-password
// @access  Private
const verifyActionPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const setting = await Settings.findOne({ key: 'actionPassword' });
        
        if (!setting) {
            // If not set, check against default
            if (password === DEFAULT_PASSWORD) {
                return res.json({ success: true });
            } else {
                 return res.status(401).json({ success: false, message: 'Invalid password' });
            }
        }

        const isMatch = await bcrypt.compare(password, setting.value);

        if (isMatch) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateActionPassword,
    verifyActionPassword
};
