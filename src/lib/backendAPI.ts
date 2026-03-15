/**
 * Backend API Client
 * Handles workspace CRUD operations with API key authentication
 * Connects to: http://localhost:8000 (dev) or https://flowstate-api.vercel.app (prod)
 */

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_REST_URL ?? "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY ?? "sk_default_key_12345";

// ── Types ─────────────────────────────────────────────────────────────────

export interface WorkspaceResponse {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  elements?: any;
  appState?: any;
  owner_id?: string;
}

export interface ExportResponse {
  format: "terraform" | "markdown" | "mermaid";
  content: string;
}

export interface APIError {
  detail: string;
  status_code: number;
}

// ── Utility ────────────────────────────────────────────────────────────────

/**
 * Generic fetch wrapper with API key injection
 * Automatically adds X-API-Key header to all requests
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse response
    let data;
    try {
      data = await response.json();
    } catch {
      data = { error: "Invalid JSON response" };
    }

    if (!response.ok) {
      const error = data as APIError;
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return data as T;
  } catch (error) {
    console.error(`[API] ${endpoint}:`, error);
    throw error;
  }
}

// ── Workspace CRUD ────────────────────────────────────────────────────────

/**
 * Get all workspaces for the current user
 * @returns List of workspaces
 */
export async function getWorkspaces(): Promise<WorkspaceResponse[]> {
  return apiCall<WorkspaceResponse[]>("/api/workspaces", {
    method: "GET",
  });
}

/**
 * Get a single workspace by ID
 * @param id - Workspace ID
 * @returns Workspace data with elements and appState
 */
export async function getWorkspace(id: string): Promise<WorkspaceResponse> {
  return apiCall<WorkspaceResponse>(`/api/workspaces/${id}`, {
    method: "GET",
  });
}

/**
 * Create a new workspace
 * @param data - Workspace creation data
 * @returns Created workspace
 */
export async function createWorkspace(data: {
  title: string;
  description?: string;
  elements?: any;
  appState?: any;
}): Promise<WorkspaceResponse> {
  return apiCall<WorkspaceResponse>("/api/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing workspace
 * @param id - Workspace ID
 * @param data - Update data
 * @returns Updated workspace
 */
export async function updateWorkspace(
  id: string,
  data: {
    title?: string;
    description?: string;
    elements?: any;
    appState?: any;
  }
): Promise<WorkspaceResponse> {
  return apiCall<WorkspaceResponse>(`/api/workspaces/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a workspace
 * @param id - Workspace ID
 * @returns Success message
 */
export async function deleteWorkspace(id: string): Promise<{ message: string }> {
  return apiCall<{ message: string }>(`/api/workspaces/${id}`, {
    method: "DELETE",
  });
}

// ── Export Functionality ──────────────────────────────────────────────────

/**
 * Export workspace to Terraform, Markdown, or Mermaid format
 * @param id - Workspace ID
 * @param format - Export format (terraform, markdown, mermaid)
 * @returns Export data with content
 */
export async function exportWorkspace(
  id: string,
  format: "terraform" | "markdown" | "mermaid"
): Promise<ExportResponse> {
  return apiCall<ExportResponse>(`/api/workspaces/${id}/export`, {
    method: "POST",
    body: JSON.stringify({ format }),
  });
}

/**
 * Download exported workspace as file
 * @param id - Workspace ID
 * @param format - Export format
 * @param filename - Optional custom filename
 */
export async function downloadExport(
  id: string,
  format: "terraform" | "markdown" | "mermaid",
  filename?: string
): Promise<void> {
  try {
    const data = await exportWorkspace(id, format);
    
    const defaultFilenames = {
      terraform: "architecture.tf",
      markdown: "architecture.md",
      mermaid: "architecture.mmd",
    };

    const finalFilename = filename || defaultFilenames[format];

    // Create blob and trigger download
    const blob = new Blob([data.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`Failed to download export:`, error);
    throw error;
  }
}

// ── Health Check ──────────────────────────────────────────────────────────

/**
 * Check if backend API is online
 * @returns Health status
 */
export async function healthCheck(): Promise<{
  status: string;
  version: string;
  gemini_key_set: boolean;
  model: string;
}> {
  return apiCall("/health", {
    method: "GET",
  });
}

// ── Error Handling ────────────────────────────────────────────────────────

/**
 * User-friendly error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
