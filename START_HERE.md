# 🎉 START HERE - Backend Integration Complete!

Welcome! Your frontend is now ready to connect to your backend. This file will guide you through what was set up and how to get started.

---

## 📦 What Was Done For You

### ✅ Backend Integration Complete

Your **Flowstate-Frontend** now has:

1. **3 New Code Files** (ready to use immediately)
   - `src/lib/backendAPI.ts` — Complete API client
   - `src/hooks/useBackendAPI.ts` — React hook for easy access
   - `src/components/BackendAPIExample.tsx` — Working example

2. **6 Comprehensive Guides** (pick based on your needs)
   - `BACKEND_QUICK_START.md` ← **START WITH THIS** (5 min read)
   - `BACKEND_INTEGRATION.md` — Full setup guide
   - `API_REFERENCE.md` — Complete API docs
   - `BACKEND_SETUP_CHECKLIST.md` — Step-by-step checklist
   - `README_BACKEND_INTEGRATION.md` — Overview
   - `IMPLEMENTATION_SUMMARY.md` — What was done
   - `QUICK_REFERENCE.md` — Handy quick reference

3. **Updated Configuration**
   - `.env.example` now includes backend URLs

### ✅ What Stayed the Same

- ✅ All your existing code (unchanged!)
- ✅ ExcalidrawWrapper component (no modifications)
- ✅ Firebase authentication (intact)
- ✅ WebSocket AI sessions (already working)
- ✅ All other functionality

---

## 🚀 3-Step Quick Start

### Step 1: Setup Backend (5 minutes)

```bash
git clone https://github.com/VISHALIN-rgm/Flowstate-Backend.git
cd Flowstate-Backend

# Create .env file
echo 'GEMINI_API_KEY=your_key_here
BACKEND_API_KEY=sk_dev_12345' > .env

# Install & run
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate (Windows)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

👉 Get your Gemini key here: https://aistudio.google.com/app/apikey

### Step 2: Setup Frontend (1 minute)

In your **Flowstate-Frontend** project, create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCUDwvNgc0oTsuxqWMYMeBmeSIrYyXFXTc"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="flowstate-312dc.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="flowstate-312dc"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="flowstate-312dc.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="551199643379"
NEXT_PUBLIC_FIREBASE_APP_ID="1:551199643379:web:dac2a7c3eb9acbd2874986"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-NEEDC8TK3D"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://..."

NEXT_PUBLIC_BACKEND_WS_URL=ws://localhost:8000
NEXT_PUBLIC_BACKEND_REST_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_API_KEY=sk_dev_12345
```

Then start frontend:
```bash
npm run dev
```

### Step 3: Test Everything (2 minutes)

```bash
# Terminal 1: Backend should be running on port 8000
curl http://localhost:8000/health
# Should return: {"status": "ok", ...}

# Terminal 2: Frontend should be running on port 3000
# Open http://localhost:3000 in browser

# Terminal 3: Test API
curl -H "X-API-Key: sk_dev_12345" http://localhost:8000/api/workspaces
# Should return: [] (empty list or workspaces)
```

✅ **Done!** Both services are now connected!

---

## 📖 Which Guide to Read?

| Need | Document | Time |
|------|----------|------|
| Get it running ASAP | **`BACKEND_QUICK_START.md`** | 5 min ⚡ |
| Understand everything | `BACKEND_INTEGRATION.md` | 15 min 📚 |
| Reference while coding | `QUICK_REFERENCE.md` | - 📌 |
| Complete API reference | `API_REFERENCE.md` | 10 min 📡 |
| Verify setup | `BACKEND_SETUP_CHECKLIST.md` | 10 min ✅ |
| High-level overview | `README_BACKEND_INTEGRATION.md` | 5 min 👀 |
| What was created | `IMPLEMENTATION_SUMMARY.md` | 5 min 📝 |

---

## 💻 How to Use the API

### Option 1: Direct Import (Simplest)

```typescript
import { createWorkspace, getWorkspaces } from "@/lib/backendAPI";

// Create a workspace
const workspace = await createWorkspace({
  title: "My Architecture",
  description: "Built with AI"
});

// Get all workspaces
const all = await getWorkspaces();
```

### Option 2: React Hook (Recommended)

```typescript
"use client";
import { useBackendAPI } from "@/hooks/useBackendAPI";

export function MyComponent() {
  const { createWorkspace, loading, error } = useBackendAPI();

  return (
    <div>
      <button 
        onClick={() => createWorkspace({ title: "New" })} 
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Workspace"}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
```

### Option 3: Full Example Component

Copy `BackendAPIExample.tsx` to see all features:
- Create workspaces
- List workspaces
- Update titles
- Delete workspaces
- Export to Terraform/Markdown/Mermaid

---

## 🔧 Available API Functions

