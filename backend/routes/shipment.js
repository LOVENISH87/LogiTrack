const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Route to get shipment details (public or protected? let's keep search public for tracking)
// GET /api/shipment/search?type=order&value=123
router.get('/search', shipmentController.getShipmentDetails);

// Route to get all shipments for the logged in user
// GET /api/shipment
router.get('/', protect, shipmentController.getUserShipments);

// Admin Routes
router.get('/all', protect, admin, shipmentController.getAllShipments);
router.post('/', protect, shipmentController.createShipment);
router.put('/:id', protect, admin, shipmentController.updateShipment);

module.exports = router;
