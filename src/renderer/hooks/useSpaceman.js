import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpaceman({ projectId, projectName, branch, mode }) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [hasKey, setHasKey] = useState(null); // null = unknown, true/false
  const [lastStats, setLastStats] = useState(null);
  const [error, setError] = useState(null);
  const cleanupRef = useRef([]);

  useEffect(() => {
    window.spaceman?.getKeyStatus().then(({ hasKey: hk }) => setHasKey(hk));
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
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: accumulated },
      ]);
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
        model: 'claude-sonnet-4-6',
        systemPrompt,
      });
    } catch (err) {
      if (err.message !== 'NO_KEY') setError(err.message);
      setStreaming(false);
      setStreamingText('');
    }
  }, [messages, streaming, hasKey, projectName, branch, mode]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastStats(null);
    setError(null);
  }, []);

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
