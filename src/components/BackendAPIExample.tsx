/**
 * BackendAPIExample Component
 * Demonstrates how to use the backend API functions
 * 
 * Usage:
 * import BackendAPIExample from '@/components/BackendAPIExample';
 * <BackendAPIExample />
 */

"use client";

import React, { useState, useEffect } from "react";
import { useBackendAPI } from "@/hooks/useBackendAPI";
import type { WorkspaceResponse } from "@/lib/backendAPI";

export default function BackendAPIExample() {
  const {
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    exportWorkspace,
    downloadExport,
    healthCheck,
    loading,
    error,
    clearError,
  } = useBackendAPI();

  const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceResponse | null>(null);
  const [backendHealth, setBackendHealth] = useState<any>(null);

  // Load workspaces on mount
  useEffect(() => {
    loadWorkspaces();
    checkBackendHealth();
  }, []);

  // ── Functions ──────────────────────────────────────────────────────────

  async function loadWorkspaces() {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      console.error("Failed to load workspaces:", err);
    }
  }

  async function checkBackendHealth() {
    try {
      const health = await healthCheck();
      setBackendHealth(health);
    } catch (err) {
      console.error("Backend health check failed:", err);
    }
  }

  async function handleCreateWorkspace() {
    if (!newTitle.trim()) return;
    try {
      const workspace = await createWorkspace({
        title: newTitle,
        description: "Created from example component",
      });
      setWorkspaces([...workspaces, workspace]);
      setNewTitle("");
      alert(`✅ Created: ${workspace.title}`);
    } catch (err) {
      console.error("Failed to create workspace:", err);
    }
  }

  async function handleUpdateWorkspace(id: string, newName: string) {
    try {
      const updated = await updateWorkspace(id, { title: newName });
      setWorkspaces(workspaces.map((w) => (w.id === id ? updated : w)));
      alert(`✅ Updated: ${updated.title}`);
    } catch (err) {
      console.error("Failed to update workspace:", err);
    }
  }

  async function handleDeleteWorkspace(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteWorkspace(id);
      setWorkspaces(workspaces.filter((w) => w.id !== id));
      alert("✅ Deleted");
    } catch (err) {
      console.error("Failed to delete workspace:", err);
    }
  }

  async function handleExportWorkspace(id: string, format: "terraform" | "markdown" | "mermaid") {
    try {
      await downloadExport(id, format);
      alert(`✅ Exported as ${format.toUpperCase()}`);
    } catch (err) {
      console.error("Failed to export:", err);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Backend API Example</h1>

      {/* Backend Health Status */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="font-semibold mb-2">Backend Status</h2>
        {backendHealth ? (
          <div className="text-sm space-y-1">
            <p>✅ Status: {backendHealth.status}</p>
            <p>🤖 Model: {backendHealth.model}</p>
            <p>🔑 API Key Set: {backendHealth.gemini_key_set ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p className="text-yellow-600">Checking backend...</p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 text-sm">{error.message}</p>
          <button
            onClick={clearError}
            className="mt-2 text-xs underline text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create Workspace Section */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
        <h2 className="font-semibold mb-3">Create Workspace</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter workspace name..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            onKeyPress={(e) => e.key === "Enter" && handleCreateWorkspace()}
          />
          <button
            onClick={handleCreateWorkspace}
            disabled={loading || !newTitle.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* Workspaces List */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3">
          Workspaces ({workspaces.length})
        </h2>
        {workspaces.length === 0 ? (
          <p className="text-gray-500 text-sm">No workspaces yet. Create one above!</p>
        ) : (
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="p-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{workspace.title}</p>
                    <p className="text-xs text-gray-500">ID: {workspace.id}</p>
                    {workspace.description && (
                      <p className="text-sm text-gray-600">{workspace.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {/* Export buttons */}
                    <button
                      onClick={() => handleExportWorkspace(workspace.id, "terraform")}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                      title="Export as Terraform"
                    >
                      TF
                    </button>
                    <button
                      onClick={() => handleExportWorkspace(workspace.id, "markdown")}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200"
                      title="Export as Markdown"
                    >
                      MD
                    </button>
                    <button
                      onClick={() => handleExportWorkspace(workspace.id, "mermaid")}
                      className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs hover:bg-pink-200"
                      title="Export as Mermaid"
                    >
                      MERMAID
                    </button>

                    {/* Edit/Delete buttons */}
                    <button
                      onClick={() => {
                        const newName = prompt("New name:", workspace.title);
                        if (newName) {
                          handleUpdateWorkspace(workspace.id, newName);
                        }
                      }}
                      className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorkspace(workspace.id)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded text-sm">
        <h3 className="font-semibold mb-2">How to Use</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            <strong>Create:</strong> Enter a name and click "Create"
          </li>
          <li>
            <strong>Export:</strong> Click TF, MD, or MERMAID to download
          </li>
          <li>
            <strong>Edit:</strong> Click "Edit" to rename
          </li>
          <li>
            <strong>Delete:</strong> Click "Delete" to remove
          </li>
        </ul>

        <div className="mt-4 pt-4 border-t border-gray-200 text-gray-600">
          <p>
            💡 <strong>Tip:</strong> Make sure your backend is running at{" "}
            <code className="bg-white px-2 py-1 rounded border border-gray-300">
              http://localhost:8000
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
