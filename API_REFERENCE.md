# Backend API Reference

Complete reference for all backend API endpoints and how to use them from the frontend.

---

## Authentication

All API requests require an API key in the `X-API-Key` header:

```typescript
const headers = {
  "X-API-Key": process.env.NEXT_PUBLIC_BACKEND_API_KEY,
  "Content-Type": "application/json",
};
```

The key is automatically injected by `src/lib/backendAPI.ts`.

---

## Workspace Endpoints

### 1. List All Workspaces

**Endpoint:** `GET /api/workspaces`

**Frontend:**
```typescript
import { getWorkspaces } from "@/lib/backendAPI";

const workspaces = await getWorkspaces();
```

**Response:**
```json
[
  {
    "id": "abc123",
    "title": "My Architecture",
    "description": "Redis cache architecture",
    "created_at": "2026-03-15T10:30:00Z",
    "updated_at": "2026-03-15T11:45:00Z",
    "elements": null,
    "appState": null,
    "owner_id": "user_123"
  }
]
```

---

### 2. Get Single Workspace

**Endpoint:** `GET /api/workspaces/{id}`

**Frontend:**
```typescript
import { getWorkspace } from "@/lib/backendAPI";

const workspace = await getWorkspace("abc123");
```

**Response:**
```json
{
  "id": "abc123",
  "title": "My Architecture",
  "description": "Redis cache architecture",
  "created_at": "2026-03-15T10:30:00Z",
  "updated_at": "2026-03-15T11:45:00Z",
  "elements": "[...]",  // Stringified Excalidraw elements
  "appState": "{...}",  // Stringified Excalidraw app state
  "owner_id": "user_123"
}
```

---

### 3. Create Workspace

**Endpoint:** `POST /api/workspaces`

**Frontend:**
```typescript
import { createWorkspace } from "@/lib/backendAPI";

const newWorkspace = await createWorkspace({
  title: "API Gateway Architecture",
  description: "Lambda + API Gateway design",
  elements: JSON.stringify([...]), // Optional
  appState: JSON.stringify({...}), // Optional
});
```

**Request Body:**
```json
{
  "title": "API Gateway Architecture",
  "description": "Lambda + API Gateway design",
  "elements": null,
  "appState": null
}
```

**Response:**
```json
{
  "id": "abc123",
  "title": "API Gateway Architecture",
  "description": "Lambda + API Gateway design",
  "created_at": "2026-03-15T12:00:00Z",
  "updated_at": "2026-03-15T12:00:00Z",
  "elements": null,
  "appState": null,
  "owner_id": "user_123"
}
```

---

### 4. Update Workspace

**Endpoint:** `PUT /api/workspaces/{id}`

**Frontend:**
```typescript
import { updateWorkspace } from "@/lib/backendAPI";

const updated = await updateWorkspace("abc123", {
  title: "Updated Title",
  elements: JSON.stringify(newElements),
  appState: JSON.stringify(newAppState),
});
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "elements": "[...]",
  "appState": "{...}"
}
```

**Response:**
```json
{
  "id": "abc123",
  "title": "Updated Title",
  "updated_at": "2026-03-15T13:00:00Z",
  ...
}
```

---

### 5. Delete Workspace

**Endpoint:** `DELETE /api/workspaces/{id}`

**Frontend:**
```typescript
import { deleteWorkspace } from "@/lib/backendAPI";

await deleteWorkspace("abc123");
```

**Response:**
```json
{
  "message": "Workspace deleted successfully"
}
```

---

## Export Endpoints

### Export Workspace

**Endpoint:** `POST /api/workspaces/{id}/export`

**Formats:**
- `terraform` — HashiCorp Terraform code
- `markdown` — Markdown documentation
- `mermaid` — Mermaid diagram syntax

**Frontend:**
```typescript
import { exportWorkspace, downloadExport } from "@/lib/backendAPI";

// Method 1: Get export data
const data = await exportWorkspace("abc123", "terraform");
console.log(data.content); // Terraform code

// Method 2: Download as file
await downloadExport("abc123", "terraform", "architecture.tf");
```

**Request Body:**
```json
{
  "format": "terraform"
}
```

**Response (Terraform):**
```json
{
  "format": "terraform",
  "content": "resource \"aws_lambda_function\" \"api\" {\n  filename      = \"api.zip\"\n  function_name = \"api\"\n  handler       = \"index.handler\"\n}\n..."
}
```

**Response (Markdown):**
```json
{
  "format": "markdown",
  "content": "# Architecture Diagram\n\n## Components\n\n### Lambda\n- Description: Serverless compute\n- Connected to: API Gateway\n\n..."
}
```

**Response (Mermaid):**
```json
{
  "format": "mermaid",
  "content": "graph TD\n  A[API Gateway] --> B[Lambda]\n  B --> C[DynamoDB]\n  ..."
}
```

---

## System Endpoints

### Health Check

**Endpoint:** `GET /health`

