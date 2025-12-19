const mongoose = require('mongoose');

// Force connection to local
mongoose.connect('mongodb://localhost:27017/logitrack', { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log('✅ Connected to Local MongoDB successfully.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Could not connect to Local MongoDB.');
        console.error('Error:', err.message);
        console.log('Ensure you have MongoDB installed and running locally on port 27017.');
        process.exit(1);
    });
