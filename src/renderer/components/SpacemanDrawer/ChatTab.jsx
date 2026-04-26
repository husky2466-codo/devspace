import { useRef, useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

// Shared markdown component map — applies inline styles to all rendered elements
function makeMarkdownComponents() {
  return {
    p: ({ children }) => (
      <p style={{ margin: '0 0 8px', lastChild: 'marginBottom: 0' }}>{children}</p>
    ),
    code: ({ inline, children, ...props }) => {
      if (inline) {
        return (
          <code style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
            padding: '1px 4px',
          }} {...props}>{children}</code>
        );
      }
      return (
        <code style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          background: 'none', padding: 0,
        }} {...props}>{children}</code>
      );
    },
    pre: ({ children }) => (
      <pre style={{
        background: 'var(--bg-sunken)',
        border: '1px solid var(--border)',
        padding: '10px 12px',
        margin: '8px 0',
        overflowX: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
      }}>{children}</pre>
    ),
    ul: ({ children }) => (
      <ul style={{ paddingLeft: 20, margin: '4px 0' }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol style={{ paddingLeft: 20, margin: '4px 0' }}>{children}</ol>
    ),
    li: ({ children }) => (
      <li style={{ marginBottom: 2 }}>{children}</li>
    ),
    h1: ({ children }) => (
      <h1 style={{ fontSize: 12.5, fontWeight: 600, margin: '0 0 6px' }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: 12.5, fontWeight: 600, margin: '0 0 6px' }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontSize: 12.5, fontWeight: 600, margin: '0 0 6px' }}>{children}</h3>
    ),
    strong: ({ children }) => (
      <strong style={{ fontWeight: 600 }}>{children}</strong>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        style={{ color: 'var(--accent)', textDecoration: 'none' }}
        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
      >{children}</a>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{
        borderLeft: '2px solid var(--border)',
        paddingLeft: 10,
        margin: '4px 0',
        color: 'var(--text-muted)',
      }}>{children}</blockquote>
    ),
    hr: () => (
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
    ),
    table: ({ children }) => (
      <table style={{
        width: '100%', borderCollapse: 'collapse', fontSize: 11,
      }}>{children}</table>
    ),
    th: ({ children }) => (
      <th style={{
        border: '1px solid var(--border)', padding: '4px 8px',
        textAlign: 'left', background: 'var(--bg-sunken)', fontWeight: 600,
      }}>{children}</th>
    ),
    td: ({ children }) => (
      <td style={{
        border: '1px solid var(--border)', padding: '4px 8px', textAlign: 'left',
      }}>{children}</td>
    ),
  };
}

// Clipboard SVG icon (11x11)
function IconClipboard() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="7" height="8" rx="0.5" />
      <path d="M3 3.5H2a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-1" />
    </svg>
  );
}

// Checkmark SVG icon (11x11)
function IconCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,6 4.5,8.5 9,3" />
    </svg>
  );
}

const mdComponents = makeMarkdownComponents();

