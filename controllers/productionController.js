const Production = require('../models/Production');

const getProductionLogs = async (req, res) => {
    try {
        const logs = await Production.find().populate('orderId', 'orderNo styleNo');
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addProductionLog = async (req, res) => {
    try {
        const log = await Production.create(req.body);
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getProductionLogs, addProductionLog };
