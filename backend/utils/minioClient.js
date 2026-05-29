const { Client } = require('minio');

const ENDPOINT = process.env.MINIO_ENDPOINT || 'minio';
const PORT = parseInt(process.env.MINIO_PORT) || 9000;
const ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin';
const USE_SSL = process.env.MINIO_USE_SSL === 'true';

const BUCKETS = {
    PRODUCTS: 'product-images',
    PROOFS: 'proof-of-delivery',
    RECEIPTS: 'receipts'
};

let minioClient = null;

if (process.env.MINIO_ENABLED !== 'false') {
    try {
        minioClient = new Client({
            endPoint: ENDPOINT,
            port: PORT,
            useSSL: USE_SSL,
            accessKey: ACCESS_KEY,
            secretKey: SECRET_KEY
        });
        console.log(JSON.stringify({
            level: 'info',
            message: 'Minio client initialized',
            endpoint: `${ENDPOINT}:${PORT}`
        }));
    } catch (err) {
        console.error(JSON.stringify({
            level: 'error',
            message: 'Failed to initialize Minio client',
            error: err.message
        }));
        minioClient = null;
    }
} else {
    console.log(JSON.stringify({
        level: 'info',
        message: 'Minio storage integration is disabled via environment variable'
    }));
}

async function ensureBucket(bucket) {
    if (!minioClient) return false;
    try {
        const exists = await minioClient.bucketExists(bucket);
        if (!exists) {
            await minioClient.makeBucket(bucket);
            console.log(JSON.stringify({
                level: 'info',
                message: `Bucket created: ${bucket}`
            }));
        }
        return true;
    } catch (err) {
        console.error(JSON.stringify({
            level: 'error',
            message: `Failed to ensure bucket: ${bucket}`,
            error: err.message
        }));
        return false;
    }
}

async function initBuckets(retries = 10, delay = 3000) {
    if (!minioClient) return false;

    for (let i = 0; i < retries; i++) {
        const allOk = await Promise.all(
            Object.values(BUCKETS).map(b => ensureBucket(b))
        );
        if (allOk.every(Boolean)) {
            console.log(JSON.stringify({
                level: 'info',
                message: 'All Minio buckets initialized',
                buckets: Object.values(BUCKETS)
            }));
            return true;
        }
        console.log(JSON.stringify({
            level: 'warn',
            message: `Minio not ready, retrying (${i + 1}/${retries})...`
        }));
        await new Promise(r => setTimeout(r, delay));
    }

    console.error(JSON.stringify({
        level: 'error',
        message: 'Failed to initialize Minio buckets after retries'
    }));
    return false;
}

async function uploadFile(bucket, objectName, stream, size, contentType) {
    if (!minioClient) {
        throw new Error('Minio client not initialized');
    }

    const etag = await minioClient.putObject(bucket, objectName, stream, size, { 'Content-Type': contentType });

    const publicUrl = process.env.MINIO_PUBLIC_URL || `http://localhost:${PORT}`;
    return {
        url: `${publicUrl}/${bucket}/${objectName}`,
        etag,
        bucket,
        objectName
    };
}

async function getPresignedUrl(bucket, objectName, expiry = 3600) {
    if (!minioClient) return null;
    try {
        return await minioClient.presignedUrl('GET', bucket, objectName, expiry);
    } catch (err) {
        console.error(JSON.stringify({
            level: 'error',
            message: 'Failed to generate presigned URL',
            error: err.message
        }));
        return null;
    }
}

async function deleteFile(bucket, objectName) {
    if (!minioClient) return false;
    try {
        await minioClient.removeObject(bucket, objectName);
        return true;
    } catch (err) {
        console.error(JSON.stringify({
            level: 'error',
            message: 'Failed to delete file from Minio',
            error: err.message
        }));
        return false;
    }
}

module.exports = {
    minioClient,
    BUCKETS,
    initBuckets,
    uploadFile,
    getPresignedUrl,
    deleteFile
};