function MessageBubble({ msg, accentColor }) {
  const isUser = msg.role === 'user';
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [msg.content]);

  return (
    <div
      style={{ marginBottom: 16, position: 'relative' }}
      onMouseEnter={() => !isUser && setHovered(true)}
      onMouseLeave={() => !isUser && setHovered(false)}
    >
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        letterSpacing: '0.1em',
        color: isUser ? 'var(--text-dim)' : accentColor,
        marginBottom: 5,
        userSelect: 'none',
      }}>
        {isUser ? 'you' : 'spaceman · sonnet'}
      </div>

      {isUser ? (
        <div style={{
          fontSize: 12.5, lineHeight: 1.6,
          color: 'var(--text)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          userSelect: 'text',
          cursor: 'text',
        }}>
          {msg.content}
        </div>
      ) : (
        <div style={{
          fontSize: 12.5, lineHeight: 1.6,
          color: 'var(--text)',
          wordBreak: 'break-word',
          userSelect: 'text',
          cursor: 'text',
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {msg.content}
          </ReactMarkdown>
        </div>
      )}

      {/* Copy button — assistant messages only, visible on hover */}
      {!isUser && hovered && (
        <button
          onClick={handleCopy}
          title={copied ? 'Copied' : 'Copy'}
          style={{
            position: 'absolute', top: 0, right: 0,
            background: 'transparent',
            border: '1px solid var(--border)',
            padding: '3px 6px',
            cursor: 'pointer',
            color: copied ? 'var(--text)' : 'var(--text-dim)',
            display: 'flex', alignItems: 'center',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = copied ? 'var(--text)' : 'var(--text-dim)'}
        >
          {copied ? <IconCheck /> : <IconClipboard />}
        </button>
      )}
    </div>
  );
}

function StreamingBubble({ text, accentColor }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        letterSpacing: '0.1em', color: accentColor, marginBottom: 5,
        userSelect: 'none',
      }}>
        spaceman · sonnet
      </div>
      <div style={{
        fontSize: 12.5, lineHeight: 1.6, color: 'var(--text)',
        wordBreak: 'break-word',
        userSelect: 'text', cursor: 'text',
      }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {text}
        </ReactMarkdown>
        <span style={{
          display: 'inline-block', width: 7, height: 13,
          background: accentColor, verticalAlign: 'text-bottom',
          marginLeft: 1, animation: 'smCaret 1s step-end infinite',
        }} />
      </div>
    </div>
  );
}

export default function ChatTab({ mode, projectId, projectName, branch, projects, onPromptRef }) {
  const [scopedIds, setScopedIds] = useState([]);

  const scopedProjectNames = scopedIds.length > 0
    ? projects?.filter((p) => scopedIds.includes(p.id)).map((p) => p.name).join(', ')
    : null;

  const { messages, streaming, streamingText, hasKey, error, sendMessage, clearMessages, saveKey } =
    useSpaceman({ projectId, projectName, branch, mode, scopedProjectNames });

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
      {/* Scope chips — global mode only */}
      {mode === 'global' && projects?.length > 0 && (
        <div style={{
          flexShrink: 0,
          padding: '6px 10px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          background: 'var(--bg-sunken)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: 'var(--text-dim)', letterSpacing: '0.1em',
            alignSelf: 'center', marginRight: 4,
          }}>
            SCOPE:
          </span>
          {projects.map((p) => {
            const active = scopedIds.length === 0 || scopedIds.includes(p.id);
            return (
              <span
                key={p.id}
                onClick={() => setScopedIds((prev) => {
                  if (prev.length === 0) return [p.id];
                  if (prev.includes(p.id)) {
                    const next = prev.filter((id) => id !== p.id);
                    return next.length === 0 ? [] : next;
                  }
                  return [...prev, p.id];
                })}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5,
                  padding: '2px 7px', cursor: 'pointer',
                  border: `1px solid ${active ? 'var(--accent-global)' : 'var(--border)'}`,
                  color: active ? 'var(--accent-global)' : 'var(--text-dim)',
                  background: active ? 'var(--accent-global-soft)' : 'transparent',
                  userSelect: 'none',
                }}
              >
                {p.name}
              </span>
            );
          })}
          {scopedIds.length > 0 && (
            <span
              onClick={() => setScopedIds([])}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'var(--text-dim)', cursor: 'pointer',
                alignSelf: 'center', marginLeft: 2,
              }}
            >
              all ×
            </span>
          )}
        </div>
      )}
      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 0', userSelect: 'text' }}>
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
            margin: '8px 0',
            padding: '8px 10px',
            background: 'color-mix(in srgb, var(--err) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--err) 30%, transparent)',
            borderLeft: '2px solid var(--err)',
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--err)', lineHeight: 1.5,
            userSelect: 'text', cursor: 'text',
          }}>
            {error}
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
