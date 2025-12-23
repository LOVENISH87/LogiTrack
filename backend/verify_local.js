require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to LOCAL MongoDB.');
    console.log('Searching for local@master.com...');
    const user = await User.findOne({ email: 'local@master.com' });

    if (user) {
        console.log('✅ LOCAL DB TEST SUCCESSFUL');
        console.log('User found in Local MongoDB:');
        console.log('Username:', user.username);
        console.log('Email:', user.email);
        console.log('Phone:', user.phone);
    } else {
        console.log('❌ User not found in Local DB.');
    }
    process.exit();
}).catch(err => { console.error(err); process.exit(1); });
