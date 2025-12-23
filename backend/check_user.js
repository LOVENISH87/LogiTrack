require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to MongoDB. Checking for users...');

        // Find the user we just registered
        const user = await User.findOne({ email: 'mongo@test.com' });

        if (user) {
            console.log('✅ FOUND USER IN MONGO ATLAS!');
            console.log('--------------------------------------------------');
            console.log('ID:', user._id);
            console.log('Username:', user.username);
            console.log('Email:', user.email);
            console.log('Role:', user.role);
            console.log('Password Hash:', user.password); // Show that it's hashed
            console.log('--------------------------------------------------');
        } else {
            console.log('❌ User NOT found. Registration might have failed.');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
