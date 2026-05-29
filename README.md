# LogiTrack - Logistics Tracking System

LogiTrack is a modern, responsive, web-based logistics and shipment tracking platform built to bridge operational gaps between dispatch managers, delivery agents, and end-customers in real-time.

---

## 🚀 Key Features

* **Multi-Portal Role-Based Access Control (RBAC):**
  * **Administrator Dashboard:** Manage users, register shipments, track current status, and assign delivery agents.
  * **Delivery Agent Portal:** View assigned deliveries, monitor details, and transition transit status phases (*Picked Up, In Transit, Delivered, Cancelled*).
  * **Customer Dashboard:** Manage profiles, save delivery address books, and track orders.
* **Stateless Authentication:** Secure session management with JSON Web Tokens (JWT) and bcryptjs password hashing.
* **Real-Time Tracking Feed:** Public search option allowing anonymous lookup of shipments via tracking or order IDs, displaying a complete history of events, coordinates, and timestamp logs.
* **Automated CI/CD DevOps Pipeline:** Pre-configured Docker orchestration and multi-stage Jenkins pipelines for zero-downtime hot deployments.

---

## 🛠️ Tech Stack

* **Frontend:** Semantic HTML5, Vanilla CSS3, modern ES6 JavaScript (Fetch API, DOM manipulation).
* **Backend REST API:** Node.js, Express.js framework, JWT middleware, controllers.
* **Database:** MongoDB, Mongoose Object Data Modeling (ODM).
* **Containerization & DevOps:** Docker, Docker Compose, Jenkins pipelines.

---

## 📂 Project Structure

```
LogiTrack/
├── backend/
│   ├── config/             # DB configurations
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, Role guards, and Error middleware
│   ├── models/             # Mongoose schemas (User, Shipment, Product)
│   ├── routes/             # REST API routes
│   ├── seedProducts.js     # Product seeder script
│   ├── seedAgents.js       # Delivery agent seeder script
│   └── server.js           # Express app entry point
├── frontend/               # Static web client (HTML, CSS, JS)
├── Dockerfile              # Docker image configuration for Backend
├── docker-compose.yml      # Local multi-container development orchestration
├── Jenkinsfile             # Multi-stage Jenkins pipeline execution script
├── LogiTrack_Project_Report.docx     # Official generated university project report
└── LogiTrack_Project_Synopsis.docx   # Official generated university project synopsis
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory with the following keys:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/logitrack
JWT_SECRET=your_super_secret_jwt_sign_key_12345
```

---

## 💻 Setup & Run Locally

### 1. Traditional Node.js Setup
1. **Navigate to the Backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Seed Database (optional but recommended):**
   ```bash
   node seedProducts.js
   node seedAgents.js
   ```
4. **Run the server:**
   ```bash
   npm start
   ```
5. The API is hosted at `http://localhost:5000/api`. The static client frontend is served at `http://localhost:5000`.

---

## 🐳 Docker Orchestration

You can build and spin up the complete backend and database stack using Docker Compose.

### Local Development
To launch the Node.js API server and a local MongoDB instance:
```bash
docker-compose up --build
```
This runs the API on port `5000` and configures hot-reloading using volumes.

---

## 🎡 CI/CD Jenkins Pipeline

The project includes a robust pipeline defined in the `Jenkinsfile` for continuous integration. On every code push, Jenkins executes:
1. **Checkout:** Pulls the repository from GitHub.
2. **Install:** Installs npm modules and runs validation tests.
3. **Build:** Compiles a production-ready Docker image with the latest commit tag.
4. **Deploy:** Executes host server hooks to restart containers with zero-downtime.

---

## 📄 Academic Documentation
We have generated the official project documentations conforming directly to university formatting rules:
- **Project Report:** [LogiTrack_Project_Report.docx](LogiTrack_Project_Report.docx)
- **Project Synopsis:** [LogiTrack_Project_Synopsis.docx](LogiTrack_Project_Synopsis.docx)
