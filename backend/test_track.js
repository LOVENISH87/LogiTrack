const mongoose = require('mongoose');
const Shipment = require('./models/Shipment');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/logitrac';

async function test() {
    await mongoose.connect(MONGO_URI);
    const shipments = await Shipment.find({});
    console.log("Shipments in DB:", shipments.length);
    if(shipments.length > 0) {
        console.log("First shipment:", shipments[0].trackingId, shipments[0].orderId);
    }
    process.exit(0);
}
test();
