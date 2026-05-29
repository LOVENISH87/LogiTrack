const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./utils/logger');
const { initBuckets } = require('./utils/minioClient');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['https://logitrack-frontend-1ng4.onrender.com', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost', 'http://localhost:80'],
    credentials: true
}));
app.use(express.json());


// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/logitrack';
mongoose.connect(mongoURI)
    .then(() => {
        logger.info('MongoDB Connected');
    })
    .catch(err => {
        logger.error('MongoDB Connection Error', { error: err.message });
    });

// Routes
app.get('/', (req, res) => {
    res.send('LogiTrack API is running...');
});

const authRoutes = require('./routes/auth');
const shipmentRoutes = require('./routes/shipment');
const productRoutes = require('./routes/product');
const uploadRoutes = require('./routes/upload');

app.use('/api/auth', authRoutes);
app.use('/api/shipment', shipmentRoutes);
app.use('/api/products', productRoutes);
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
    logger.info('Server started', { port: PORT });

    initBuckets().then(ok => {
        if (ok) {
            logger.info('Minio storage ready');
        } else {
            logger.warn('Minio storage not available — uploads disabled');
        }
    });
});
