# Integration Guide: Monitoring, Logging & File Storage

This document explains how Prometheus + Grafana, Loki + Promtail, and Minio were integrated into LogiTrack. It covers what was changed, why, and how to extend it further.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prometheus + Grafana — Metrics & Dashboards](#1-prometheus--grafana)
3. [Loki + Promtail — Centralized Logging](#2-loki--promtail)
4. [Minio — S3-Compatible Object Storage](#3-minio)
5. [How to Verify Everything Works](#how-to-verify)
6. [How to Extend](#how-to-extend)

---

## Architecture Overview

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Nginx   │     │ Backend  │     │ MongoDB  │
│  :80     │────▶│  :5000   │◀───▶│  :27017  │
└──────────┘     └────┬─────┘     └──────────┘
                      │
              ┌───────┼───────────────┐
              ▼       ▼               ▼
         ┌────────┐ ┌──────┐ ┌───────────┐
         │Minio   │ │Prom  │ │ Promtail  │
         │:9000   │ │:9090 │ │  (logs)   │
         └────────┘ └──┬───┘ └─────┬─────┘
                       │           │
                       ▼           ▼
                  ┌────────┐ ┌──────────┐
                  │Grafana │ │  Loki    │
                  │:3000   │◀│  :3100   │
                  └────────┘ └──────────┘
```

- **Backend** exposes `/metrics` endpoint (Prometheus format) and logs structured JSON to stdout
- **Prometheus** scrapes the backend every 15s
- **Grafana** queries Prometheus (metrics) and Loki (logs) — all in one dashboard
- **Promtail** reads Docker container logs and ships them to Loki
- **Minio** stores files (POD images, product photos, receipts); backend uploads via API

---

## 1. Prometheus + Grafana

### New Files Created

| File | Purpose |
|------|---------|
| `backend/middleware/metrics.js` | Prometheus metric definitions + middleware |
| `infra/prometheus/prometheus.yml` | Prometheus scrape config |
| `infra/grafana/datasources/datasource.yml` | Auto-provisions Prometheus + Loki in Grafana |

### What the Metrics Middleware Tracks

Defined in `backend/middleware/metrics.js`:

| Metric | Type | Labels | What it shows |
|--------|------|--------|---------------|
| `http_requests_total` | Counter | method, route, status | Request count per endpoint |
| `http_request_duration_seconds` | Histogram | method, route, status | Latency percentiles (p50, p95, p99) |
| `http_requests_active` | Gauge | method | Currently in-flight requests |
| `mongodb_connected` | Gauge | (none) | 1 if DB connected, 0 if not |
| _(default metrics)_ | various | — | CPU, memory, event loop lag, GC |

It also collects Node.js default metrics (CPU, memory, event loop lag) via `prom-client`'s `collectDefaultMetrics()`.

### How It Connects

1. `backend/server.js` registers `metricsMiddleware` globally — every request is timed and counted
2. The `/metrics` endpoint returns Prometheus-formatted text
3. `infra/prometheus/prometheus.yml` tells Prometheus to scrape `backend:5000/metrics` every 15s
4. Grafana auto-connects to Prometheus via the provisioned datasource

### What You Can Do in Grafana

Open `http://localhost:3000` (admin/admin). From there:

- **Explore** tab → query `http_requests_total{route="/api/auth/login"}` to see login traffic
- **Dashboards** → import Node.js community dashboard (ID: 14568) for out-of-box views
- **Alerts** → set up alert rules (e.g., "error rate > 5% for 5 minutes")

---

## 2. Loki + Promtail

### New Files Created

| File | Purpose |
|------|---------|
| `infra/promtail/promtail-config.yml` | Promtail scrape config — reads Docker logs |
| `backend/utils/logger.js` | Structured JSON logger utility |

### What Changed in the Backend

Every `console.log` / `console.error` was replaced with `logger.info` / `logger.error` which outputs JSON like:

```json
{"timestamp":"2026-05-27T12:00:00.000Z","level":"info","message":"Server started","port":5000}
```

Promtail runs alongside every container and:
1. Reads each container's stdout/stderr via the Docker socket
2. Adds labels: `container`, `service`, `project`
3. Parses JSON log lines and extracts the `level` field as a label
4. Ships to Loki at `http://loki:3100`

### Searching Logs in Grafana

Open Grafana **Explore** tab, switch datasource to **Loki**, and try:

```
{service="logitrack-backend"} |= "error"
{service="logitrack-backend"} |= "MongoDB"
{container="logitrack-frontend"}
```

### Log Levels

Set `LOG_LEVEL` env var to control verbosity: `error`, `warn`, `info` (default), `debug`.

---

## 3. Minio

### New Files Created

| File | Purpose |
|------|---------|
| `backend/utils/minioClient.js` | Minio client + bucket management |
| `backend/controllers/uploadController.js` | File upload handler |
| `backend/routes/upload.js` | POST `/api/upload` route with multer |

### What Changed in the Backend

`backend/server.js` now:
- Imports and initializes Minio buckets on startup (with retry — waits for Minio to be ready)
- Registers `POST /api/upload` (auth-protected)

**`backend/utils/minioClient.js`** handles:
- Creating a Minio client from env vars
- Auto-creating 3 buckets on startup:
  - `product-images`
  - `proof-of-delivery`
  - `receipts`
- Uploading files with `uploadFile(bucket, name, stream, size, contentType)`
- Generating presigned URLs with `getPresignedUrl(bucket, name, expiry)`
- Deleting files with `deleteFile(bucket, name)`

### API Endpoint

**`POST /api/upload`** (requires JWT token in `Authorization` header)

Body: `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `file` | file | The file to upload (max 10MB) |
| `category` | string | `product`, `proof`, or `receipt` |

Response:
```json
{
  "success": true,
  "data": {
    "url": "http://localhost:9000/product-images/123456789-abc.jpg",
    "objectName": "123456789-abc.jpg",
    "bucket": "product-images",
    "originalName": "photo.jpg",
    "size": 54321,
    "mimetype": "image/jpeg"
  }
}
```

### Using Uploads in Shipments

The `productDetails.image` field in the Shipment model already exists for storing product images. After uploading via `/api/upload`, save the returned URL:

```
POST /api/shipment
{
  "productDetails": {
    "name": "Smartphone",
    "image": "http://localhost:9000/product-images/xxx.jpg"
  },
  ...
}
```

For Proof of Delivery (POD), you can extend the Shipment model or history events to store document URLs.

### Minio Console

Access Minio's web UI at `http://localhost:9001` (minioadmin / minioadmin). Browse buckets, upload/download files manually.

---

## How to Verify

### Start everything

```bash
docker compose up -d --build
```

### Check all containers are running

```bash
docker compose ps
```

Expected output:
```
logitrack-backend    Up
logitrack-frontend   Up
logitrack-db         Up
logitrack-prometheus Up
logitrack-grafana    Up
logitrack-loki       Up
logitrack-promtail   Up
logitrack-minio      Up
```

### Verify Prometheus metrics

```bash
curl http://localhost:5000/metrics | head -30
```

You should see `http_requests_total`, `http_request_duration_seconds`, etc.

### Verify Prometheus is scraping

Open `http://localhost:9090/targets` — the `logitrack-backend` target should be UP.

### Verify Minio is accessible

```bash
curl -I http://localhost:9000/minio/health/live
```

Should return `200 OK`.

### Verify Grafana

Open `http://localhost:3000` — login with admin/admin. The Prometheus and Loki datasources should be pre-configured.

### Verify file upload

```bash
# Create a test file
echo "hello" > /tmp/test.txt

# Get a token (register/login first)
TOKEN="<your-jwt-token>"

# Upload
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test.txt" \
  -F "category=proof"
```

---

## How to Extend

### Add More Metrics

In `backend/middleware/metrics.js`, add new counters/gauges:

```javascript
const dbQueryDuration = new client.Histogram({
    name: 'mongodb_query_duration_seconds',
    help: 'MongoDB query duration',
    labelNames: ['collection', 'operation'],
    buckets: [0.01, 0.05, 0.1, 0.5],
    registers: [register]
});
```

Wrap DB calls with `dbQueryDuration.labels('shipments', 'find').observe(duration)`.

### Pre-Built Grafana Dashboard

Import dashboard ID **14568** (Node.js Application Dashboard) in Grafana for an out-of-box view with CPU, memory, request rate, and latency charts.

### S3-Compatible Cloud Storage

In production, swap Minio for AWS S3, DigitalOcean Spaces, or any S3-compatible provider. The `@aws-sdk/client-s3` package uses the same API — just update `minioClient.js` or create an abstraction layer.

### Alerting Rules

Set up in Grafana:
- **Error rate spike:** `rate(http_requests_total{status=~"5.."}[5m]) > 0.05`
- **High latency:** `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2`
- **MongoDB down:** `mongodb_connected == 0`

### Tracing (Future)

Add OpenTelemetry to the backend for distributed tracing across the request lifecycle. Grafana Tempo can ingest traces and correlate them with Loki logs and Prometheus metrics.

---

## File Reference

All changes summarized:

```
LogiTrack/
├── backend/
│   ├── controllers/
│   │   └── uploadController.js      ← NEW — handles file uploads
│   ├── middleware/
│   │   └── metrics.js                ← NEW — Prometheus metrics
│   ├── routes/
│   │   └── upload.js                 ← NEW — POST /api/upload
│   ├── utils/
│   │   ├── minioClient.js            ← NEW — Minio client + bucket init
│   │   └── logger.js                 ← NEW — structured JSON logger
│   ├── server.js                     ← MODIFIED — added metrics, uploads, Minio init
│   ├── Dockerfile                    ← MODIFIED — added utils/ copy
│   └── package.json                  ← MODIFIED — added prom-client, minio, multer
├── infra/
│   ├── prometheus/
│   │   └── prometheus.yml            ← NEW — scrape config
│   ├── promtail/
│   │   └── promtail-config.yml       ← NEW — Docker log scraping
│   └── grafana/
│       └── datasources/
│           └── datasource.yml        ← NEW — auto-provision Prometheus + Loki
├── docker-compose.yml                ← MODIFIED — added 5 new services
└── integration-guide.md              ← ← THIS FILE
```
