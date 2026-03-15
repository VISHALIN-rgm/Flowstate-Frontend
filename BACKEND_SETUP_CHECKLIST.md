# Backend Integration Checklist ✅

Complete step-by-step checklist to connect your frontend to your backend with API key authentication.

---

## 📋 Pre-Setup Requirements

- [ ] Backend repository: https://github.com/VISHALIN-rgm/Flowstate-Backend
- [ ] Gemini API key from: https://aistudio.google.com/app/apikey
- [ ] Python 3.10+
- [ ] Node.js 18+

---

## 🔧 Step 1: Backend Setup (5 minutes)

### 1.1 Clone Backend Repository

```bash
git clone https://github.com/VISHALIN-rgm/Flowstate-Backend.git
cd Flowstate-Backend
```

- [ ] Cloned successfully

### 1.2 Create Backend `.env` File

```bash
cp .env.example .env
```

Edit `.env`:

```env
GEMINI_API_KEY=your_key_from_aistudio.google.com
BACKEND_API_KEY=sk_dev_secure_key_12345
```

- [ ] GEMINI_API_KEY added (from https://aistudio.google.com/app/apikey)
- [ ] BACKEND_API_KEY created (e.g., `sk_dev_12345`)

### 1.3 Install Python Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate it
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

- [ ] Virtual environment created
- [ ] Dependencies installed

### 1.4 Run Backend Server

```bash
uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO  🚀 FlowState AI Backend starting…
INFO  ✅ GEMINI_API_KEY detected → AIza...xxxxx
INFO  Application startup complete.
INFO  Uvicorn running on http://127.0.0.1:8000
```

- [ ] Backend running at http://localhost:8000
- [ ] Swagger UI accessible at http://localhost:8000/docs
- [ ] GEMINI_API_KEY validated ✅

---

## 🎨 Step 2: Frontend Setup (3 minutes)

### 2.1 Frontend `.env.local` Configuration

In your **Flowstate-Frontend** project root, create `.env.local`:

```env
# Firebase Configuration (unchanged)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCUDwvNgc0oTsuxqWMYMeBmeSIrYyXFXTc"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="flowstate-312dc.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="flowstate-312dc"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="flowstate-312dc.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="551199643379"
NEXT_PUBLIC_FIREBASE_APP_ID="1:551199643379:web:dac2a7c3eb9acbd2874986"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-NEEDC8TK3D"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://console.firebase.google.com/u/0/project/flowstate-312dc/firestore/databases/-default-/data/~2FuserWorkspaces~2F1CodTvLu8PfNjPA3IiaRZ3jamt53"

# Backend Configuration (NEW)
NEXT_PUBLIC_BACKEND_WS_URL=ws://localhost:8000
NEXT_PUBLIC_BACKEND_REST_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_API_KEY=sk_dev_secure_key_12345
```

⚠️ **Important:** `NEXT_PUBLIC_BACKEND_API_KEY` must match `BACKEND_API_KEY` in backend `.env`

- [ ] `.env.local` created in frontend root
- [ ] All backend env vars configured
- [ ] API keys match between frontend and backend

### 2.2 Frontend Lib Files (Automatic)

These files have been created for you:

- ✅ `src/lib/backendAPI.ts` — Backend API client
- ✅ `src/hooks/useBackendAPI.ts` — React hook
- ✅ `src/components/BackendAPIExample.tsx` — Example component
- ✅ `.env.example` — Updated with backend vars

- [ ] Verified files exist in frontend

### 2.3 Start Frontend Dev Server

```bash
npm install  # If needed
npm run dev
```

Frontend should start at http://localhost:3000

- [ ] Frontend running at http://localhost:3000
- [ ] No build errors
- [ ] Environment variables loaded

---

## 🧪 Step 3: Test Integration (5 minutes)

### 3.1 Test Backend Health

```bash
curl -X GET http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "gemini_key_set": true,
  "model": "gemini-2.5-flash-native-audio-preview-12-2025"
}
```

- [ ] Backend health check passed

### 3.2 Test API with Authentication

```bash
curl -X GET http://localhost:8000/api/workspaces \
  -H "X-API-Key: sk_dev_secure_key_12345"
```

Expected: `[]` or list of workspaces (no 401 error)

- [ ] API key authentication working
- [ ] No 401 Unauthorized errors

### 3.3 Test WebSocket Connection

Open browser DevTools (F12) and navigate to a workspace with "With AI Assistance" mode:

1. Allow microphone permission
2. You should see `WebSocket` connection in Network tab
3. Check for frames tagged `0x01` (audio), `0x02` (canvas)

- [ ] WebSocket connects successfully
- [ ] Audio frames being sent
- [ ] No connection errors

### 3.4 Test Frontend API Hook

Visit http://localhost:3000 and open browser console, then run:

```javascript
// This requires the component to use useBackendAPI hook
// The hook is used in BackendAPIExample component if you add it to a page
```

Or create a simple test page:

```typescript
// app/test/page.tsx
"use client";
import BackendAPIExample from "@/components/BackendAPIExample";

export default function TestPage() {
  return <BackendAPIExample />;
}
```

Visit http://localhost:3000/test

- [ ] Example component loads
- [ ] Backend health shown as "ok"
- [ ] Can create/edit/delete workspaces

---

## 🚀 Step 4: Integration Points (Implementation)

### 4.1 Using Backend API in Your Components

**Option A: Direct Imports**

```typescript
import { getWorkspaces, updateWorkspace } from "@/lib/backendAPI";

async function myFunction() {
  const workspaces = await getWorkspaces();
  await updateWorkspace("id", { title: "New Title" });
}
```

- [ ] Imported API functions in a component
- [ ] Functions working without errors

**Option B: Using Hook** (Recommended)

```typescript
"use client";
import { useBackendAPI } from "@/hooks/useBackendAPI";

export function MyComponent() {
  const { getWorkspaces, updateWorkspace, loading, error } = useBackendAPI();
  
  // Use functions and state
}
```

- [ ] Used `useBackendAPI` hook in a component
- [ ] Loading and error states working

### 4.2 Save Workspace to Backend

In `src/app/workspace/[id]/ExcalidrawWrapper.tsx`, integrate workspace saving:

```typescript
import { updateWorkspace } from "@/lib/backendAPI";

// After AI adds a node
const handleAddNode = async (payload: AddNodePayload) => {
  // ... existing code ...
  
  // Optionally sync to backend
  try {
    if (workspaceId) {
      await updateWorkspace(workspaceId, {
        title: workspace.title,
        // Include elements/appState as needed
      });
    }
  } catch (error) {
    console.error("Failed to save to backend:", error);
  }
};
```

- [ ] Workspace auto-save to backend implemented
- [ ] No errors when saving

### 4.3 Export Functionality

```typescript
import { downloadExport } from "@/lib/backendAPI";

async function handleExport() {
  await downloadExport("workspace_id", "terraform");
  // File downloads automatically
}
```

- [ ] Export buttons added to workspace
- [ ] Files download correctly

---

## 📊 Step 5: Verify Everything Works

### 5.1 Full Workflow Test

1. Backend running at http://localhost:8000 ✅
2. Frontend running at http://localhost:3000 ✅
3. Can create workspace via backend API ✅
4. Can update workspace via backend API ✅
5. Can delete workspace via backend API ✅
6. Can export workspace (terraform/markdown/mermaid) ✅
7. WebSocket connects for AI session ✅
8. AI responds with voice and draws nodes ✅

- [ ] All workflow steps passing

### 5.2 Browser Console Check

Open browser console (F12 → Console) and verify:

```javascript
// No errors related to:
// - "BACKEND_WS_URL not defined"
// - "X-API-Key missing"
// - "CORS error"
// - "fetch failed"
```

- [ ] No console errors
- [ ] All API calls returning responses

### 5.3 Network Tab Inspection

Open browser DevTools → Network tab and verify:

- WebSocket connection to `ws://localhost:8000/ws/session/{id}`
- REST calls to `http://localhost:8000/api/workspaces/*`
- Headers include `X-API-Key: sk_dev_...`

- [ ] WebSocket connection visible
- [ ] REST requests with correct headers

---

## 📦 Step 6: Production Deployment (Optional)

### 6.1 Deploy Backend to Vercel

```bash
cd Flowstate-Backend
vercel deploy --prod
```

Note the deployment URL: `https://flowstate-api.vercel.app`

- [ ] Backend deployed to Vercel
- [ ] Production URL noted

### 6.2 Update Frontend Env Vars

In Vercel project settings, add:

```env
NEXT_PUBLIC_BACKEND_WS_URL=wss://flowstate-api.vercel.app
NEXT_PUBLIC_BACKEND_REST_URL=https://flowstate-api.vercel.app
NEXT_PUBLIC_BACKEND_API_KEY=sk_prod_secure_key_xyz
```

- [ ] Production env vars set in Vercel
- [ ] Switched from `ws://` to `wss://` (secure WebSocket)
- [ ] Switched from `http://` to `https://`

### 6.3 Deploy Frontend to Vercel

```bash
cd Flowstate-Frontend
vercel deploy --prod
```

- [ ] Frontend deployed to Vercel
- [ ] Both services using HTTPS

### 6.4 Test Production

Visit https://myapp.vercel.app and verify:

1. Can create/edit/delete workspaces
2. WebSocket connects (should be wss://)
3. AI session works
4. Export functionality works

- [ ] Production deployment verified

---

## 🔐 Security Checklist

- [ ] Backend `.env` file is in `.gitignore` (not committed)
- [ ] `BACKEND_API_KEY` is strong (at least 32 characters)
- [ ] Never commit `.env` or `.env.local` to GitHub
- [ ] Use different API keys for dev and prod
- [ ] For production, consider using OAuth or JWT instead of simple API key
- [ ] Enable CORS only for your domain
- [ ] Use HTTPS (wss://) in production
- [ ] Rate limit API endpoints (optional)

---

## 📚 Documentation Files

All documentation is in your frontend root:

- ✅ `BACKEND_QUICK_START.md` — 5-minute setup guide
- ✅ `BACKEND_INTEGRATION.md` — Comprehensive guide
- ✅ `API_REFERENCE.md` — Complete API documentation
- ✅ `BACKEND_SETUP_CHECKLIST.md` — This file

---

## 🆘 Troubleshooting

### "Connection refused" or "ECONNREFUSED"

**Problem:** Backend not running or wrong port

```bash
# Check if backend is running
curl http://localhost:8000/health

# If not running, start it
cd Flowstate-Backend
source venv/bin/activate  # or: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

- [ ] Backend now running

### "X-API-Key: Invalid" or 401 Unauthorized

**Problem:** API key mismatch

Check:
1. Backend `.env` has `BACKEND_API_KEY=sk_dev_12345`
2. Frontend `.env.local` has `NEXT_PUBLIC_BACKEND_API_KEY=sk_dev_12345`
3. They are **exactly the same**

- [ ] API keys match

### "CORS error" in browser

**Problem:** Frontend and backend not on localhost

For development, both should be on localhost:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

Backend is already configured for this.

- [ ] Running on correct localhost URLs

### "WebSocket stuck on connecting"

**Problem:** Gemini API key invalid or network issue

Check:
1. `GEMINI_API_KEY` is valid in backend `.env`
2. Get key from https://aistudio.google.com/app/apikey
3. Backend logs show `✅ GEMINI_API_KEY detected`

- [ ] GEMINI_API_KEY valid and loaded

---

## ✅ Completion Checklist

### Backend
- [ ] Backend repo cloned
- [ ] `.env` created with GEMINI_API_KEY and BACKEND_API_KEY
- [ ] Virtual environment created and activated
- [ ] Dependencies installed
- [ ] Backend running on port 8000
- [ ] Swagger UI accessible at http://localhost:8000/docs

### Frontend
- [ ] `.env.local` created with backend URLs and API key
- [ ] API client files exist in `src/lib/` and `src/hooks/`
- [ ] Frontend running on port 3000
- [ ] No build errors

### Integration
- [ ] Backend health check passes
- [ ] API key authentication works
- [ ] WebSocket connects for AI session
- [ ] Can create/update/delete workspaces
- [ ] Export functionality works
- [ ] No console errors

### Optional: Production
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Production env vars set
- [ ] Production deployment tested

---

## 🎉 You're Ready!

Your frontend is now fully connected to your backend with API key authentication.

### Next Steps

1. **Explore API:** Visit http://localhost:8000/docs to see all endpoints
2. **Test Components:** Use `BackendAPIExample.tsx` as a template
3. **Implement Features:** Integrate backend calls into your workspace components
4. **Deploy:** Follow Step 6 for production deployment

### Support

- Backend docs: https://github.com/VISHALIN-rgm/Flowstate-Backend
- Frontend issues: Check console errors (F12)
- API issues: Check `X-API-Key` header and CORS config

---

**Last Updated:** March 2026
**Status:** ✅ Complete
