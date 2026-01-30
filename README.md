# LogiTrack - Logistics Tracking System

A modern web application for tracking shipments and managing logistics operations. Built with HTML, CSS, JavaScript (frontend) and Node.js + Express + MongoDB (backend).

## Features

- User registration and authentication with email verification
- Real-time shipment tracking
- Search shipments by Tracking ID or Order ID
- User profile management (change username and password)
- Responsive design for all devices
- Secure session management
- Clean and modern UI

## Requirements

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Web server (optional for static hosting)
- Modern web browser

## Quick Start (local)

1. Clone the repository:
   ```bash
   git clone https://github.com/LOVENISH87/LogiTrack.git
   cd LogiTrack/backend
   ```

2. Create a .env in backend/ (or set env vars) with:
   ```
   MONGO_URI=<your_mongodb_connection_string>
   PORT=5000
   JWT_SECRET=<your_jwt_secret>
   ```

3. Install and run backend:
   ```bash
   npm install
   npm start
   ```

4. Open the frontend in a browser (static files are served from the backend at http://localhost:5000 if you use `express.static`), or open `frontend/index.html` directly while the API runs at http://localhost:5000/api

## Docker (backend)
Build and run using the included Dockerfile:
```bash
docker build -t logitrack-backend ./backend
docker run -e MONGO_URI=<your_mongo_uri> -e JWT_SECRET=<secret> -p 5000:5000 logitrack-backend
```

## Seeding data
From the backend directory you can run seed scripts:
```bash
node seedProducts.js
node seedAgents.js
```

## Notes
- The app uses MongoDB via Mongoose models in `backend/models/`.
- If you see any references to MySQL or PHP in this repo, they are outdated and will be removed in a future cleanup.
