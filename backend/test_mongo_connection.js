require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log('Testing connection to:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB Connection Successful!');
    console.log('The database is reachable and ready to use.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.log('Please check if your IP is whitelisted in MongoDB Atlas or if the credentials are correct.');
    process.exit(1);
  });
