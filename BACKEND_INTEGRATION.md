# FlowState Frontend ↔ Backend Integration Guide

## Overview

Your **Flowstate-Frontend** (Next.js) connects to **Flowstate-Backend** (FastAPI) via:
- **WebSocket** for real-time AI sessions (mic audio + canvas drawing)
- **REST API** for workspace CRUD operations (create, save, export, delete)
- **API Key Authentication** for secure API calls

---

## Step 1: Backend Setup

### 1a. Clone and Configure Backend

```bash
git clone https://github.com/VISHALIN-rgm/Flowstate-Backend.git
cd Flowstate-Backend
```

### 1b. Create `.env` File

```bash
cp .env.example .env
```

Edit `.env` and add your **Gemini API Key**:

```env
GEMINI_API_KEY=your_key_from_aistudio.google.com
BACKEND_API_KEY=your_secure_api_key_12345  # For frontend → backend auth
```

Get your Gemini key at: **https://aistudio.google.com/app/apikey**

### 1c. Install & Run Backend

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO  🚀 FlowState AI Backend starting…
INFO  ✅ GEMINI_API_KEY detected → AIza...xxxxxx
INFO  Application startup complete.
INFO  Uvicorn running on http://127.0.0.1:8000
```

Visit **http://localhost:8000/docs** to see all endpoints.

---

## Step 2: Frontend Configuration

### 2a. Update Frontend `.env.local`

In your Next.js project, create `.env.local`:

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

# Backend WebSocket & REST API
NEXT_PUBLIC_BACKEND_WS_URL=ws://localhost:8000
NEXT_PUBLIC_BACKEND_REST_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_API_KEY=your_secure_api_key_12345
```

> **⚠️ Important:**
> - `NEXT_PUBLIC_*` vars are **public** (appear in browser)
> - Keep `NEXT_PUBLIC_BACKEND_API_KEY` safe — use a rate-limited key or implement OAuth
> - For production, use environment variables, not hardcoded keys

---

## Step 3: Backend Integration Points

### 3a. WebSocket Connection (Already Implemented)

Your `useAISession.ts` hook already connects via:

```typescript
const BACKEND_WS = process.env.NEXT_PUBLIC_BACKEND_WS_URL ?? "ws://localhost:8000";
const wsUrl = `${BACKEND_WS}/ws/session/${workspaceId}?mode=assisted`;
```

✅ **No changes needed** — WebSocket is ready!

---

### 3b. REST API Endpoints (New)

Create a new file: `src/lib/backendAPI.ts`

```typescript
/**
 * Backend API Client
 * Handles workspace CRUD operations with API key authentication
 */

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_REST_URL ?? "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY ?? "sk_default_key_12345";

interface APIOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Generic fetch wrapper with API key injection
 */
async function apiCall(endpoint: string, options: APIOptions = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get all workspaces
 */
export async function getWorkspaces() {
  return apiCall("/api/workspaces");
}

/**
 * Get single workspace
 */
export async function getWorkspace(id: string) {
  return apiCall(`/api/workspaces/${id}`);
}

/**
 * Create workspace
 */
export async function createWorkspace(data: {
  title: string;
  description?: string;
  elements?: any;
  appState?: any;
}) {
  return apiCall("/api/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update workspace
 */
export async function updateWorkspace(
  id: string,
  data: {
    title?: string;
    description?: string;
    elements?: any;
    appState?: any;
  }
) {
  return apiCall(`/api/workspaces/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete workspace
 */
export async function deleteWorkspace(id: string) {
  return apiCall(`/api/workspaces/${id}`, {
    method: "DELETE",
  });
}

/**
 * Export workspace
 */
export async function exportWorkspace(
  id: string,
  format: "terraform" | "markdown" | "mermaid"
) {
  return apiCall(`/api/workspaces/${id}/export`, {
    method: "POST",
    body: JSON.stringify({ format }),
  });
}
```

---

### 3c. Using Backend API in Components

Example: Save workspace to backend when AI adds a node

Edit `src/app/workspace/[id]/ExcalidrawWrapper.tsx` (around line 300):

```typescript
import { updateWorkspace } from "@/lib/backendAPI";

