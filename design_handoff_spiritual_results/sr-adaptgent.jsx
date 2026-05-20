// sr-adaptgent.jsx — Floating AdaptGent helper for Spiritual Results

const B = window.BRAND;

/* ── Lantern Icon ─────────────────────────────────────── */
function LanternIcon({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3.5a2 2 0 0 1 4 0" />
      <line x1="12" y1="2" x2="12" y2="3.5" />
      <line x1="8.5" y1="6" x2="15.5" y2="6" />
      <rect x="9" y="6" width="6" height="10" rx="1" />
      <line x1="8.5" y1="16" x2="15.5" y2="16" />
      <line x1="10" y1="18" x2="14" y2="18" />
      <circle cx="12" cy="11" r="1.2" fill={color} stroke="none" opacity="0.9" />
    </svg>
  );
}

function SendIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ── Starter prompts ──────────────────────────────────── */
const STARTERS = [
  "Explain this passage to me.",
  "Suggest a reflection question.",
  "I don't know what this term means.",
  "What other traditions say something similar?",
];

const AG_SYSTEM = "You are AdaptGent, a gentle contemplative helper for Spiritual Results (spiritualresults.org). Help users navigate the site, understand module lessons, and learn about wisdom traditions. Keep responses brief (2-3 sentences), warm, and quiet. If asked about deep AI coaching, gently direct to spiritualresults.ai. Never be preachy.";

/* ── AdaptGent Component ──────────────────────────────── */
function AdaptGent() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [btnHov, setBtnHov] = React.useState(false);
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = [
        { role: 'user', content: AG_SYSTEM },
        { role: 'assistant', content: 'I understand. I am AdaptGent, here to help gently.' },
        ...newMsgs,
      ];
      const response = await window.claude.complete({ messages: apiMessages });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Forgive me — I could not gather my thoughts. Please try again in a moment.',
      }]);
    }
    setLoading(false);
  };

  /* ── Panel ── */
  const panelEl = open && (
    <div style={{
      position: 'fixed', bottom: '92px', right: '24px',
      width: 'min(400px, calc(100vw - 48px))',
      maxHeight: 'calc(100vh - 140px)',
      background: B.surface, borderRadius: '20px',
      border: `1px solid rgba(139,106,31,0.12)`,
      boxShadow: '0 12px 48px rgba(42,34,24,0.12)',
      display: 'flex', flexDirection: 'column',
      zIndex: 1001, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 22px', borderBottom: `1px solid rgba(139,106,31,0.08)`,
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: B.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LanternIcon size={16} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '17px',
            fontWeight: 400, color: B.textPrimary,
          }}>AdaptGent</p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '11px',
            color: B.textTertiary,
          }}>Here to help with the lessons.</p>
        </div>
        <button onClick={() => setOpen(false)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
          color: B.textTertiary, fontSize: '18px', lineHeight: 1,
        }}>×</button>
      </div>

      {/* Body */}
      <div ref={chatEndRef} style={{
        flex: 1, overflowY: 'auto', padding: '18px 22px',
        minHeight: '200px', maxHeight: '380px',
      }}>
        {messages.length === 0 ? (
          <div>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '13px',
              color: B.textTertiary, marginBottom: '16px',
            }}>How can I help you today?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {STARTERS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  background: B.bg, border: `1px solid ${B.borderGold}`,
                  borderRadius: '100px', padding: '10px 18px',
                  fontFamily: "'Inter', sans-serif", fontSize: '13px',
                  color: B.textSecondary, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.25s',
                }}
                  onMouseEnter={e => { e.target.style.borderColor = B.goldStrong; e.target.style.color = B.gold; }}
                  onMouseLeave={e => { e.target.style.borderColor = B.borderGold; e.target.style.color = B.textSecondary; }}
                >{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}>
                <div style={{
                  padding: '11px 16px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? B.gold : B.bg,
                  color: m.role === 'user' ? '#fff' : B.textSecondary,
                  fontFamily: "'Inter', sans-serif", fontSize: '14px',
                  lineHeight: 1.6,
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{
                  padding: '11px 16px', borderRadius: '16px 16px 16px 4px',
                  background: B.bg, color: B.textTertiary,
                  fontFamily: "'Inter', sans-serif", fontSize: '14px',
                }}>
                  <span className="ag-dots">· · ·</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '14px 18px', borderTop: `1px solid rgba(139,106,31,0.06)`,
      }}>
        <div style={{
          display: 'flex', gap: '10px', alignItems: 'center',
        }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask gently\u2026"
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '12px',
              border: `1px solid ${B.borderGold}`, background: B.bg,
              fontFamily: "'Inter', sans-serif", fontSize: '14px',
              color: B.textPrimary, outline: 'none',
            }}
          />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: input.trim() ? B.goldStrong : B.surfaceAlt,
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.25s',
            }}>
            <SendIcon size={16} color={input.trim() ? B.darkOnGold : B.textTertiary} />
          </button>
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '11px',
          color: B.textTertiary, marginTop: '10px', textAlign: 'center',
        }}>Asking gently, no records kept.</p>
      </div>
    </div>
  );

  /* ── Floating Button ── */
  return (
    <>
      {panelEl}
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        aria-label="Open AdaptGent helper"
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '56px', height: '56px', borderRadius: '50%',
          background: B.gold, border: 'none', cursor: 'pointer',
          boxShadow: btnHov
            ? '0 6px 24px rgba(139,106,31,0.30)'
            : '0 4px 16px rgba(139,106,31,0.20)',
          transform: btnHov ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
        {open
          ? <span style={{ color: '#fff', fontSize: '24px', lineHeight: 1 }}>×</span>
          : <LanternIcon size={24} color="#fff" />
        }
      </button>
    </>
  );
}

Object.assign(window, { AdaptGent });
