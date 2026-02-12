const express = require('express');
const router = express.Router();
const {
    createShipment,
    getShipments,
    getShipmentById,
    getShipmentsByBuyer,
    updateShipment,
    deleteShipment
} = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getShipments)
    .post(protect, createShipment);

router.route('/:id')
    .get(protect, getShipmentById)
    .put(protect, updateShipment)
    .delete(protect, deleteShipment);

router.route('/buyer/:buyerId')
    .get(protect, getShipmentsByBuyer);

module.exports = router;
