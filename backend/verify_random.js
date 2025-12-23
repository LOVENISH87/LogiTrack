require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Searching for random123@test.com...');
    const user = await User.findOne({ email: 'random123@test.com' });

    if (user) {
        console.log('✅ SUCCESS: Random user found in MongoDB!');
        console.log('-----------------------------------');
        console.log(`Username: ${user.username}`);
        console.log(`Email:    ${user.email}`);
        console.log(`Phone:    ${user.phone}`);
        console.log(`Role:     ${user.role}`);
        console.log('-----------------------------------');
    } else {
        console.log('❌ FAILURE: User not found in MongoDB.');
    }
    process.exit();
}).catch(err => { console.error(err); process.exit(1); });
