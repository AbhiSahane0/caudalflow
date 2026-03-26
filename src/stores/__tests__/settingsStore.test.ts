import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../settingsStore';

const INITIAL_CONFIG = {
  providerId: 'mock',
  endpoint: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  mockDelay: 30,
};

beforeEach(() => {
  useSettingsStore.setState({
    llmConfig: { ...INITIAL_CONFIG },
    showMinimap: true,
    showSystemPrompts: false,
    showSettings: false,
  });
});

describe('settingsStore', () => {
  describe('updateLLMConfig', () => {
    it('merges partial config updates', () => {
      useSettingsStore.getState().updateLLMConfig({ temperature: 0.9 });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.temperature).toBe(0.9);
      expect(config.providerId).toBe('mock'); // unchanged
      expect(config.model).toBe('gpt-4o-mini'); // unchanged
    });

    it('sets OpenAI defaults when switching to openai provider', () => {
      useSettingsStore.getState().updateLLMConfig({ providerId: 'openai' });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.providerId).toBe('openai');
      expect(config.endpoint).toBe('https://api.openai.com/v1');
      expect(config.model).toBe('gpt-4o-mini');
    });

    it('sets Anthropic defaults when switching to anthropic provider', () => {
      useSettingsStore.getState().updateLLMConfig({ providerId: 'anthropic' });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.providerId).toBe('anthropic');
      expect(config.endpoint).toBe('https://api.anthropic.com/v1');
      expect(config.model).toBe('claude-sonnet-4-5-20250929');
    });

    it('does not override endpoint/model when staying on the same provider', () => {
      useSettingsStore.getState().updateLLMConfig({ providerId: 'openai' });
      useSettingsStore.getState().updateLLMConfig({ model: 'gpt-4o' });
      useSettingsStore.getState().updateLLMConfig({ endpoint: 'https://custom.endpoint.com' });

      // Updating non-provider fields should not reset endpoint/model
      useSettingsStore.getState().updateLLMConfig({ temperature: 0.5 });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.model).toBe('gpt-4o');
      expect(config.endpoint).toBe('https://custom.endpoint.com');
    });

    it('does not apply provider defaults for unknown providers', () => {
      useSettingsStore.getState().updateLLMConfig({
        providerId: 'custom-provider',
        endpoint: 'https://custom.com/api',
        model: 'custom-model',
      });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.providerId).toBe('custom-provider');
      expect(config.endpoint).toBe('https://custom.com/api');
      expect(config.model).toBe('custom-model');
    });

    it('preserves apiKey when switching providers', () => {
      useSettingsStore.getState().updateLLMConfig({ apiKey: 'sk-secret' });
      useSettingsStore.getState().updateLLMConfig({ providerId: 'anthropic' });
      expect(useSettingsStore.getState().llmConfig.apiKey).toBe('sk-secret');
    });
  });

  describe('toggleMinimap', () => {
    it('toggles minimap from true to false', () => {
      expect(useSettingsStore.getState().showMinimap).toBe(true);
      useSettingsStore.getState().toggleMinimap();
      expect(useSettingsStore.getState().showMinimap).toBe(false);
    });

    it('toggles minimap from false to true', () => {
      useSettingsStore.getState().toggleMinimap(); // true → false
      useSettingsStore.getState().toggleMinimap(); // false → true
      expect(useSettingsStore.getState().showMinimap).toBe(true);
    });
  });

  describe('toggleSystemPrompts', () => {
    it('toggles system prompts visibility', () => {
      expect(useSettingsStore.getState().showSystemPrompts).toBe(false);
      useSettingsStore.getState().toggleSystemPrompts();
      expect(useSettingsStore.getState().showSystemPrompts).toBe(true);
      useSettingsStore.getState().toggleSystemPrompts();
      expect(useSettingsStore.getState().showSystemPrompts).toBe(false);
    });
  });

  describe('toggleSettings', () => {
    it('toggles settings panel visibility', () => {
      expect(useSettingsStore.getState().showSettings).toBe(false);
      useSettingsStore.getState().toggleSettings();
      expect(useSettingsStore.getState().showSettings).toBe(true);
    });
  });

  describe('setShowSettings', () => {
    it('sets settings visibility explicitly', () => {
      useSettingsStore.getState().setShowSettings(true);
      expect(useSettingsStore.getState().showSettings).toBe(true);
      useSettingsStore.getState().setShowSettings(false);
      expect(useSettingsStore.getState().showSettings).toBe(false);
    });
  });
});
