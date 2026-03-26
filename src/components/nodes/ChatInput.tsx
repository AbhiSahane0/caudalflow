import { useState, useCallback } from 'react';
import { Send, Square } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';

interface ChatInputProps {
  nodeId: string;
  onSend: (message: string) => void;
  onCancel: () => void;
}

export function ChatInput({ nodeId, onSend, onCancel }: ChatInputProps) {
  const [input, setInput] = useState('');
  const isStreaming = useChatStore(
    (s) => s.conversations[nodeId]?.isStreaming ?? false
  );

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput('');
    onSend(trimmed);
  }, [input, isStreaming, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="nodrag nopan border-t border-neutral-700/50 p-2">
      <div className="flex items-end gap-1.5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          rows={1}
          className="flex-1 resize-none bg-neutral-800/50 text-sm text-neutral-200 rounded-lg px-3 py-2 placeholder-neutral-500 border border-neutral-700/50 focus:border-accent-500/50 focus:outline-none transition-colors"
          style={{ minHeight: '36px', maxHeight: '100px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 100) + 'px';
          }}
        />
        {isStreaming ? (
          <button
            onClick={onCancel}
            className="shrink-0 p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Stop"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 p-2 rounded-lg bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Send"
          >
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
