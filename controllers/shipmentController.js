const Shipment = require('../models/Shipment');

exports.getShipmentDetails = async (req, res) => {
    const { type, value } = req.query;

    if (!type || !value) {
        return res.status(400).json({
            success: false,
            message: 'Search type and value are required'
        });
    }

    try {
        let query = {};
        if (type === 'order') {
            query = { orderId: value };
        } else if (type === 'tracking') {
            query = { trackingId: value };
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid search type'
            });
        }

        const shipment = await Shipment.findOne(query);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        // Format the response to match the legacy PHP structure
        const formattedResponse = {
            success: true,
            shipment: {
                id: shipment.orderId,
                trackingId: shipment.trackingId,
                purchaseDate: shipment.createdAt.toDateString(), // formatting can be improved
                deliveryCharges: '$0.00', // Default or from DB if added
                productMRP: '$' + (shipment.productDetails?.price || 0).toFixed(2),
                totalAmount: '$' + (shipment.totalAmount || 0).toFixed(2),
                status: shipment.currentStatus,
                product: {
                    name: shipment.productDetails?.name || 'Unknown Product',
                    quantity: shipment.productDetails?.quantity || 1
                },
                address: {
                    street: shipment.receiver?.address,
                    city: shipment.currentLocation.split(',')[0], // inference
                    state: shipment.currentLocation.split(',')[1] || '',
                    zipCode: '', // Add to schema if needed
                    country: ''
                },
                timeline: shipment.history.map(event => ({
                    date: event.timestamp.toDateString(),
                    content: event.description || event.status,
                    location: event.location
                }))
            }
        };

        res.json(formattedResponse);

    } catch (error) {
        console.error('Error fetching shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get user shipments
// @route   GET /api/shipment
// @access  Private
exports.getUserShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({ owner: req.user._id });

        const formattedShipments = shipments.map(s => ({
            tracking_id: s.trackingId,
            status: s.currentStatus,
            origin: s.sender?.address?.split(',')[1]?.trim() || 'Unknown',
            destination: s.receiver?.address?.split(',')[1]?.trim() || 'Unknown',
            updated_at: s.history[s.history.length - 1]?.timestamp || s.createdAt
        }));

        res.json({
            success: true,
            shipments: formattedShipments
        });
    } catch (error) {
        console.error('Error fetching user shipments:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get ALL shipments (Admin)
// @route   GET /api/shipment/all
// @access  Private/Admin
exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({}).sort({ createdAt: -1 });
        res.json({ success: true, shipments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a shipment
// @route   POST /api/shipment
// @access  Private/Admin
exports.createShipment = async (req, res) => {
    try {
        const {
            orderId, trackingId, sender, receiver, currentStatus,
            currentLocation, estimatedDelivery, totalAmount, productDetails
        } = req.body;

        const shipment = await Shipment.create({
            orderId,
            trackingId,
            sender,
            receiver,
            currentStatus,
            currentLocation,
            estimatedDelivery,
            totalAmount,
            productDetails,
            owner: req.user._id, // Assign to admin or allow specifying owner? For now admin.
            history: [{
                status: currentStatus,
                location: currentLocation,
                description: 'Shipment created'
            }]
        });

        res.status(201).json({ success: true, shipment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Update shipment status/location
// @route   PUT /api/shipment/:id
// @access  Private/Admin
exports.updateShipment = async (req, res) => {
    try {
        const { status, location, description } = req.body;
        const shipment = await Shipment.findOne({ trackingId: req.params.id });

        if (shipment) {
            shipment.currentStatus = status || shipment.currentStatus;
            shipment.currentLocation = location || shipment.currentLocation;

            shipment.history.push({
                status: status || shipment.currentStatus,
                location: location || shipment.currentLocation,
                description: description || `Status updated to ${status}`
            });

            const updatedShipment = await shipment.save();
            res.json({ success: true, shipment: updatedShipment });
        } else {
            res.status(404).json({ success: false, message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
