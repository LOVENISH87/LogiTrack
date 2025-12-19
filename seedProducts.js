const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/logitrac';

const products = [
    {
        name: 'LogiTrack Premium Box',
        description: 'High-quality cardboard box for safe shipping. Dimensions: 12x12x12 inches.',
        price: 5.99,
        image: 'logishop/box.png',
        category: 'Packaging'
    },
    {
        name: 'Bubble Wrap Roll (50ft)',
        description: 'Protective bubble wrap for fragile items. 50 feet length.',
        price: 12.50,
        image: 'logishop/bubblewrap.png',
        category: 'Packaging'
    },
    {
        name: 'Heavy Duty Tape',
        description: 'Strong adhesive tape for securing boxes.',
        price: 3.99,
        image: 'logishop/tape.png',
        category: 'Packaging'
    },
    {
        name: 'Label Printer',
        description: 'Portable Bluetooth label printer for shipping labels.',
        price: 89.99,
        image: 'logishop/printer.png',
        category: 'Hardware'
    },
    {
        name: 'Digital Scale',
        description: 'Precision digital scale for weighing packages up to 50lbs.',
        price: 24.99,
        image: 'logishop/scale.png',
        category: 'Hardware'
    },
    {
        name: 'LogiTrack Cap',
        description: 'Branded LogiTrack cap. 100% Cotton.',
        price: 15.00,
        image: 'logishop/cap.png',
        category: 'Merchandise'
    },
    {
        name: 'LogiTrack T-Shirt',
        description: 'Comfortable branded t-shirt. Available in M, L, XL.',
        price: 20.00,
        image: 'logishop/tshirt.png',
        category: 'Merchandise'
    },
    {
        name: 'Shipping Pallet',
        description: 'Standard wooden pallet for bulk shipping.',
        price: 45.00,
        image: 'logishop/pallet.png',
        category: 'Industrial'
    },
    {
        name: 'Wireless Barcode Scanner',
        description: 'Ergonomic handheld scanner for quick inventory checks.',
        price: 49.99,
        image: 'logishop/scanner.png',
        category: 'Hardware'
    },
    {
        name: 'Pro Utility Knife',
        description: 'Heavy duty box cutter with safety lock mechanism.',
        price: 8.50,
        image: 'logishop/cutter.png',
        category: 'Tools'
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({}); // Clear existing products
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log('Successfully inserted products!');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
