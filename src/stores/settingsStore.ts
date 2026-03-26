import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LLMConfig } from '../types/chat';

interface SettingsState {
  llmConfig: LLMConfig;
  showMinimap: boolean;
  showSystemPrompts: boolean;
  showSettings: boolean;
  updateLLMConfig: (config: Partial<LLMConfig>) => void;
  toggleMinimap: () => void;
  toggleSystemPrompts: () => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      llmConfig: {
        providerId: 'mock',
        endpoint: 'https://api.openai.com/v1',
        apiKey: '',
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 2048,
        mockDelay: 30,
      },
      showMinimap: true,
      showSystemPrompts: false,
      showSettings: false,

      updateLLMConfig: (config) => {
        const current = get().llmConfig;
        const merged = { ...current, ...config };

        // When switching providers, set sensible defaults for endpoint and model
        if (config.providerId && config.providerId !== current.providerId) {
          const defaults: Record<string, { endpoint: string; model: string }> = {
            openai: { endpoint: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
            anthropic: { endpoint: 'https://api.anthropic.com/v1', model: 'claude-sonnet-4-5-20250929' },
          };
          const d = defaults[config.providerId];
          if (d) {
            merged.endpoint = d.endpoint;
            merged.model = d.model;
          }
        }

        set({ llmConfig: merged });
      },

      toggleMinimap: () => set({ showMinimap: !get().showMinimap }),

      toggleSystemPrompts: () => set({ showSystemPrompts: !get().showSystemPrompts }),

      toggleSettings: () => set({ showSettings: !get().showSettings }),

      setShowSettings: (show) => set({ showSettings: show }),
    }),
    {
      name: 'caudalflow-settings',
      partialize: (state) => ({
        llmConfig: state.llmConfig,
        showMinimap: state.showMinimap,
        showSystemPrompts: state.showSystemPrompts,
      }),
    }
  )
);
