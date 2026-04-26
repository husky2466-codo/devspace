import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpaceman({ projectId, projectName, branch, mode }) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [hasKey, setHasKey] = useState(null); // null = unknown, true/false
  const [lastStats, setLastStats] = useState(null);
  const [error, setError] = useState(null);
  const cleanupRef = useRef([]);

  // Stable storage key derived from mode + projectId
  const storageKey = `ds.spaceman.chat.${mode}.${projectId ?? 'global'}`;

  useEffect(() => {
    // Load persisted messages and check key status in parallel
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { setMessages(JSON.parse(stored)); } catch {}
    }

    window.spaceman?.getKeyStatus().then(({ hasKey: hk }) => setHasKey(hk));
  // storageKey intentionally not in deps — we only want to load once on mount
  // (mode/projectId changes would require a page-level remount in practice)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up IPC listeners on unmount
  useEffect(() => {
    return () => cleanupRef.current.forEach((fn) => fn?.());
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || streaming) return;
    if (!hasKey) { setError('NO_KEY'); return; }

    setError(null);
    const userMsg = { role: 'user', content: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    // Persist after adding user message
    localStorage.setItem(storageKey, JSON.stringify(nextMessages));
    setStreaming(true);
    setStreamingText('');

    // Wire up streaming listeners — clean up any previous ones first
    cleanupRef.current.forEach((fn) => fn?.());
    cleanupRef.current = [];

    let accumulated = '';

    const offToken = window.spaceman.onToken((token) => {
      accumulated += token;
      setStreamingText(accumulated);
    });

    const offDone = window.spaceman.onDone((stats) => {
      setLastStats(stats);
      const assistantMsg = { role: 'assistant', content: accumulated };
      setMessages((prev) => {
        const updated = [...prev, assistantMsg];
        // Persist after assistant message is complete
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });
      setStreamingText('');
      setStreaming(false);
      cleanupRef.current.forEach((fn) => fn?.());
      cleanupRef.current = [];
    });

    const offError = window.spaceman.onError((msg) => {
      setError(msg);
      setStreaming(false);
      setStreamingText('');
      cleanupRef.current.forEach((fn) => fn?.());
      cleanupRef.current = [];
    });

    cleanupRef.current = [offToken, offDone, offError];

    const systemPrompt = mode === 'global'
      ? 'You are Spaceman, a senior engineering AI orchestrating across multiple projects in Dev-Space.ai. Be concise and practical.'
      : `You are Spaceman, a senior engineering AI working inside the "${projectName}" project (branch: ${branch ?? 'main'}) in Dev-Space.ai. Be concise and practical.`;

    try {
      await window.spaceman.chat({
        messages: nextMessages,
        model: 'claude-sonnet-4-6',  // Haiku: claude-haiku-4-5-20251001 — never Opus
        systemPrompt,
      });
    } catch (err) {
      const msg = err.message ?? String(err);
      if (msg !== 'NO_KEY') setError(msg);
      setStreaming(false);
      setStreamingText('');
    }
  }, [messages, streaming, hasKey, projectName, branch, mode, storageKey]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastStats(null);
    setError(null);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const saveKey = useCallback(async (key) => {
    try {
      await window.spaceman.setKey(key);
      setHasKey(true);
      setError(null);
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    messages,
    streaming,
    streamingText,
    hasKey,
    lastStats,
    error,
    sendMessage,
    clearMessages,
    saveKey,
  };
}
