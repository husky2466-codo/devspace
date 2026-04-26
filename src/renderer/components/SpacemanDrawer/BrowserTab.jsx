import { useState, useRef, useEffect, useCallback } from 'react';

const KIND_GLYPH = { html: '◐', file: '▤', img: '▣', link: '↗' };

function NavBtn({ label, disabled, onClick, title }) {
  return (
    <span
      title={title}
      onClick={disabled ? undefined : onClick}
      style={{
        padding: '2px 7px',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        cursor: disabled ? 'default' : 'pointer',
        color: disabled ? 'var(--text-dim)' : 'var(--text-muted)',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

export default function BrowserTab({ items }) {
  const [url, setUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const webviewRef = useRef(null);

  const navigate = useCallback((target) => {
    let finalUrl = target.trim();
    if (!finalUrl) return;
    // If no protocol and not localhost, add https://
    if (!/^https?:\/\//.test(finalUrl) && !/^localhost/.test(finalUrl) && !/^file:\/\//.test(finalUrl)) {
      // Check if it looks like a URL (has a dot or colon) vs a search query
      if (/\.\w{2,}/.test(finalUrl) || /:\d+/.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      } else {
        finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(finalUrl);
      }
    }
    setActiveUrl(finalUrl);
    setUrl(finalUrl);
    setLoading(true);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') navigate(url);
  };

  // Wire webview events
  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv || !activeUrl) return;

    const onStart = () => setLoading(true);
    const onStop = () => {
      setLoading(false);
      setCanGoBack(wv.canGoBack());
      setCanGoForward(wv.canGoForward());
      setUrl(wv.getURL());
    };
    const onFail = () => setLoading(false);

    wv.addEventListener('did-start-loading', onStart);
    wv.addEventListener('did-stop-loading', onStop);
    wv.addEventListener('did-fail-load', onFail);

    return () => {
      wv.removeEventListener('did-start-loading', onStart);
      wv.removeEventListener('did-stop-loading', onStop);
      wv.removeEventListener('did-fail-load', onFail);
    };
  }, [activeUrl]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Nav bar */}
      <div style={{
        flexShrink: 0,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '0 6px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-pane)',
      }}>
        <NavBtn label="←" disabled={!canGoBack} title="Back" onClick={() => webviewRef.current?.goBack()} />
        <NavBtn label="→" disabled={!canGoForward} title="Forward" onClick={() => webviewRef.current?.goForward()} />
        <NavBtn
          label={loading ? '✕' : '↺'}
          title={loading ? 'Stop' : 'Reload'}
          onClick={() => loading ? webviewRef.current?.stop() : webviewRef.current?.reload()}
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter URL or search…"
          style={{
            flex: 1,
            background: 'var(--bg-sunken)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            padding: '3px 8px',
            outline: 'none',
          }}
        />
        <span
          onClick={() => navigate(url)}
          style={{
            padding: '3px 10px',
            background: 'var(--accent)',
            color: 'var(--bg)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            cursor: 'pointer',
            flexShrink: 0,
            letterSpacing: '0.08em',
            userSelect: 'none',
          }}
        >
          OPEN
        </span>
      </div>

      {/* Webview area or empty state */}
      {activeUrl ? (
        <webview
          ref={webviewRef}
          src={activeUrl}
          style={{ flex: 1, minHeight: 0, width: '100%' }}
        />
      ) : (
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {!items?.length ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-dim)',
                letterSpacing: '0.14em',
                marginBottom: 8,
              }}>
                NO ITEMS YET
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Type a URL above, or files and links<br />opened by agents appear here.
              </div>
            </div>
          ) : (
            <div style={{ padding: 14 }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-dim)',
                letterSpacing: '0.14em',
                marginBottom: 10,
              }}>
                RECENTLY OPENED
              </div>
              {items.map((it, i) => {
                const live = /localhost|dev-space:\/\/|file:\/\//.test(it.path);
                return (
                  <div
                    key={i}
                    onClick={() => navigate(it.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 0',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      color: live ? 'var(--accent)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      width: 16,
                      textAlign: 'center',
                      flexShrink: 0,
                    }}>
                      {KIND_GLYPH[it.kind] ?? '↗'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12,
                        color: 'var(--text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {it.name}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-dim)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {it.path}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8.5,
                      padding: '1px 4px',
                      color: live ? 'var(--accent)' : 'var(--text-muted)',
                      border: `1px solid ${live ? 'var(--accent)' : 'var(--border)'}`,
                      background: live ? 'var(--accent-soft)' : 'transparent',
                      flexShrink: 0,
                    }}>
                      {live ? 'LIVE' : 'WEB'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
