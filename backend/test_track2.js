const mongoose = require('mongoose');
const Shipment = require('./models/Shipment');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/logitrac';

async function test() {
    await mongoose.connect(MONGO_URI);
    const shipments = await Shipment.find({});
    if(shipments.length > 0) {
        console.log(JSON.stringify(shipments[0], null, 2));
    }
    process.exit(0);
}
test();
