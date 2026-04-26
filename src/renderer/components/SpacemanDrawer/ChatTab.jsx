import { useRef, useEffect, useState } from 'react';
import { useSpaceman } from '../../hooks/useSpaceman.js';

function KeySetupBanner({ onSave }) {
  const [val, setVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const handleSave = async () => {
    if (!val.startsWith('sk-ant-')) { setErr('Must start with sk-ant-'); return; }
    setSaving(true);
    setErr(null);
    try {
      await onSave(val.trim());
    } catch (e) {
      setErr(e.message);
      setSaving(false);
    }
  };

  return (
    <div style={{
      margin: 14,
      padding: 14,
      border: '1px solid var(--border)',
      background: 'var(--bg-sunken)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--text-dim)', letterSpacing: '0.14em', marginBottom: 10,
      }}>
        API KEY REQUIRED
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
        Paste your Anthropic API key. It will be stored in the macOS Keychain — never on disk or in the app bundle.
      </div>
      <input
        type="password"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        placeholder="sk-ant-..."
        style={{
          width: '100%', boxSizing: 'border-box',
          background: 'var(--bg)', border: '1px solid var(--border)',
          color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11,
          padding: '6px 8px', marginBottom: 8, outline: 'none',
        }}
      />
      {err && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--err)', marginBottom: 8 }}>
          {err}
        </div>
      )}
      <button
        onClick={handleSave}
        disabled={saving || !val}
        style={{
          all: 'unset', cursor: saving || !val ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          padding: '5px 14px',
          background: saving || !val ? 'var(--border)' : 'var(--accent)',
          color: saving || !val ? 'var(--text-dim)' : 'var(--bg)',
        }}
      >
        {saving ? 'SAVING...' : 'SAVE TO KEYCHAIN'}
      </button>
    </div>
  );
}

function MessageBubble({ msg, accentColor }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        letterSpacing: '0.1em',
        color: isUser ? 'var(--text-dim)' : accentColor,
        marginBottom: 5,
      }}>
        {isUser ? 'you' : 'spaceman · sonnet'}
      </div>
      <div style={{
        fontSize: 12.5, lineHeight: 1.6,
        color: 'var(--text)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function StreamingBubble({ text, accentColor }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        letterSpacing: '0.1em', color: accentColor, marginBottom: 5,
      }}>
        spaceman · sonnet
      </div>
      <div style={{
        fontSize: 12.5, lineHeight: 1.6, color: 'var(--text)',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {text}
        <span style={{
          display: 'inline-block', width: 7, height: 13,
          background: accentColor, verticalAlign: 'text-bottom',
          marginLeft: 1, animation: 'smCaret 1s step-end infinite',
        }} />
      </div>
    </div>
  );
}

export default function ChatTab({ mode, projectName, branch, onPromptRef }) {
  const { messages, streaming, streamingText, hasKey, error, sendMessage, clearMessages, saveKey } =
    useSpaceman({ projectName, branch, mode });

  const bottomRef = useRef(null);
  const accentColor = mode === 'global' ? 'var(--accent-global)' : 'var(--accent)';

  // Auto-scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streamingText]);

  // Expose sendMessage upward so the prompt strip can call it
  useEffect(() => {
    if (onPromptRef) onPromptRef.current = sendMessage;
  }, [sendMessage, onPromptRef]);

  if (hasKey === false) {
    return <KeySetupBanner onSave={saveKey} />;
  }

  if (hasKey === null) {
    return (
      <div style={{ padding: 24, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
        LOADING...
      </div>
    );
  }

  const showEmpty = messages.length === 0 && !streaming;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 0' }}>
        {showEmpty && (
          <div style={{ paddingTop: 32, textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-dim)', letterSpacing: '0.14em', marginBottom: 8,
            }}>
              {mode === 'global' ? 'GLOBAL SPACEMAN' : 'SPACEMAN'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>
              {mode === 'global'
                ? 'Dispatching across all projects.'
                : `Working in ${projectName ?? 'this project'}.`}
              <br />Type below to start.
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} accentColor={accentColor} />
        ))}

        {streaming && streamingText && (
          <StreamingBubble text={streamingText} accentColor={accentColor} />
        )}

        {streaming && !streamingText && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: accentColor, letterSpacing: '0.08em',
            animation: 'smPulse 1.4s ease-in-out infinite',
          }}>
            thinking...
          </div>
        )}

        {error && error !== 'NO_KEY' && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--err)', padding: '8px 0',
          }}>
            ✗ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Footer: token stats + clear */}
      {messages.length > 0 && (
        <div style={{
          flexShrink: 0, padding: '6px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: 9.5,
          color: 'var(--text-dim)',
        }}>
          <span>{messages.length} msgs</span>
          <span style={{ flex: 1 }} />
          <button
            onClick={clearMessages}
            style={{
              all: 'unset', cursor: 'pointer',
              color: 'var(--text-dim)', fontSize: 9.5,
              fontFamily: 'var(--font-mono)',
            }}
          >
            clear ×
          </button>
        </div>
      )}
    </div>
  );
}