```typescript
// Get all workspaces
getWorkspaces()

// Get single workspace
getWorkspace(id)

// Create workspace
createWorkspace({ title, description })

// Update workspace
updateWorkspace(id, { title, description })

// Delete workspace
deleteWorkspace(id)

// Export workspace
exportWorkspace(id, "terraform" | "markdown" | "mermaid")

// Download export as file
downloadExport(id, "terraform" | "markdown" | "mermaid")

// Check backend health
healthCheck()
```

---

## ✅ Verification Checklist

After setup, verify these are working:

- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] `curl http://localhost:8000/health` returns `"status": "ok"`
- [ ] `curl -H "X-API-Key: sk_dev_12345" http://localhost:8000/api/workspaces` returns `[]`
- [ ] Browser console (F12) shows no errors
- [ ] Network tab (F12) shows requests with `X-API-Key` header
- [ ] WebSocket connects when you start an AI session

---

## 🔐 Security Notes

### Development
- API key: Simple key like `sk_dev_12345`
- Location: In `.env.local` (not committed to git)
- Endpoints: Localhost only

### Production
- API key: Strong random string (32+ characters)
- Location: Vercel environment variables
- Endpoints: Use HTTPS/WSS (not HTTP/WS)
- Protocol: `https://` instead of `http://`, `wss://` instead of `ws://`

See `BACKEND_INTEGRATION.md` for security options (Bearer tokens, JWT, OAuth).

---

## 🚀 Example: Add Button to Save to Backend

```typescript
// In ExcalidrawWrapper.tsx or any component

import { updateWorkspace } from "@/lib/backendAPI";

async function handleSaveToBackend() {
  try {
    await updateWorkspace(workspaceId, {
      title: workspace.title,
      // You can also save elements and appState if needed
    });
    alert("✅ Saved to backend!");
  } catch (error) {
    alert(`❌ Save failed: ${error.message}`);
  }
}

// Use in a button
<button onClick={handleSaveToBackend}>Save to Backend</button>
```

---

## 📡 WebSocket Status

### Real-time AI Sessions (WebSocket)

✅ **Already working!** No changes needed.

Your `useAISession.ts` hook already connects via WebSocket:
```typescript
const BACKEND_WS = process.env.NEXT_PUBLIC_BACKEND_WS_URL ?? "ws://localhost:8000";
const wsUrl = `${BACKEND_WS}/ws/session/${workspaceId}?mode=assisted`;
```

When you start an AI session:
- 🎤 Browser sends mic audio
- 🖼️ Sends canvas screenshots
- 🤖 Gemini responds with voice
- ✏️ Backend draws nodes on canvas

---

## 🆘 Need Help?

### Common Issues

**"Connection refused"**
- Make sure backend is running on port 8000
- Test: `curl http://localhost:8000/health`

**"X-API-Key: Invalid" (401 error)**
- Check `.env` files match between frontend and backend
- Both must have same `BACKEND_API_KEY` value

**"CORS error"**
- Already configured for localhost:3000
- No action needed for development

**"WebSocket stuck on connecting"**
- Check `GEMINI_API_KEY` in backend `.env`
- Look at backend logs for errors

### Full Troubleshooting

See `BACKEND_SETUP_CHECKLIST.md` for complete troubleshooting guide.

---

## 📚 Documentation Structure

```
START_HERE.md (you are here) ← Overview & quick start
  ├─ BACKEND_QUICK_START.md ← Step-by-step setup
  ├─ BACKEND_INTEGRATION.md ← Full integration guide
  ├─ API_REFERENCE.md ← API documentation
  ├─ QUICK_REFERENCE.md ← Cheat sheet
  ├─ BACKEND_SETUP_CHECKLIST.md ← Verification
  ├─ README_BACKEND_INTEGRATION.md ← Architecture
  └─ IMPLEMENTATION_SUMMARY.md ← What was done
```

---

## 🎯 Next Steps

1. **Read** `BACKEND_QUICK_START.md` (5 minutes)
2. **Setup** backend and frontend (10 minutes)
3. **Test** with curl commands (2 minutes)
4. **Integrate** API in your components
5. **Deploy** to Vercel when ready

---

## 💡 Pro Tips

✨ Use the example component to learn:
```typescript
// In a page:
import BackendAPIExample from '@/components/BackendAPIExample';

export default function TestPage() {
  return <BackendAPIExample />;
}

// Visit the page to see all features working
```

✨ Keep `QUICK_REFERENCE.md` open while coding

✨ All environment variables are documented

✨ No existing code was modified - this is additive only

---

## 🎉 You're Ready!

Your frontend is fully configured to connect to your backend with API key authentication. 

**Start with `BACKEND_QUICK_START.md` and follow along!**

---

## Quick Links

- **Backend Repository:** https://github.com/VISHALIN-rgm/Flowstate-Backend
- **Frontend Repository:** https://github.com/VISHALIN-rgm/Flowstate-Frontend
- **Get Gemini Key:** https://aistudio.google.com/app/apikey
- **Backend Swagger UI:** http://localhost:8000/docs (when running)

---

**Status:** ✅ Complete and Ready
**Last Updated:** March 2026
**Questions?** Check the documentation files above

