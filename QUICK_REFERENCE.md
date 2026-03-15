# 🚀 Backend Integration - Quick Reference Card

Print this or keep it handy while integrating!

---

## Environment Variables

### Backend `.env`
```env
GEMINI_API_KEY=your_key_from_aistudio.google.com
BACKEND_API_KEY=sk_dev_12345
```

### Frontend `.env.local`
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

---

## Commands

### Start Backend
```bash
cd Flowstate-Backend
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate (Windows)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Start Frontend
```bash
cd Flowstate-Frontend
npm run dev
```

### Test Health
```bash
curl http://localhost:8000/health
```

### Test API
```bash
curl -H "X-API-Key: sk_dev_12345" http://localhost:8000/api/workspaces
```

---

## API Functions (Quick Look)

### Import
```typescript
import { 
  getWorkspaces, 
  createWorkspace, 
  updateWorkspace, 
  deleteWorkspace, 
  exportWorkspace, 
  downloadExport 
} from "@/lib/backendAPI";
```

### Usage
```typescript
// Get all
const all = await getWorkspaces();

// Get one
const one = await getWorkspace("id");

// Create
const ws = await createWorkspace({
  title: "My Architecture",
  description: "Optional description"
});

// Update
await updateWorkspace("id", {
  title: "New Title"
});

// Delete
await deleteWorkspace("id");

// Export (get content)
const exp = await exportWorkspace("id", "terraform");

// Download (save file)
await downloadExport("id", "terraform", "file.tf");
```

---

## React Hook Usage

```typescript
import { useBackendAPI } from "@/hooks/useBackendAPI";

export function MyComponent() {
  const { 
    getWorkspaces, 
    createWorkspace, 
    loading, 
    error, 
    clearError 
  } = useBackendAPI();

  return (
    <div>
      <button 
        onClick={() => createWorkspace({ title: "New" })} 
        disabled={loading}
      >
        {loading ? "Loading..." : "Create"}
      </button>
      {error && (
        <>
          <p>{error.message}</p>
          <button onClick={clearError}>Dismiss</button>
        </>
      )}
    </div>
  );
}
```

---

## URLs Reference

| Purpose | Development | Production |
|---------|-------------|-----------|
| Backend | `http://localhost:8000` | `https://api.example.com` |
| WebSocket | `ws://localhost:8000` | `wss://api.example.com` |
| Frontend | `http://localhost:3000` | `https://app.example.com` |
| Swagger | `http://localhost:8000/docs` | `https://api.example.com/docs` |

---

## Files Reference

| File | Purpose | Size |
|------|---------|------|
| `src/lib/backendAPI.ts` | API client | 233 lines |
| `src/hooks/useBackendAPI.ts` | React hook | 80 lines |
| `src/components/BackendAPIExample.tsx` | Example | 263 lines |

---

## Endpoints Reference

| Method | Endpoint | Function |
|--------|----------|----------|
| GET | `/api/workspaces` | `getWorkspaces()` |
| GET | `/api/workspaces/{id}` | `getWorkspace(id)` |
| POST | `/api/workspaces` | `createWorkspace(data)` |
| PUT | `/api/workspaces/{id}` | `updateWorkspace(id, data)` |
| DELETE | `/api/workspaces/{id}` | `deleteWorkspace(id)` |
| POST | `/api/workspaces/{id}/export` | `exportWorkspace(id, format)` |
| GET | `/health` | `healthCheck()` |
| WS | `/ws/session/{id}?mode=assisted` | Real-time AI |

---

## Export Formats

```typescript
// Terraform
await downloadExport(id, "terraform");  // .tf file

// Markdown  
await downloadExport(id, "markdown");   // .md file

// Mermaid
await downloadExport(id, "mermaid");    // .mmd file
```

---

## Headers Sent

