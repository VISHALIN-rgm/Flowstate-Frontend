# Flowstate Frontend & Backend Deployment Guide

This guide covers deploying your **Next.js frontend to Vercel** and **backend to Railway**.

---

## Part 1: Deploy Frontend to Vercel

### Step 1: Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repo: **VISHALIN-rgm/Flowstate-Frontend**
4. Click **"Import"**

### Step 2: Configure Environment Variables
In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.up.railway.app
```

> **Note:** Get these values from your Firebase console. The `NEXT_PUBLIC_BACKEND_URL` will be set after deploying your backend.

### Step 3: Deploy
1. Click **"Deploy"**
2. Vercel will automatically:
   - Build your Next.js app
   - Run `npm run build`
   - Deploy to a live URL

Your frontend will be live at: `https://flowstate.vercel.app` (or your custom domain)

---

## Part 2: Deploy Backend to Railway

### Step 1: Prepare Your Backend Repository

**Option A: If backend is in separate repo**
1. Create a new GitHub repo for your backend code
2. Push your backend code there
3. Ensure it has a `package.json` with a start script, or `requirements.txt` for Python

**Option B: If backend is in a subfolder**
Create a `railway.json` in your project root:
```json
{
  "build": {
    "builder": "nixpacks"
  }
}
```

### Step 2: Sign Up & Connect Railway
1. Go to [Railway.app](https://railway.app)
2. Click **"Start New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize Railway to access your GitHub
5. Select your backend repository

### Step 3: Configure Environment Variables in Railway
1. In Railway dashboard, open your project
2. Go to **Variables**
3. Add all backend environment variables:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=your_database_url
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_key
CORS_ORIGIN=https://your-vercel-url.vercel.app
```

### Step 4: Configure Deployment Settings
1. Go to **Settings** → **Build & Deploy**
2. Set **Start Command** (if not auto-detected):
   - **Node.js:** `npm start` or `node server.js`
   - **Python:** `python app.py` or `gunicorn app:app`

### Step 5: Deploy
1. Click **"Deploy"**
2. Railway will auto-detect your framework and deploy

Your backend URL will be: `https://your-app-name.up.railway.app`

---

## Part 3: Connect Frontend to Backend

### Update Vercel Environment Variables
Once your Railway backend is live:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_BACKEND_URL` with your Railway URL:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-app-name.up.railway.app
   ```
3. Click **"Redeploy"** to rebuild with the new URL

### Update Your Frontend Code
In your API routes or fetch calls, use the backend URL:

```typescript
// Example in your frontend
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const response = await fetch(`${backendUrl}/api/endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

---

## Part 4: Configure CORS (Critical!)

### In Your Backend (Node.js/Express Example)
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
```

### In Your Backend (Python/FastAPI Example)
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv('CORS_ORIGIN', 'http://localhost:3000')],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Part 5: Verification & Testing

### Test Frontend
```bash
curl https://your-app-name.vercel.app
```

### Test Backend
```bash
curl https://your-app-name.up.railway.app/api/health
```

### Check Logs
- **Vercel:** Dashboard → Deployments → View Logs
- **Railway:** Dashboard → Logs

---

## Troubleshooting

### Frontend build fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Backend not connecting
- Check `NEXT_PUBLIC_BACKEND_URL` is correct
- Verify CORS is enabled in backend
- Check Railway logs for errors
- Test backend URL directly in browser

### Database connection fails
- Verify `DATABASE_URL` is correct in Railway variables
- Check database is accessible from Railway's servers
- Use connection pooling for production

### 502 Bad Gateway Error
- Backend might be crashing on startup
- Check Railway logs for error messages
- Ensure PORT environment variable is set

---

## Quick Reference

| Component | Hosting | URL |
|-----------|---------|-----|
| Frontend | Vercel | https://flowstate.vercel.app |
| Backend | Railway | https://your-app.up.railway.app |
| Database | Railway/External | Set in `DATABASE_URL` |

---

## Next Steps After Deployment

1. Set up custom domains for both services
2. Enable analytics in Vercel & Railway
3. Set up monitoring/error tracking (Sentry, LogRocket)
4. Configure CI/CD pipelines
5. Set up automated backups for your database
