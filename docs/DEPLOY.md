# 🚢 Deploying TextForge AI

Free, production-grade hosting using:
- **Vercel** for the Next.js frontend
- **Railway** for the Express backend
- **MongoDB Atlas** for the database (already free)

Total cost: **$0/month** for low traffic.

---

## 1. Prepare for deploy

Before deploying, make sure your repo is pushed to GitHub and you have:

- ✅ `frontend/.env.local.example` and `backend/.env.example` filled in locally so the app runs on `localhost:3000`
- ✅ A working Gemini API key
- ✅ A working MongoDB Atlas connection string
- ✅ Your MongoDB Atlas Network Access set to allow `0.0.0.0/0` (Railway egress IPs are dynamic)

---

## 2. Deploy the backend to Railway

1. Sign in at [railway.app](https://railway.app) with GitHub
2. **New Project → Deploy from GitHub repo** → pick `textforge-ai`
3. After it creates the service, click **Settings**:
   - **Root Directory** → `backend`
   - **Build Command** → `npm install && npm run build`
   - **Start Command** → `npm start`
4. **Variables** tab — add these:

   ```
   GEMINI_API_KEY=<your key>
   GEMINI_MODEL=gemini-2.5-flash
   MONGODB_URI=mongodb+srv://...
   NODE_ENV=production
   CLIENT_URL=http://localhost:3000,https://YOUR-VERCEL-URL.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```
   _Note: `CLIENT_URL` is comma-separated — keep `localhost:3000` in there so you can develop against the deployed backend if you want._

5. **Settings → Networking → Generate Domain** → copy the public URL, e.g. `https://textforge-api.up.railway.app`
6. Visit `https://textforge-api.up.railway.app/health` — should return `{ "status": "ok", … }`

### ⚠️ Common Railway gotcha
If the build fails with "Cannot find module 'typescript'", make sure `typescript` is in `dependencies` (not `devDependencies`) of `backend/package.json`, OR change the build command to `npm install --include=dev && npm run build`.

---

## 3. Deploy the frontend to Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub
2. **Add New → Project** → pick `textforge-ai`
3. **Configure Project**:
   - **Framework Preset** → Next.js (auto-detected)
   - **Root Directory** → `frontend`
4. **Environment Variables** — add:

   ```
   NEXT_PUBLIC_API_URL=https://textforge-api.up.railway.app
   ```
5. (Optional, for auth) also add:

   ```
   NEXT_PUBLIC_AUTH_ENABLED=true
   AUTH_SECRET=<openssl rand -base64 32>
   AUTH_GOOGLE_ID=<google client id>
   AUTH_GOOGLE_SECRET=<google client secret>
   AUTH_GITHUB_ID=<github client id>
   AUTH_GITHUB_SECRET=<github client secret>
   NEXTAUTH_URL=https://YOUR-VERCEL-URL.vercel.app
   ```

6. **Deploy** → wait ~90 seconds → live at `https://textforge-ai.vercel.app`

---

## 4. Wire CORS

Once Vercel gives you a URL, go back to **Railway → Variables** and update:

```
CLIENT_URL=http://localhost:3000,https://textforge-ai.vercel.app
```

Railway will redeploy automatically.

---

## 5. Sanity-check the deployed app

Visit your Vercel URL and:

- ✅ Navigate to `/generate` — generate something
- ✅ Check `/history` — confirm it persisted to Mongo
- ✅ Check `/stats` — confirm aggregations work
- ✅ Click Share — open the share link in an incognito window — it should render
- ✅ Toggle dark/light mode — should persist

If generations show "Generation failed", check **Railway logs** — most often it's:
- Wrong `GEMINI_API_KEY` (rotate it at [aistudio.google.com](https://aistudio.google.com))
- Wrong MongoDB password in URI
- MongoDB Atlas Network Access not allowing `0.0.0.0/0`

---

## 6. Custom domain (optional)

- **Vercel** → Project → Domains → Add → point your DNS (CNAME → cname.vercel-dns.com)
- **Railway** → Service → Settings → Custom Domain → CNAME instructions provided

Then update `CLIENT_URL` and `NEXTAUTH_URL` (if using auth) accordingly.

---

## 7. Continuous deployment

Both Vercel and Railway redeploy on every push to `main` automatically.
For preview environments per branch: Vercel does this by default; Railway needs **Settings → Environments → Add Branch Environment**.

That's it — TextForge AI is live. 🔥
