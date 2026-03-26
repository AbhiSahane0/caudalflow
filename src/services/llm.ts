import type { ChatMessage } from '../types/chat';
import type { StreamCallbacks } from './providers/types';
import { getProvider } from './providers/registry';
import { useSettingsStore } from '../stores/settingsStore';

export function streamChat(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  signal: AbortSignal
) {
  const config = useSettingsStore.getState().llmConfig;
  const provider = getProvider(config.providerId);

  if (!provider) {
    callbacks.onError(new Error(`Unknown provider: ${config.providerId}`));
    return;
  }

  provider.streamChat(messages, config, callbacks, signal);
}
