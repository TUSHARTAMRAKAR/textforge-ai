# TextForge AI — Setup Guide

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | any | `git --version` |
| MongoDB Atlas account | free | [mongodb.com/atlas](https://mongodb.com/atlas) |
| Anthropic API key | — | [console.anthropic.com](https://console.anthropic.com) |

---

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/textforge-ai.git
cd textforge-ai
```

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)
- `MONGODB_URI` — from your MongoDB Atlas cluster → Connect → Drivers

```bash
npm run dev
```

Server starts at `http://localhost:5000`
Verify: `http://localhost:5000/health`

---

## 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
```

App starts at `http://localhost:3000`

---

## 4. MongoDB Atlas setup (free tier)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Under **Database Access** → Add a user with read/write
4. Under **Network Access** → Add `0.0.0.0/0` (allow all IPs for dev)
5. Under **Connect** → Drivers → Copy the URI
6. Paste it into your `.env` as `MONGODB_URI`

---

## Available Scripts

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
