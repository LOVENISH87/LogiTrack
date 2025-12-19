const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/logitrack')
    .then(async () => {
        console.log('Connected to DB');

        const email = process.argv[2];
        if (!email) {
            console.log('Please provide an email: node make_admin.js user@example.com');
            process.exit(1);
        }

        const user = await User.findOne({ email });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${user.username} (${user.email}) is now an ADMIN.`);
        } else {
            console.log('User not found.');
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
