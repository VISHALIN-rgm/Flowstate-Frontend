# Backend Integration - Quick Start (5 minutes)

## TL;DR

Your frontend (Next.js) communicates with your backend (FastAPI) via:
1. **WebSocket** (`ws://localhost:8000`) for real-time AI sessions — **Already working ✅**
2. **REST API** (`http://localhost:8000/api/*`) for workspace management — **Ready to use 🚀**

---

## Step 1: Setup Backend (2 minutes)

```bash
# Clone backend
git clone https://github.com/VISHALIN-rgm/Flowstate-Backend.git
cd Flowstate-Backend

# Create .env
echo 'GEMINI_API_KEY=your_key_from_aistudio.google.com
BACKEND_API_KEY=sk_dev_12345' > .env

# Install & run
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate (Windows)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

✅ Backend ready at: http://localhost:8000/docs

---

## Step 2: Setup Frontend (1 minute)

Create `.env.local` in your Next.js project:

```env
# Firebase (unchanged)
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
NEXT_PUBLIC_BACKEND_API_KEY=sk_dev_12345
```

---

## Step 3: Use Backend API (2 minutes)

### Option A: Direct API Calls

```typescript
import { getWorkspaces, createWorkspace, updateWorkspace } from "@/lib/backendAPI";

// Get all workspaces
const workspaces = await getWorkspaces();

// Create workspace
const newWorkspace = await createWorkspace({
  title: "My Architecture",
  description: "AI-powered diagram",
});

// Update workspace
await updateWorkspace(workspace.id, {
  title: "Updated Title",
});

// Export as Terraform
await downloadExport(workspace.id, "terraform");
```

### Option B: Using Hook (Recommended)

```typescript
"use client";
import { useBackendAPI } from "@/hooks/useBackendAPI";

export function MyComponent() {
  const { getWorkspaces, createWorkspace, loading, error } = useBackendAPI();

  async function handleCreate() {
    try {
      const ws = await createWorkspace({ title: "New Workspace" });
      console.log("Created:", ws.id);
    } catch (err) {
      console.error("Failed:", err);
    }
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Workspace"}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
```

---

## Available Endpoints

| Function | Method | Endpoint |
|----------|--------|----------|
| `getWorkspaces()` | GET | `/api/workspaces` |
| `getWorkspace(id)` | GET | `/api/workspaces/{id}` |
| `createWorkspace(data)` | POST | `/api/workspaces` |
| `updateWorkspace(id, data)` | PUT | `/api/workspaces/{id}` |
| `deleteWorkspace(id)` | DELETE | `/api/workspaces/{id}` |
| `exportWorkspace(id, format)` | POST | `/api/workspaces/{id}/export` |
| `healthCheck()` | GET | `/health` |

Export formats: `terraform`, `markdown`, `mermaid`

---

## Test It

### Terminal 1: Backend
```bash
cd Flowstate-Backend
uvicorn main:app --reload --port 8000
```

### Terminal 2: Frontend
```bash
cd Flowstate-Frontend
npm run dev
```

### Terminal 3: Test API
```bash
# Get workspaces
curl -X GET http://localhost:8000/api/workspaces \
  -H "X-API-Key: sk_dev_12345"

# Create workspace
curl -X POST http://localhost:8000/api/workspaces \
  -H "X-API-Key: sk_dev_12345" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Workspace"}'
```

---

## WebSocket (Already Working)

The real-time AI session uses WebSocket and is **already implemented** in your code:

```typescript
// In useAISession.ts (line 30-31)
const BACKEND_WS = process.env.NEXT_PUBLIC_BACKEND_WS_URL ?? "ws://localhost:8000";
const wsUrl = `${BACKEND_WS}/ws/session/${workspaceId}?mode=assisted`;
```

When you start an AI session:
- ✅ Browser sends mic audio (PCM)
- ✅ Backend connects to Gemini
- ✅ AI responds with voice + draws nodes
- ✅ All in real-time!

---

## Common Issues

| Problem | Solution |
|---------|----------|
| `Connection refused` | Make sure backend is running on port 8000 |
| `X-API-Key: Invalid` | Check BACKEND_API_KEY matches in both `.env` files |
| `CORS error` | Backend is already configured for localhost:3000 |
| `WebSocket stuck` | Check `GEMINI_API_KEY` in backend `.env` |

---

## What's Included

✅ **Frontend Setup:**
- `src/lib/backendAPI.ts` — All API functions
- `src/hooks/useBackendAPI.ts` — React hook with loading/error states
- `.env.example` — Environment template
- `BACKEND_INTEGRATION.md` — Full documentation

✅ **Backend Configuration:**
- Already supports API Key auth (X-API-Key header)
- CORS configured for localhost:3000
- WebSocket ready for AI sessions
- REST endpoints ready for workspace CRUD

---

## Next Steps

1. ✅ Backend running locally?
2. ✅ Frontend `.env.local` created?
3. 🚀 Start using API in your components!

See `BACKEND_INTEGRATION.md` for deployment & advanced setup.
