import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { WorkspaceMetadata } from '../types/workspace';

interface WorkspaceState {
  workspaces: WorkspaceMetadata[];
  activeWorkspaceId: string | null;
  createWorkspace: (name?: string) => string;
  switchWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  deleteWorkspace: (id: string) => void;
  getActiveWorkspace: () => WorkspaceMetadata | undefined;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: [],
      activeWorkspaceId: null,

      createWorkspace: (name?: string) => {
        const id = nanoid();
        const now = Date.now();
        const metadata: WorkspaceMetadata = {
          id,
          name: name ?? 'New Workspace',
          createdAt: now,
          updatedAt: now,
        };
        set({
          workspaces: [...get().workspaces, metadata],
          activeWorkspaceId: id,
        });
        return id;
      },

      switchWorkspace: (id: string) => {
        if (get().workspaces.some((w) => w.id === id)) {
          set({ activeWorkspaceId: id });
        }
      },

      renameWorkspace: (id: string, name: string) => {
        set({
          workspaces: get().workspaces.map((w) =>
            w.id === id ? { ...w, name, updatedAt: Date.now() } : w
          ),
        });
      },

      deleteWorkspace: (id: string) => {
        const { workspaces, activeWorkspaceId } = get();
        const remaining = workspaces.filter((w) => w.id !== id);

        // Remove the workspace data from localStorage
        localStorage.removeItem(`caudalflow-workspace-${id}`);

        if (remaining.length === 0) {
          // No workspaces left — create a new default
          const newId = nanoid();
          const now = Date.now();
          set({
            workspaces: [{ id: newId, name: 'My Workspace', createdAt: now, updatedAt: now }],
            activeWorkspaceId: newId,
          });
        } else {
          set({
            workspaces: remaining,
            activeWorkspaceId:
              activeWorkspaceId === id ? remaining[0].id : activeWorkspaceId,
          });
        }
      },

      getActiveWorkspace: () => {
        const { workspaces, activeWorkspaceId } = get();
        return workspaces.find((w) => w.id === activeWorkspaceId);
      },
    }),
    {
      name: 'caudalflow-workspaces',
      partialize: (state) => ({
        workspaces: state.workspaces,
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    }
  )
);