**Frontend:**
```typescript
import { healthCheck } from "@/lib/backendAPI";

const health = await healthCheck();
```

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "gemini_key_set": true,
  "model": "gemini-2.5-flash-native-audio-preview-12-2025"
}
```

---

## WebSocket Connection

### Real-time AI Session

**Endpoint:** `ws://localhost:8000/ws/session/{workspace_id}?mode=assisted`

**Binary Frame Protocol:**

| Tag | Meaning | Format |
|-----|---------|--------|
| `0x01` | Mic audio | PCM int16, 16kHz, mono |
| `0x02` | Screenshot | Raw JPEG bytes |
| `0x03` | Text message | UTF-8 string |

**Server Responses:**

JSON messages:
```json
{
  "type": "status",
  "status": "ai_ready"
}
```

```json
{
  "type": "transcript",
  "text": "I'll add a Redis cache to improve performance"
}
```

```json
{
  "action": "ADD_NODE",
  "node_name": "Redis Cache",
  "node_type": "cache",
  "reasoning": "Caches database queries to reduce load"
}
```

Binary response: AI voice (PCM int16, 24kHz)

**Frontend Usage:**

Already implemented in `src/hooks/useAISession.ts`:

```typescript
import { useAISession } from "@/hooks/useAISession";

export function WorkspaceComponent() {
  const aiSession = useAISession({
    workspaceId: "abc123",
    getCanvasBlob: () => canvasRef.current?.toBlob(),
    onAddNode: (node) => console.log("Add node:", node),
    onTranscript: (text) => console.log("AI said:", text),
    onStatus: (status) => console.log("Status:", status),
  });

  return (
    <button onClick={() => aiSession.start()}>
      Start AI Session
    </button>
  );
}
```

---

## Error Handling

### Error Response Format

```json
{
  "detail": "Workspace not found"
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid API key) |
| 404 | Not Found |
| 500 | Server Error |

### Frontend Error Handling

```typescript
import { useBackendAPI } from "@/hooks/useBackendAPI";

export function MyComponent() {
  const { getWorkspaces, loading, error, clearError } = useBackendAPI();

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={clearError}>Dismiss</button>
      </div>
    );
  }

  return <div>Content</div>;
}
```

---

## Rate Limiting

Currently, there are **no rate limits** on the backend. For production:

Add rate limiting middleware:

```python
# Backend (main.py)
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/workspaces")
@limiter.limit("100/minute")
async def get_workspaces():
    ...
```

---

## CORS Configuration

Backend allows requests from:
- `http://localhost:3000` (development)
- `http://localhost:8000` (internal)

For production, update backend `.env`:

```python
# Backend (config.py)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://myapp.vercel.app",
]
```

---

## Examples

### Complete Workspace Lifecycle

```typescript
"use client";

import { useBackendAPI } from "@/hooks/useBackendAPI";

export function WorkspaceManager() {
  const {
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    downloadExport,
    loading,
    error,
  } = useBackendAPI();

  // 1. Load workspaces
  async function handleLoad() {
    const ws = await getWorkspaces();
    console.log("Loaded:", ws);
  }

  // 2. Create workspace
  async function handleCreate() {
    const newWs = await createWorkspace({
      title: "New Architecture",
      description: "Created from example",
    });
    console.log("Created:", newWs.id);
  }

  // 3. Update workspace
  async function handleUpdate(id: string) {
    const updated = await updateWorkspace(id, {
      title: "Updated Architecture",
    });
    console.log("Updated:", updated);
  }

  // 4. Export workspace
  async function handleExport(id: string) {
    await downloadExport(id, "terraform");
    // File downloads automatically
  }

  // 5. Delete workspace
  async function handleDelete(id: string) {
    await deleteWorkspace(id);
    console.log("Deleted");
  }

  return (
    <div>
      <button onClick={handleLoad} disabled={loading}>Load</button>
      <button onClick={handleCreate} disabled={loading}>Create</button>
      <button onClick={() => handleUpdate("id")} disabled={loading}>Update</button>
      <button onClick={() => handleExport("id")} disabled={loading}>Export</button>
      <button onClick={() => handleDelete("id")} disabled={loading}>Delete</button>
      
      {error && <p>{error.message}</p>}
    </div>
  );
}
```

---

## Testing with curl

### List workspaces
```bash
curl -X GET http://localhost:8000/api/workspaces \
  -H "X-API-Key: sk_dev_12345"
```

### Create workspace
```bash
curl -X POST http://localhost:8000/api/workspaces \
  -H "X-API-Key: sk_dev_12345" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Workspace"}'
```

### Export to Terraform
```bash
curl -X POST http://localhost:8000/api/workspaces/abc123/export \
  -H "X-API-Key: sk_dev_12345" \
  -H "Content-Type: application/json" \
  -d '{"format": "terraform"}'
```

---

## Useful Links

- [Backend Repository](https://github.com/VISHALIN-rgm/Flowstate-Backend)
- [Backend Swagger UI](http://localhost:8000/docs)
- [Integration Guide](./BACKEND_INTEGRATION.md)
- [Quick Start](./BACKEND_QUICK_START.md)

