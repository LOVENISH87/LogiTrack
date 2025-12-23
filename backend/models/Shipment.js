const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        unique: true
    },
    productDetails: {
        name: String,
        quantity: Number,
        price: Number,
        image: String
    },
    totalAmount: Number,
    isDefaultAddress: Boolean, // To match the functionality of filtering by default address
    sender: {
        name: String,
        address: String,
        phone: String
    },
    receiver: {
        name: String,
        address: String,
        phone: String
    },
    currentStatus: {
        type: String,
        enum: ['Order Placed', 'Processing', 'Shipped', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Order Placed'
    },
    currentLocation: {
        type: String, // City, State
        default: 'Pending'
    },
    estimatedDelivery: {
        type: Date
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    history: [{
        status: String,
        location: String,
        description: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
