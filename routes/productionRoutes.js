const express = require('express');
const router = express.Router();
const { getProductionLogs, addProductionLog } = require('../controllers/productionController');

router.get('/', getProductionLogs);
router.post('/', addProductionLog);

module.exports = router;
