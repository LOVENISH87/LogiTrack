const { uploadFile, BUCKETS } = require('../utils/minioClient');
const logger = require('../utils/logger');
const path = require('path');

const CATEGORY_MAP = {
    'product': BUCKETS.PRODUCTS,
    'proof': BUCKETS.PROOFS,
    'receipt': BUCKETS.RECEIPTS
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        const category = req.body.category || 'proof';
        const bucket = CATEGORY_MAP[category];

        if (!bucket) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Use: ${Object.keys(CATEGORY_MAP).join(', ')}`
            });
        }

        const ext = path.extname(req.file.originalname);
        const objectName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}${ext}`;

        const result = await uploadFile(
            bucket,
            objectName,
            req.file.buffer,
            req.file.buffer.length,
            req.file.mimetype
        );

        logger.info('File uploaded', {
            category,
            objectName,
            originalName: req.file.originalname,
            size: req.file.size,
            bucket
        });

        res.status(201).json({
            success: true,
            data: {
                url: result.url,
                objectName: result.objectName,
                bucket: result.bucket,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (err) {
        logger.error('File upload failed', {
            error: err.message,
            category: req.body.category
        });

        if (err.message === 'Minio client not initialized') {
            return res.status(503).json({
                success: false,
                message: 'File storage service unavailable'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: err.message
        });
    }
};
