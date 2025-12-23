const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/logitrac';

const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Jessica', 'Robert', 'Jennifer', 'William', 'Lisa', 'Joseph', 'Karen', 'Thomas', 'Nancy', 'Charles', 'Margaret', 'Christopher', 'Sandra'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const seedAgents = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const agents = [];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        for (let i = 0; i < 25; i++) {
            const firstName = getRandomItem(firstNames);
            const lastName = getRandomItem(lastNames);
            const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
            const email = `${username}@example.com`;

            agents.push({
                username: username,
                email: email,
                password: hashedPassword, // Pre-hashed for performance
                role: 'delivery_agent',
                rating: Math.floor(Math.random() * 5) + 1,
                ordersDelivered: Math.floor(Math.random() * 500)
            });
        }

        // Use insertMany for bulk insertion, bypasses pre-save but we pre-hashed
        await User.insertMany(agents);
        console.log('Successfully inserted 25 delivery agents!');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding agents:', error);
        process.exit(1);
    }
};

seedAgents();
