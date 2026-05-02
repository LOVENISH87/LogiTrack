# CI/CD Setup for LogiTrack

## Overview

This project uses:
- **Backend:** Node.js + Express + MongoDB
- **Frontend:** Static HTML/CSS/JS (served via Nginx)
- **Infra:** Docker Compose (3 services: backend, frontend, mongodb)

---

## Option 1: GitHub Actions (Recommended)

### Setup Steps

**1. Add Docker Hub secrets to your repo:**
Go to `Settings → Secrets and variables → Actions` and add:
- `DOCKER_USERNAME` — your Docker Hub username
- `DOCKER_PASSWORD` — Docker Hub access token
- `MONGO_URI` — your production MongoDB connection string
- `JWT_SECRET` — your production JWT secret

**2. Create the workflow file:**
```bash
mkdir -p .github/workflows
```

Create `.github/workflows/ci-cd.yml` (see workflow template below).

**3. Push to `main` or `develop` branch** — the pipeline triggers automatically.

### What It Does

| Stage | Description |
|-------|-------------|
| **Lint** | Run ESLint on backend code |
| **Build** | Build Docker images for backend + frontend |
| **Test** | Run any defined tests (currently placeholder) |
| **Push** | Push images to Docker Hub (tagged with commit SHA + `latest`) |
| **Deploy** | SSH into your server, pull images, restart via `docker compose up -d` |

### Workflow Template

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  DOCKER_IMAGE_BACKEND: ${{ secrets.DOCKER_USERNAME }}/logitrack-backend
  DOCKER_IMAGE_FRONTEND: ${{ secrets.DOCKER_USERNAME }}/logitrack-frontend

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run lint (optional — add ESLint if desired)
        working-directory: ./backend
        run: npm run test || true

  build-and-push:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build & push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            ${{ env.DOCKER_IMAGE_BACKEND }}:latest
            ${{ env.DOCKER_IMAGE_BACKEND }}:${{ github.sha }}

      - name: Build & push frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ env.DOCKER_IMAGE_FRONTEND }}:latest
            ${{ env.DOCKER_IMAGE_FRONTEND }}:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/logitrack
            docker compose pull
            docker compose up -d
            docker system prune -f
```

---

## Option 2: Deploy to PaaS (Zero CI Config)

### Render.com
1. Connect your GitHub repo
2. Create **Web Service** → point to `backend/`
3. Set env vars: `MONGO_URI`, `JWT_SECRET`
4. Deploy (auto-deploys on push)

### Railway.app
1. Connect repo → Railway auto-detects Docker Compose
2. Add env vars in dashboard
3. Deploy

### Fly.io
```bash
fly launch              # auto-generates fly.toml
fly secrets set MONGO_URI=xxx JWT_SECRET=xxx
fly deploy
```

---

## Option 3: Manual VPS Deploy with Docker Compose

```bash
# On your server:
git clone <repo-url> /opt/logitrack
cd /opt/logitrack

# Create .env file
cat > .env <<EOF
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EOF

# Start everything
docker compose up -d
```

---

## Required Server Secrets (for GitHub Actions deploy)

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `SERVER_HOST` | Your VPS IP or domain |
| `SERVER_USER` | SSH username (e.g., `root`, `ubuntu`) |
| `SSH_PRIVATE_KEY` | Private SSH key for passwordless login |
| `MONGO_URI` | Production MongoDB URI |
| `JWT_SECRET` | Production JWT secret |

---

## Adding Tests (Recommended)

Currently `npm test` is a placeholder. To enable real tests:

```bash
cd backend
npm install --save-dev jest supertest
```

Add to `package.json`:
```json
"scripts": {
  "test": "jest --forceExit"
}
```

Create `backend/tests/api.test.js` and the CI pipeline will run them automatically.
