# 🔐 Authentication Setup

TextForge AI ships with **NextAuth v5 (Auth.js)** scaffolding for Google + GitHub sign-in. Auth is **disabled by default** — the app works fine anonymously. Turn it on when you want per-user history, favourites, and API keys.

---

## How it works

1. User clicks **Sign in** in the navbar → NextAuth handles the OAuth dance with Google or GitHub.
2. NextAuth issues a JWT session cookie containing the user's `id`.
3. The frontend reads the session via `/api/auth/session` and forwards `id` to the backend in the `x-user-id` HTTP header.
4. The Express backend scopes every query — history, favourites, stats, API keys — to that `userId`.

When auth is disabled, `x-user-id` is never sent and the backend treats all generations as a single anonymous bucket (legacy behaviour).

---

## Enabling auth

### 1. Generate a session secret

```bash
openssl rand -base64 32
```

Copy the output — you'll need it as `AUTH_SECRET`.

### 2. Create a Google OAuth app

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. **Create Credentials → OAuth client ID → Web application**
3. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR-VERCEL-URL.vercel.app/api/auth/callback/google` (when you deploy)
4. Copy **Client ID** and **Client secret**

### 3. Create a GitHub OAuth app

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**
2. **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. (After deploying, add a second OAuth app for the production URL)
4. Generate a client secret

### 4. Add env vars to `frontend/.env.local`

```env
NEXT_PUBLIC_AUTH_ENABLED=true
AUTH_SECRET=<paste from openssl>
AUTH_GOOGLE_ID=<google client id>
AUTH_GOOGLE_SECRET=<google client secret>
AUTH_GITHUB_ID=<github client id>
AUTH_GITHUB_SECRET=<github client secret>
NEXTAUTH_URL=http://localhost:3000
```

You don't need both providers — keep only the ones you've configured.

### 5. Restart the frontend

```bash
cd frontend
npm run dev
```

You should now see a **Sign in** button in the navbar.

---

## Production checklist

When deploying to Vercel:

- [ ] Set `NEXTAUTH_URL` to your production URL (e.g. `https://textforge-ai.vercel.app`)
- [ ] Add the production callback URL to your Google + GitHub OAuth apps
- [ ] Re-generate `AUTH_SECRET` for production (don't reuse local value)
- [ ] Set `NEXT_PUBLIC_AUTH_ENABLED=true` in Vercel env vars

---

## Troubleshooting

**"Sign in" button doesn't appear**
→ `NEXT_PUBLIC_AUTH_ENABLED` must equal exactly `true` (string).

**OAuth callback errors**
→ The redirect URI in Google/GitHub must match the URL the user is on, including http vs https.

**History loads as empty after signing in**
→ Existing pre-auth generations don't have a `userId`. Either delete them or open a Mongo shell and add `userId: "<your id>"` to existing docs.
