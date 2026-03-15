/**
 * useBackendAPI Hook
 * Provides easy access to backend API functions with loading/error states
 * Usage: const { getWorkspaces, loading, error } = useBackendAPI();
 */

import { useCallback, useState } from "react";
import * as backendAPI from "@/lib/backendAPI";
import type { WorkspaceResponse, ExportResponse } from "@/lib/backendAPI";

export interface UseBackendAPIReturn {
  // State
  loading: boolean;
  error: Error | null;

  // Workspace CRUD
  getWorkspaces: () => Promise<WorkspaceResponse[]>;
  getWorkspace: (id: string) => Promise<WorkspaceResponse>;
  createWorkspace: (data: Parameters<typeof backendAPI.createWorkspace>[0]) => Promise<WorkspaceResponse>;
  updateWorkspace: (id: string, data: Parameters<typeof backendAPI.updateWorkspace>[1]) => Promise<WorkspaceResponse>;
  deleteWorkspace: (id: string) => Promise<{ message: string }>;

  // Export
  exportWorkspace: (id: string, format: "terraform" | "markdown" | "mermaid") => Promise<ExportResponse>;
  downloadExport: (id: string, format: "terraform" | "markdown" | "mermaid", filename?: string) => Promise<void>;

  // Health
  healthCheck: () => Promise<any>;

  // Clear error
  clearError: () => void;
}

export function useBackendAPI(): UseBackendAPIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Wrap API calls with loading and error handling
   */
  const executeAsync = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    clearError,

    getWorkspaces: () => executeAsync(() => backendAPI.getWorkspaces()),
    getWorkspace: (id) => executeAsync(() => backendAPI.getWorkspace(id)),
    createWorkspace: (data) => executeAsync(() => backendAPI.createWorkspace(data)),
    updateWorkspace: (id, data) => executeAsync(() => backendAPI.updateWorkspace(id, data)),
    deleteWorkspace: (id) => executeAsync(() => backendAPI.deleteWorkspace(id)),

    exportWorkspace: (id, format) => executeAsync(() => backendAPI.exportWorkspace(id, format)),
    downloadExport: (id, format, filename) => executeAsync(() => backendAPI.downloadExport(id, format, filename)),

    healthCheck: () => executeAsync(() => backendAPI.healthCheck()),
  };
}
