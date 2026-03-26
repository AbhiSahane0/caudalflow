import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../chatStore';

beforeEach(() => {
  useChatStore.setState({ conversations: {} });
});

describe('chatStore', () => {
  describe('initConversation', () => {
    it('creates an empty conversation for a node', () => {
      useChatStore.getState().initConversation('node-1');
      const conv = useChatStore.getState().conversations['node-1'];
      expect(conv).toBeDefined();
      expect(conv.nodeId).toBe('node-1');
      expect(conv.messages).toEqual([]);
      expect(conv.isStreaming).toBe(false);
    });

    it('does not overwrite an existing conversation', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().addMessage('node-1', 'user', 'Hello');
      useChatStore.getState().initConversation('node-1'); // should be a no-op
      expect(useChatStore.getState().conversations['node-1'].messages).toHaveLength(1);
    });
  });

  describe('addMessage', () => {
    it('adds a message with correct role and content', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().addMessage('node-1', 'user', 'Hello');
      const messages = useChatStore.getState().getMessages('node-1');
      expect(messages).toHaveLength(1);
      expect(messages[0].role).toBe('user');
      expect(messages[0].content).toBe('Hello');
      expect(messages[0].id).toBeTruthy();
      expect(messages[0].timestamp).toBeGreaterThan(0);
    });

    it('returns the message id', () => {
      useChatStore.getState().initConversation('node-1');
      const id = useChatStore.getState().addMessage('node-1', 'assistant', 'Hi there');
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('appends to existing messages in order', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().addMessage('node-1', 'user', 'First');
      useChatStore.getState().addMessage('node-1', 'assistant', 'Second');
      useChatStore.getState().addMessage('node-1', 'user', 'Third');
      const messages = useChatStore.getState().getMessages('node-1');
      expect(messages).toHaveLength(3);
      expect(messages[0].content).toBe('First');
      expect(messages[1].content).toBe('Second');
      expect(messages[2].content).toBe('Third');
    });

    it('returns id but does not add message for non-existent conversation', () => {
      const id = useChatStore.getState().addMessage('non-existent', 'user', 'Hello');
      expect(typeof id).toBe('string');
      expect(useChatStore.getState().getMessages('non-existent')).toEqual([]);
    });
  });

  describe('appendToLastMessage', () => {
    it('appends a chunk to the last message content', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().addMessage('node-1', 'assistant', 'Hello');
      useChatStore.getState().appendToLastMessage('node-1', ' world');
      const messages = useChatStore.getState().getMessages('node-1');
      expect(messages[0].content).toBe('Hello world');
    });

    it('appends multiple chunks sequentially', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().addMessage('node-1', 'assistant', '');
      useChatStore.getState().appendToLastMessage('node-1', 'chunk1');
      useChatStore.getState().appendToLastMessage('node-1', ' chunk2');
      useChatStore.getState().appendToLastMessage('node-1', ' chunk3');
      const messages = useChatStore.getState().getMessages('node-1');
      expect(messages[0].content).toBe('chunk1 chunk2 chunk3');
    });

    it('does nothing for non-existent conversation', () => {
      // Should not throw
      useChatStore.getState().appendToLastMessage('non-existent', 'chunk');
    });

    it('does nothing for empty conversation', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().appendToLastMessage('node-1', 'chunk');
      expect(useChatStore.getState().getMessages('node-1')).toHaveLength(0);
    });
  });

  describe('setStreaming', () => {
    it('sets streaming flag to true', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().setStreaming('node-1', true);
      expect(useChatStore.getState().conversations['node-1'].isStreaming).toBe(true);
    });

    it('sets streaming flag to false', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().setStreaming('node-1', true);
      useChatStore.getState().setStreaming('node-1', false);
      expect(useChatStore.getState().conversations['node-1'].isStreaming).toBe(false);
    });

    it('does nothing for non-existent conversation', () => {
      useChatStore.getState().setStreaming('non-existent', true);
      expect(useChatStore.getState().conversations['non-existent']).toBeUndefined();
    });
  });

  describe('getMessages', () => {
    it('returns empty array for non-existent conversation', () => {
      expect(useChatStore.getState().getMessages('non-existent')).toEqual([]);
    });

    it('returns messages for an existing conversation', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().addMessage('node-1', 'user', 'Hello');
      const messages = useChatStore.getState().getMessages('node-1');
      expect(messages).toHaveLength(1);
    });
  });

  describe('removeConversation', () => {
    it('removes the conversation for a node', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().initConversation('node-2');
      useChatStore.getState().addMessage('node-1', 'user', 'Hello');
      useChatStore.getState().removeConversation('node-1');
      expect(useChatStore.getState().conversations['node-1']).toBeUndefined();
      expect(useChatStore.getState().conversations['node-2']).toBeDefined();
    });

    it('does nothing for non-existent conversation', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().removeConversation('non-existent');
      expect(useChatStore.getState().conversations['node-1']).toBeDefined();
    });
  });

  describe('setConversations', () => {
    it('replaces all conversations', () => {
      useChatStore.getState().initConversation('node-1');
      useChatStore.getState().addMessage('node-1', 'user', 'Hello');

      useChatStore.getState().setConversations({
        'node-2': { nodeId: 'node-2', messages: [], isStreaming: false },
      });

      expect(useChatStore.getState().conversations['node-1']).toBeUndefined();
      expect(useChatStore.getState().conversations['node-2']).toBeDefined();
    });
  });
});
