const express = require('express');
const router = express.Router();
const { getSettings, updateActionPassword, verifyActionPassword } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSettings);
router.post('/action-password', protect, updateActionPassword);
router.post('/verify-action-password', verifyActionPassword); // No auth required for verification

module.exports = router;
