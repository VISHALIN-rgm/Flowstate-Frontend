# Railway Deployment Guide - Flowstate Backend

This guide covers deploying your **Python FastAPI backend** to Railway.

## Prerequisites

- Railway account (https://railway.app) — free tier available
- GitHub account with both repos connected
- Your `GEMINI_API_KEY` ready

---

## Step 1: Deploy Backend on Railway

### 1.1 Connect Backend Repository to Railway

1. Go to **https://railway.app** and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Search for and select **`VISHALIN-rgm/Flowstate-Backend`**
4. Click **"Create project"**

Railway will auto-detect that it's a Python project and set up the deployment.

### 1.2 Set Environment Variables on Railway

Railway needs your **GEMINI_API_KEY** to run:

1. In your Railway project dashboard, go to the **Flowstate-Backend** service
2. Click the **"Variables"** tab
3. Add the following environment variable:

   ```
   GEMINI_API_KEY = your_api_key_here
   ```

   Get your key at → https://aistudio.google.com/app/apikey

4. Click **"Save"** — Railway will automatically redeploy

### 1.3 Get Your Backend URL

After deployment succeeds:

1. In the Railway dashboard, go to the **Deployments** tab
2. Look for the green checkmark indicating a successful deployment
3. Copy your **public URL** — it will look like: `https://flowstate-backend-production.up.railway.app`
4. **Save this URL** — you'll use it in the next section

---

## Step 2: Deploy Frontend on Vercel

Your frontend is already connected to GitHub. Now you need to add the backend URL:

### 2.1 Add Backend URL to Vercel

1. Go to **https://vercel.com/dashboard**
2. Click on your **Flowstate** project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

   ```
   NEXT_PUBLIC_BACKEND_URL = https://flowstate-backend-production.up.railway.app
   ```

   (Replace with your actual Railway URL from Step 1.3)

5. Click **"Save and Redeploy"** — Vercel will redeploy with the new URL

### 2.2 Update Your Frontend Code (if needed)

Make sure your frontend uses this environment variable when making API calls:

```typescript
// Example: src/utils/api.ts or similar

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function fetchFromBackend(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return response.json();
}
```

---

## Step 3: Enable CORS (Critical!)

Your backend needs to accept requests from your Vercel frontend.

### 3.1 Update Backend CORS Configuration

In your backend (`main.py`), add CORS middleware:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://flowstate.vercel.app",  # Your Vercel domain (update with actual domain)
        os.getenv("CORS_ORIGIN", ""),  # From Railway env var
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your routes
```

### 3.2 Add CORS Origin to Railway

1. Go back to your Railway **Flowstate-Backend** service
2. Go to **Variables** tab
3. Add:

   ```
   CORS_ORIGIN = https://flowstate.vercel.app
   ```

   (Replace `flowstate` with your actual Vercel subdomain)

4. **Save** — Railway will redeploy

---

## Step 4: Update WebSocket Configuration

Your app uses WebSockets. Make sure the frontend connects to the correct Railway URL:

### 4.1 Check WebSocket Endpoint

In your frontend code (`useAISession.ts` or similar), update the WebSocket URL:

```typescript
// Example: hooks/useAISession.ts

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const wsUrl = backendUrl.replace('https://', 'wss://').replace('http://', 'ws://');

const ws = new WebSocket(`${wsUrl}/ws/session/${workspaceId}?mode=assisted`);
```

---

## Step 5: Test Your Deployment

### 5.1 Check Backend Health

Visit: `https://flowstate-backend-production.up.railway.app/health`

You should see: `{"status":"ok"}`

### 5.2 Check Swagger UI

Visit: `https://flowstate-backend-production.up.railway.app/docs`

This confirms your API is running.

### 5.3 Test Full App

1. Go to your Vercel URL: `https://flowstate.vercel.app` (or your domain)
2. Create a new workspace with "AI Assistance"
3. Allow microphone/screen sharing permissions
4. Speak to the AI — you should see it respond and draw nodes on your canvas

---

## Monitoring & Logs

### Railway Logs

To view real-time logs from your backend:

1. In Railway dashboard → **Flowstate-Backend** service
2. Click **"View Logs"** tab
3. Watch for:
   - ✅ `INFO Application startup complete` — server is running
   - ✅ `[SESSION] Gemini Live session open` — AI connection works
   - ❌ `GEMINI_API_KEY not set` — missing env var
   - ❌ `CORS error` — CORS not configured

### Vercel Analytics

1. Go to your Vercel project dashboard
2. **Analytics** tab shows request counts, response times, errors

---

## Environment Variables Summary

### Railway (Backend)

| Variable | Value | Required |
|----------|-------|----------|
| `GEMINI_API_KEY` | Your API key from aistudio.google.com | ✅ Yes |
| `CORS_ORIGIN` | Your Vercel domain (e.g., `https://flowstate.vercel.app`) | ✅ Yes |
| `PORT` | `8000` (Railway sets automatically) | Optional |

### Vercel (Frontend)

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Your Railway URL (e.g., `https://flowstate-backend-production.up.railway.app`) | ✅ Yes |

---

## Troubleshooting

### Issue: "Connection refused" when frontend tries to reach backend

**Solution:**
1. Check Railway deployment is green (successful)
2. Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly in Vercel
3. Make sure CORS is enabled in backend `main.py`
4. Check Railway logs for errors

### Issue: AI doesn't respond but page loads

**Solution:**
1. Verify `GEMINI_API_KEY` is set in Railway (not empty)
2. Check Railway logs: `View Logs` → search for "Gemini"
3. Confirm WebSocket URL is correct (should use `wss://` for HTTPS)

### Issue: CORS errors in browser console

**Solution:**
1. Add your Vercel URL to `CORS_ORIGIN` in Railway
2. Update the `allow_origins` list in `main.py`
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Microphone/Screen share blocked

**Solution:**
- Use HTTPS (both Vercel and Railway support it)
- Don't use IP addresses — use domain names only
- Use Chrome or Edge (Firefox has limited support)

---

## Next Steps

1. **Monitor your app** — Check logs daily for errors
2. **Set up Railway alerts** — Get notified if deployments fail
3. **Scale if needed** — Railway automatically scales as traffic increases
4. **Custom domain** — Connect a custom domain in Vercel settings

---

## Quick Reference

| Step | Command/Action | Status |
|------|---|---|
| Backend on Railway | Push to GitHub → Railway auto-deploys | ✅ Automated |
| Frontend on Vercel | Push to GitHub → Vercel auto-deploys | ✅ Automated |
| Env variables | Set in Railway + Vercel dashboards | ✅ Manual (one-time) |
| CORS setup | Update `main.py` and Railway env var | ✅ Manual |
| WebSocket config | Update frontend WebSocket URL | ✅ Manual |
| Test deployment | Visit `/health` and `/docs` endpoints | ✅ Manual |

**Estimated time to deployment: 10-15 minutes**
