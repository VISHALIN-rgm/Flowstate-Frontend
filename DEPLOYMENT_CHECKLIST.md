# Flowstate Deployment Checklist

Your Flowstate app is ready to deploy! Follow these steps to get both frontend and backend live.

## ✅ Backend Status
- **Status**: ✅ DEPLOYED on Railway
- **URL**: `https://flowstate-backend-production.up.railway.app`
- **Health Check**: https://flowstate-backend-production.up.railway.app/health
- **WebSocket**: `wss://flowstate-backend-production.up.railway.app`

---

## 🚀 Frontend Deployment (Vercel)

### Step 1: Update Vercel Environment Variables
Your Vercel project is already connected to GitHub. Now add the backend URL:

1. Go to **Vercel Dashboard** → Your Flowstate project
2. Click **Settings** → **Environment Variables**
3. Add this variable:
   ```
   NEXT_PUBLIC_BACKEND_WS_URL = wss://flowstate-backend-production.up.railway.app
   ```
4. Make sure all Firebase variables are also set (they should be from your `.env.example`)

### Step 2: Deploy to Vercel
You have two options:

#### Option A: Deploy from Vercel Dashboard (Easiest)
1. Go to Vercel Dashboard → Flowstate project
2. Click the **Publish** button in the top right
3. Wait for build to complete (usually 2-3 minutes)

#### Option B: Push to GitHub (Auto-deploy)
1. Commit your changes:
   ```bash
   git add .
   git commit -m "Deploy: Add Railway backend URL"
   git push origin main
   ```
2. Vercel will automatically deploy on push
3. Check deployment progress in Vercel Dashboard

### Step 3: Verify Frontend Deployment
Once deployed, test:
1. Open your Vercel deployment URL (e.g., `https://flowstate-yourname.vercel.app`)
2. Try logging in
3. Create a new workspace
4. Test AI features (should connect to your Railway backend)

---

## 🔧 CORS Configuration (Already Done)

Your backend on Railway should have CORS configured to accept requests from:
- Your Vercel domain (e.g., `flowstate-yourname.vercel.app`)
- Local development (e.g., `localhost:3000`)

The backend `main.py` should have:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://flowstate-yourname.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

If your backend is not accepting requests, update the CORS origins in Railway environment variables.

---

## 📊 Testing Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] Login/signup works
- [ ] Can create a new workspace
- [ ] AI assistant connects (status shows "ai_ready")
- [ ] Microphone input works
- [ ] Canvas updates are sent to backend
- [ ] AI responses appear (speech + canvas updates)
- [ ] No console errors (check browser DevTools)

---

## 🐛 Troubleshooting

### AI Assistant Not Connecting?
1. **Check backend URL**: Open DevTools → Network → filter by "ws" → should see `wss://flowstate-backend-production.up.railway.app/ws/...`
2. **Check backend health**: Visit https://flowstate-backend-production.up.railway.app/health in your browser
3. **Check CORS**: Look for CORS errors in console. If present, update backend CORS settings in Railway.

### Gemini API Errors?
1. Make sure `GEMINI_API_KEY` is set in Railway environment variables
2. Check Railway logs for Gemini connection errors

### WebSocket Connection Refused?
1. Check if Railway backend is running: https://flowstate-backend-production.up.railway.app/health
2. Check if URL in `.env.local` matches your Railway URL
3. Verify CORS is configured for your Vercel domain

---

## 📝 Environment Variables Reference

### Vercel (Frontend)
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL
NEXT_PUBLIC_BACKEND_WS_URL = wss://flowstate-backend-production.up.railway.app
```

### Railway (Backend)
```
GEMINI_API_KEY (your actual API key)
ALLOWED_ORIGINS (for CORS, should include your Vercel domain)
```

---

## 🎉 Done!

Once all tests pass, your Flowstate app is live! Users can:
- Sign up with Firebase Auth
- Create workspaces
- Use AI to build flowcharts/diagrams
- See real-time canvas updates
- Hear AI audio responses

If you encounter any issues, check the backend logs in Railway dashboard or browser DevTools console.