```javascript
{
  "Content-Type": "application/json",
  "X-API-Key": "sk_dev_12345"            // Auto-injected
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized (bad API key) |
| 404 | Not found |
| 500 | Server error |

---

## Testing Checklist

- [ ] Backend running at port 8000?
- [ ] Frontend running at port 3000?
- [ ] `.env` files created with keys?
- [ ] Health check returns `ok`?
- [ ] API call with API key works?
- [ ] WebSocket connects for AI?
- [ ] Example component works?
- [ ] No console errors?

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Connection refused | Start backend on port 8000 |
| 401 Unauthorized | Check API key matches in both `.env` files |
| CORS error | Already configured for localhost |
| WebSocket stuck | Check GEMINI_API_KEY in backend `.env` |
| No response | Check backend logs for errors |

---

## Development Flow

```
1. Start Backend
   └─ python -m venv venv
   └─ source venv/bin/activate
   └─ pip install -r requirements.txt
   └─ uvicorn main:app --reload --port 8000

2. Create Frontend .env.local
   └─ Copy vars from .env.example
   └─ Set BACKEND_API_KEY=sk_dev_12345

3. Start Frontend
   └─ npm run dev

4. Test
   └─ curl http://localhost:8000/health
   └─ curl -H "X-API-Key: sk_dev_12345" http://localhost:8000/api/workspaces

5. Use API in Components
   └─ import { createWorkspace } from "@/lib/backendAPI"
   └─ const ws = await createWorkspace({...})

6. Deploy
   └─ vercel deploy --prod (both)
   └─ Update .env vars to https/wss
```

---

## Code Snippets

### Create & List Workspaces
```typescript
import { createWorkspace, getWorkspaces } from "@/lib/backendAPI";

// Create
const newWs = await createWorkspace({ 
  title: "My Arch",
  description: "Test"
});

// List
const all = await getWorkspaces();
console.log(all);
```

### Update & Delete
```typescript
import { updateWorkspace, deleteWorkspace } from "@/lib/backendAPI";

// Update
await updateWorkspace("id", { title: "Updated" });

// Delete
await deleteWorkspace("id");
```

### Export Workspace
```typescript
import { downloadExport } from "@/lib/backendAPI";

// Download all formats
await downloadExport("id", "terraform");  // architecture.tf
await downloadExport("id", "markdown");   // architecture.md
await downloadExport("id", "mermaid");    // architecture.mmd
```

### With Error Handling
```typescript
import { useBackendAPI } from "@/hooks/useBackendAPI";

const { getWorkspaces, error, clearError } = useBackendAPI();

try {
  const workspaces = await getWorkspaces();
} catch (err) {
  console.error(err);
}

// Or use hook state
if (error) {
  return <p>{error.message}</p>;
}
```

---

## Useful Links

- Backend Repo: https://github.com/VISHALIN-rgm/Flowstate-Backend
- Frontend Repo: https://github.com/VISHALIN-rgm/Flowstate-Frontend
- Full Docs: See `BACKEND_INTEGRATION.md`
- API Docs: See `API_REFERENCE.md`
- Setup: See `BACKEND_QUICK_START.md`

---

## Security Reminders

✅ DO:
- Store API key in `.env` (not hardcoded)
- Use strong keys in production
- Keep `.env` out of git
- Use HTTPS/WSS in production
- Validate all inputs

❌ DON'T:
- Commit `.env` files
- Use weak API keys
- Share API keys publicly
- Use HTTP in production
- Trust client-side keys alone

---

## Quick Support

**Problem:** Backend won't start
```bash
# Check port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

**Problem:** API key error (401)
```bash
# Frontend .env.local must match backend .env
# Both should have same value for BACKEND_API_KEY
```

**Problem:** WebSocket not connecting
```bash
# Check backend logs for GEMINI_API_KEY validation
# Check browser console for connection errors
```

---

## Remember

✨ All existing code stays the same
✨ WebSocket already working (AI sessions)
✨ New API functions are optional
✨ Start with `BACKEND_QUICK_START.md`
✨ Test with curl before integrating

---

**Print this card and keep it handy!** 📌

