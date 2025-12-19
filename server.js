const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files


// Database Connection
// Use the provided MONGO_URI from env or fallback to local
mongoose.connect('mongodb://127.0.0.1:27017/logitrack')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('LogiTrack API is running...');
});

const authRoutes = require('./routes/auth');
const shipmentRoutes = require('./routes/shipment');
const productRoutes = require('./routes/product');

app.use('/api/auth', authRoutes);
app.use('/api/shipment', shipmentRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
