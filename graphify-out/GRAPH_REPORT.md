# Graph Report - LogiTrack  (2026-05-21)

## Corpus Check
- 35 files · ~347,883 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 171 nodes · 146 edges · 32 communities (30 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5624b0a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `CI/CD Setup for LogiTrack` - 7 edges
2. `LogiTrack - Logistics Tracking System` - 7 edges
3. `LogiStore E-Commerce Integration` - 6 edges
4. `scripts` - 4 edges
5. `Option 1: GitHub Actions (Recommended)` - 4 edges
6. `Option 2: Deploy to PaaS (Zero CI Config)` - 4 edges
7. `Key Features` - 4 edges
8. `Quick Start (local)` - 4 edges
9. `repository` - 3 edges
10. `repository` - 3 edges

## Surprising Connections (you probably didn't know these)
- `test()` --calls--> `checkPasswordStrength()`  [INFERRED]
  backend/test_track.js → frontend/js/app.js

## Communities (32 total, 2 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.83
Nodes (3): displayShipments(), loadShipments(), searchShipments()

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (7): bcrypt, firstNames, getRandomItem(), lastNames, mongoose, seedAgents(), User

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (6): mongoose, Product, products, Product, mongoose, ProductSchema

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (7): jwt, User, jwt, User, bcrypt, mongoose, UserSchema

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (20): author, bugs, url, description, devDependencies, nodemon, homepage, keywords (+12 more)

### Community 21 - "Community 21"
Cohesion: 0.11
Nodes (18): author, bugs, url, description, devDependencies, nodemon, homepage, keywords (+10 more)

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (6): formattedResponse, formattedShipments, query, Shipment, mongoose, ShipmentSchema

### Community 23 - "Community 23"
Cohesion: 0.14
Nodes (13): Adding Tests (Recommended), CI/CD Setup for LogiTrack, code:bash (fly launch              # auto-generates fly.toml), code:bash (# On your server:), code:bash (cd backend), code:json ("scripts": {), Fly.io, Option 2: Deploy to PaaS (Zero CI Config) (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.15
Nodes (12): code:bash (git clone https://github.com/LOVENISH87/LogiTrack.git), code:block2 (MONGO_URI=<your_mongodb_connection_string>), code:bash (npm install), code:bash (docker build -t logitrack-backend ./backend), code:bash (node seedProducts.js), Docker (backend), Features, LogiTrack - Logistics Tracking System (+4 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (10): 1. LogiStore Shop (`shop.html`), 2. Backend Architecture, 3. Data Management, code:bash (npm start), Files Created/Modified, How to Test, Key Features, LogiStore E-Commerce Integration (+2 more)

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, mongodb, mongoose (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (8): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose, ogl

### Community 30 - "Community 30"
Cohesion: 0.33
Nodes (6): code:bash (mkdir -p .github/workflows), code:yaml (name: CI/CD Pipeline), Option 1: GitHub Actions (Recommended), Setup Steps, What It Does, Workflow Template

## Knowledge Gaps
- **96 isolated node(s):** `disabledMcpjsonServers`, `name`, `version`, `description`, `main` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 28` to `Community 8`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 29` to `Community 21`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `CI/CD Setup for LogiTrack` connect `Community 23` to `Community 30`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `disabledMcpjsonServers`, `name`, `version` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Community 21` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 23` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._