// Inside your handleAddNode callback:
const handleAddNode = async (payload: AddNodePayload) => {
  // ... existing code ...

  try {
    // Optionally save to backend
    const canvasBlob = await getCanvasBlob?.();
    if (canvasBlob && workspace) {
      await updateWorkspace(workspace.id, {
        title: workspace.title,
        // Pass stringified elements/appState if available
      });
    }
  } catch (error) {
    console.error("Failed to save to backend:", error);
  }
};
```

---

## Step 4: API Authentication Security

### Option A: API Key in Header (Recommended for Development)

✅ **What you have now** — Backend checks `X-API-Key` header

```typescript
headers: {
  "X-API-Key": process.env.NEXT_PUBLIC_BACKEND_API_KEY,
}
```

### Option B: Bearer Token (Recommended for Production)

Modify backend to use JWT tokens:

**Backend (main.py):**
```python
from fastapi import Header

@app.get("/api/workspaces")
async def get_workspaces(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    # Verify JWT token
    return workspaces
```

**Frontend:**
```typescript
headers: {
  "Authorization": `Bearer ${jwtToken}`,
}
```

### Option C: OAuth 2.0 (Enterprise)

For Vercel deployment, consider:
- **Auth0** — OAuth provider
- **Clerk** — User management + API keys
- **NextAuth.js** — Session-based auth

---

## Step 5: CORS Configuration (If Deployed)

If frontend is on **`https://myapp.vercel.app`** and backend on **`https://api.myapp.com`**:

**Backend (main.py):**
```python
from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGINS = [
    "http://localhost:3000",           # Development
    "https://myapp.vercel.app",        # Production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "X-API-Key"],  # ← Add custom headers
)
```

---

## Step 6: Testing the Integration

### 6a. Test WebSocket Connection

```bash
# Terminal 1: Backend running
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend running
npm run dev
# http://localhost:3000
```

Navigate to a workspace with "With AI Assistance" mode:
- ✅ Mic permission should request
- ✅ Audio should stream to backend
- ✅ AI should respond with voice + nodes

### 6b. Test REST API

```bash
# Get all workspaces
curl -X GET http://localhost:8000/api/workspaces \
  -H "X-API-Key: your_secure_api_key_12345"

# Create workspace
curl -X POST http://localhost:8000/api/workspaces \
  -H "X-API-Key: your_secure_api_key_12345" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Architecture"}'

# Export as Terraform
curl -X POST http://localhost:8000/api/workspaces/{id}/export \
  -H "X-API-Key: your_secure_api_key_12345" \
  -H "Content-Type: application/json" \
  -d '{"format": "terraform"}'
```

### 6c. Test with Frontend

In browser DevTools (F12 → Network):
1. Start AI session → see WebSocket `/ws/session/...` connecting
2. Speak to AI → see binary frames (0x01, 0x02) being sent
3. AI responds → see JSON messages back

---

## Step 7: Production Deployment

### 7a. Deploy Backend to Vercel

```bash
# Backend repo root
vercel deploy --prod
```

Update frontend env vars:
```env
NEXT_PUBLIC_BACKEND_WS_URL=wss://flowstate-api.vercel.app
NEXT_PUBLIC_BACKEND_REST_URL=https://flowstate-api.vercel.app
NEXT_PUBLIC_BACKEND_API_KEY=sk_prod_xxx  # Use secure key
```

### 7b. Deploy Frontend to Vercel

```bash
# Frontend repo root
vercel deploy --prod
```

Both automatically redirect `http://` → `https://` and handle CORS correctly.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| WebSocket connection refused | Backend not running on port 8000 |
| `X-API-Key` header error | Add key to backend `.env` and frontend `.env.local` |
| CORS error in browser | Add frontend URL to `ALLOWED_ORIGINS` in backend |
| AI not responding | Check `GEMINI_API_KEY` is valid in backend `.env` |
| Workspace not saving | Verify `updateWorkspace()` is called after `handleAddNode()` |

---

## Next Steps

1. ✅ Backend running locally
2. ✅ Frontend `.env.local` configured
3. ✅ `src/lib/backendAPI.ts` created
4. ✅ WebSocket already working
5. 🔄 Integrate REST calls in workspace components
6. 📦 Deploy both to Vercel

Enjoy building! 🚀
