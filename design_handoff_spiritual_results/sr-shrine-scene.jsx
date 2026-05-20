// sr-shrine-scene.jsx — Immersive shrine room view

/* ── Brand (shared) ── */
const B = window.BRAND || {
  bg: '#FAF7EE', surface: '#FFFFFF', surfaceAlt: '#F2EBD8',
  textPrimary: '#2A2218', textSecondary: '#5C4F3D', textTertiary: '#8A7A66',
  gold: '#8B6A1F', goldStrong: '#B8893C', goldHover: '#A07728',
  borderGold: 'rgba(139,106,31,0.20)', sage: '#5E7148',
  amber: '#A85C1B', darkOnGold: '#1F1810',
};

/* ── 7 Theme Backgrounds (atmospheric CSS) ────────────── */
const THEMES = [
  {
    id: 'candlelit-chapel', name: 'Candlelit Chapel',
    desc: 'Soft stone arches, a single tall candle on a stone altar, dim warm light.',
    bg: [
      'radial-gradient(ellipse 30% 35% at 50% 38%, rgba(200,155,60,0.22) 0%, transparent 70%)',
      'radial-gradient(ellipse 60% 30% at 50% 95%, rgba(20,14,6,0.7) 0%, transparent 60%)',
      'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(60,42,16,0.4) 0%, transparent 80%)',
      'linear-gradient(180deg, #18110a 0%, #2c1f0e 30%, #3a2912 50%, #221608 80%, #0e0904 100%)',
    ].join(', '),
    accent: 'rgba(200,155,60,0.35)',
  },
  {
    id: 'forest-grove', name: 'Forest Grove',
    desc: 'Dappled green-gold sunlight, mossy stones, distant trees.',
    bg: [
      'radial-gradient(ellipse 25% 30% at 35% 25%, rgba(140,160,50,0.18) 0%, transparent 70%)',
      'radial-gradient(ellipse 20% 25% at 65% 35%, rgba(170,150,40,0.12) 0%, transparent 60%)',
      'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(10,16,6,0.7) 0%, transparent 60%)',
      'linear-gradient(180deg, #141e0c 0%, #1e2c12 25%, #253216 50%, #182210 80%, #0c1406 100%)',
    ].join(', '),
    accent: 'rgba(140,160,50,0.30)',
  },
  {
    id: 'mountain-altar', name: 'Mountain Altar',
    desc: 'Sunrise behind a single rock cairn, far peaks in haze.',
    bg: [
      'radial-gradient(ellipse 60% 25% at 50% 30%, rgba(220,160,80,0.20) 0%, transparent 70%)',
      'radial-gradient(ellipse 80% 30% at 50% 100%, rgba(60,50,70,0.6) 0%, transparent 60%)',
      'linear-gradient(180deg, #2a1e2e 0%, #3a2838 15%, #8a5a30 35%, #c4844a 45%, #8a5a30 55%, #3a3040 75%, #1a1420 100%)',
    ].join(', '),
    accent: 'rgba(220,160,80,0.30)',
  },
  {
    id: 'garden', name: 'Garden',
    desc: 'A low stone bench, white roses, a small fountain, twilight.',
    bg: [
      'radial-gradient(ellipse 40% 35% at 50% 50%, rgba(120,100,140,0.15) 0%, transparent 70%)',
      'radial-gradient(ellipse 25% 20% at 45% 65%, rgba(180,170,200,0.10) 0%, transparent 60%)',
      'radial-gradient(ellipse 80% 35% at 50% 100%, rgba(16,20,12,0.7) 0%, transparent 60%)',
      'linear-gradient(180deg, #1c1828 0%, #252230 20%, #2a3020 45%, #1e2818 65%, #141820 85%, #0e0e16 100%)',
    ].join(', '),
    accent: 'rgba(150,130,170,0.30)',
  },
  {
    id: 'hearth-room', name: 'Hearth Room',
    desc: 'A low fire in a stone fireplace, a sheepskin rug, winter quiet.',
    bg: [
      'radial-gradient(ellipse 35% 30% at 50% 60%, rgba(200,110,40,0.25) 0%, transparent 70%)',
      'radial-gradient(ellipse 20% 15% at 50% 55%, rgba(240,150,50,0.15) 0%, transparent 60%)',
      'radial-gradient(ellipse 80% 35% at 50% 100%, rgba(20,12,8,0.7) 0%, transparent 60%)',
      'linear-gradient(180deg, #161010 0%, #201410 25%, #2c1c10 45%, #3a2414 55%, #201410 75%, #100a08 100%)',
    ].join(', '),
    accent: 'rgba(200,110,40,0.35)',
  },
  {
    id: 'seashore', name: 'Seashore at Dawn',
    desc: 'Wet sand, soft mist, a piece of driftwood.',
    bg: [
      'radial-gradient(ellipse 70% 20% at 50% 35%, rgba(200,170,120,0.15) 0%, transparent 70%)',
      'radial-gradient(ellipse 80% 25% at 50% 100%, rgba(140,160,170,0.20) 0%, transparent 60%)',
      'linear-gradient(180deg, #1a2028 0%, #283038 20%, #4a5058 35%, #8a8070 45%, #a09480 50%, #6a7078 60%, #384048 80%, #1a2028 100%)',
    ].join(', '),
    accent: 'rgba(180,160,120,0.25)',
  },
  {
    id: 'desert-oasis', name: 'Desert Oasis',
    desc: 'A single palm, a still pool, twilight pink sky, the first star.',
    bg: [
      'radial-gradient(ellipse 50% 30% at 50% 25%, rgba(200,120,140,0.18) 0%, transparent 70%)',
      'radial-gradient(ellipse 30% 20% at 50% 70%, rgba(80,100,120,0.15) 0%, transparent 60%)',
      'linear-gradient(180deg, #2a1828 0%, #4a2838 18%, #8a4858 30%, #c08060 42%, #d0a070 48%, #a07850 58%, #4a3828 75%, #1a1418 100%)',
    ].join(', '),
    accent: 'rgba(200,120,140,0.30)',
  },
];

/* ── Object SVG Components ────────────────────────────── */

function ShrineCandle({ lit = true, scale = 1 }) {
  return (
    <div style={{ position: 'relative', width: 24 * scale, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {lit && <div style={{
        position: 'absolute', top: -30 * scale, left: '50%', transform: 'translateX(-50%)',
        width: 60 * scale, height: 60 * scale, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,200,80,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />}
      {lit && <div style={{
        width: 10 * scale, height: 20 * scale, marginBottom: -3 * scale,
        background: 'radial-gradient(ellipse at 50% 80%, #ffe680 0%, #ff9d00 40%, transparent 100%)',
        borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
        animation: 'candleFlicker 2.5s ease-in-out infinite',
        filter: 'blur(0.5px)',
      }} />}
      <div style={{
        width: 14 * scale, height: 52 * scale,
        background: 'linear-gradient(180deg, #f5e8cc 0%, #e8d8b0 50%, #dcc898 100%)',
        borderRadius: `${3*scale}px ${3*scale}px ${2*scale}px ${2*scale}px`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }} />
      <div style={{
        width: 22 * scale, height: 6 * scale,
        background: 'linear-gradient(180deg, #8a7a60 0%, #6a5a40 100%)',
        borderRadius: `0 0 ${3*scale}px ${3*scale}px`,
      }} />
    </div>
  );
}

function ShrineParchment({ text = '', scale = 1 }) {
  return (
    <div style={{
      width: 140 * scale, padding: `${14*scale}px ${16*scale}px`,
      background: 'linear-gradient(145deg, #f5ecd4 0%, #ede0c0 100%)',
      borderRadius: 4 * scale, transform: 'rotate(-1.5deg)',
      boxShadow: '0 3px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
      border: '1px solid rgba(180,160,120,0.25)',
    }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 13 * scale,
        fontStyle: 'italic', color: '#4a3a20', lineHeight: 1.6,
        textAlign: 'center', wordBreak: 'break-word',
      }}>{text || 'A sacred passage\nwritten by the host.'}</p>
    </div>
  );
}

function ShrineFrame({ scale = 1 }) {
  return (
    <div style={{
      width: 70 * scale, height: 85 * scale, padding: 5 * scale,
      border: `${2*scale}px solid rgba(184,137,60,0.6)`,
      borderRadius: 2 * scale,
      background: 'linear-gradient(135deg, rgba(40,30,16,0.5) 0%, rgba(60,45,25,0.4) 100%)',
      boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 1 * scale,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(200,170,120,0.15) 0%, rgba(80,60,30,0.2) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 10 * scale,
          color: 'rgba(200,170,120,0.4)', fontStyle: 'italic',
        }}>icon</span>
      </div>
    </div>
  );
}

function ShrineFlower({ scale = 1 }) {
  const ps = 8 * scale;
  return (
    <svg width={40*scale} height={40*scale} viewBox="0 0 40 40">
      {[0,72,144,216,288].map(a => (
        <ellipse key={a} cx="20" cy="20" rx={ps} ry={ps*1.4}
          fill="rgba(245,235,220,0.7)" stroke="rgba(200,180,140,0.3)" strokeWidth="0.5"
          transform={`rotate(${a} 20 20) translate(0 -${ps*0.8})`} />
      ))}
      <circle cx="20" cy="20" r={4*scale} fill="rgba(220,190,100,0.6)" />
    </svg>
  );
}

function ShrineBeads({ scale = 1 }) {
  const beads = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI + 0.3;
    const rx = 22 * scale, ry = 14 * scale;
    beads.push({ x: 28 + Math.cos(angle) * rx, y: 18 + Math.sin(angle) * ry });
  }
  return (
    <svg width={60*scale} height={38*scale} viewBox="0 0 60 38">
      <path d={`M ${beads.map(b => `${b.x},${b.y}`).join(' L ')}`}
        fill="none" stroke="rgba(160,130,80,0.4)" strokeWidth="1" />
      {beads.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={3*scale}
          fill="rgba(140,100,50,0.6)" stroke="rgba(100,70,30,0.3)" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function ShrineIncense({ scale = 1 }) {
  return (
    <div style={{ position: 'relative', width: 20 * scale, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Smoke wisps */}
      {[0, 0.8, 1.6].map((d, i) => (
        <div key={i} style={{
          position: 'absolute', top: -8 * scale, left: '50%', transform: 'translateX(-50%)',
          width: 4 * scale, height: 4 * scale, borderRadius: '50%',
          background: 'rgba(200,190,170,0.5)',
          animation: `smokeRise ${2.2 + i * 0.4}s ease-out infinite`,
          animationDelay: `${d}s`,
        }} />
      ))}
      {/* Ember tip */}
      <div style={{
        width: 3 * scale, height: 3 * scale, borderRadius: '50%',
        background: '#e09040', boxShadow: '0 0 4px rgba(220,140,40,0.5)',
        marginBottom: -1,
      }} />
      {/* Stick */}
      <div style={{
        width: 2 * scale, height: 44 * scale,
        background: 'linear-gradient(180deg, #8a7050 0%, #6a5040 100%)',
        borderRadius: 1,
      }} />
      {/* Base */}
      <div style={{
        width: 16 * scale, height: 5 * scale,
        background: 'rgba(100,80,50,0.6)', borderRadius: '0 0 4px 4px',
      }} />
    </div>
  );
}

function ShrinePlacard({ word = 'Peace', scale = 1 }) {
  return (
    <div style={{
      padding: `${8*scale}px ${18*scale}px`,
      background: 'linear-gradient(135deg, #f2e8d0 0%, #e8dcc0 100%)',
      borderRadius: 3 * scale,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      border: '1px solid rgba(180,160,120,0.2)',
    }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 18 * scale,
        fontWeight: 400, color: '#3a2a14', letterSpacing: '-0.01em',
      }}>{word}.</span>
    </div>
  );
}

/* ── Object wrapper (draggable in edit mode) ──────────── */
const OBJECT_COMPONENTS = {
  candle: (p) => <ShrineCandle lit={p.lit !== false} scale={p.scale || 1} />,
  parchment: (p) => <ShrineParchment text={p.text} scale={p.scale || 1} />,
  frame: (p) => <ShrineFrame scale={p.scale || 1} />,
  flower: (p) => <ShrineFlower scale={p.scale || 1} />,
  beads: (p) => <ShrineBeads scale={p.scale || 1} />,
  incense: (p) => <ShrineIncense scale={p.scale || 1} />,
  placard: (p) => <ShrinePlacard word={p.word} scale={p.scale || 1} />,
};

function DraggableObject({ obj, editing, onMove, onSelect, selected }) {
  const ref = React.useRef(null);

  const handleMouseDown = (e) => {
    if (!editing) return;
    e.preventDefault();
    onSelect && onSelect(obj.id);
    const startX = e.clientX, startY = e.clientY;
    const startOx = obj.x, startOy = obj.y;
    const parentRect = ref.current.parentElement.getBoundingClientRect();
    const move = (ev) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      const nx = Math.max(0, Math.min(100, startOx + (dx / parentRect.width) * 100));
      const ny = Math.max(0, Math.min(100, startOy + (dy / parentRect.height) * 100));
      onMove(obj.id, nx, ny);
    };
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const Render = OBJECT_COMPONENTS[obj.type];
  if (!Render) return null;

  return (
    <div ref={ref}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute', left: `${obj.x}%`, top: `${obj.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: editing ? 'grab' : 'default',
        zIndex: selected ? 20 : 10,
        transition: editing ? 'none' : 'left 0.5s ease, top 0.5s ease',
        filter: editing && selected ? 'drop-shadow(0 0 8px rgba(184,137,60,0.5))' : 'none',
      }}
    >
      <Render {...obj.props} />
    </div>
  );
}

/* ── Control Icons ────────────────────────────────────── */
function CandleIcon(p) {
  return (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.5" strokeLinecap="round">
    <rect x="10" y="10" width="4" height="10" rx="1" /><path d="M12 10c0-3 2-4 0-7 -2 3 0 4 0 7" /><line x1="8" y1="20" x2="16" y2="20" />
  </svg>);
}
function MusicIcon(p) {
  return (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>);
}
function InviteIcon(p) {
  return (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
  </svg>);
}
function PencilIcon(p) {
  return (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>);
}
function LeaveIcon(p) {
  return (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>);
}

function ShrineControls({ isHost, candleLit, musicOn, onToggleCandle, onToggleMusic, onInvite, onEdit, onLeave }) {
  const [hovIdx, setHovIdx] = React.useState(-1);
  const btns = [
    { icon: CandleIcon, label: candleLit ? 'Candle on' : 'Candle off', action: onToggleCandle, active: candleLit },
    { icon: MusicIcon, label: musicOn ? 'Sound on' : 'Sound off', action: onToggleMusic, active: musicOn },
    { icon: InviteIcon, label: 'Invite a friend', action: onInvite },
    ...(isHost ? [{ icon: PencilIcon, label: 'Edit room', action: onEdit }] : []),
    { icon: LeaveIcon, label: 'Leave', action: onLeave },
  ];

  return (
    <div style={{
      position: 'absolute', top: '20px', right: '20px',
      display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 30,
    }}>
      {btns.map((b, i) => (
        <button key={i} onClick={b.action}
          onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(-1)}
          title={b.label}
          style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: hovIdx === i ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.80)',
            backdropFilter: 'blur(8px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            transition: 'all 0.25s',
            transform: hovIdx === i ? 'scale(1.08)' : 'scale(1)',
            opacity: b.active === false ? 0.5 : 1,
          }}>
          <b.icon c={B.textSecondary} />
        </button>
      ))}
    </div>
  );
}

/* ── Presence Indicator ───────────────────────────────── */
function PresenceIndicator({ guest }) {
  if (!guest) return null;
  return (
    <div style={{
      position: 'absolute', bottom: '24px', left: '24px', zIndex: 30,
      display: 'flex', alignItems: 'center', gap: '10px',
      background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(8px)',
      padding: '10px 18px', borderRadius: '100px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    }}>
      <span className="sage-pulse" style={{
        width: '10px', height: '10px', borderRadius: '50%',
        background: B.sage, display: 'inline-block',
      }} />
      <span style={{
        fontFamily: "'Inter', sans-serif", fontSize: '13px', color: B.sage,
      }}>{guest.name} joined you.</span>
    </div>
  );
}

/* ── Chat Strip ───────────────────────────────────────── */
// MOCK: Chat messages
const MOCK_CHAT = [
  { from: 'Maya', text: 'This passage reminded me of my grandmother.', time: '2m ago' },
  { from: 'You', text: 'Which part?', time: '1m ago' },
  { from: 'Maya', text: 'The line about returning to stillness. She used to say something similar when I was upset.', time: 'now' },
];

function ShrineChat({ guest, expanded, onToggle }) {
  const [msg, setMsg] = React.useState('');
  const [msgs, setMsgs] = React.useState(MOCK_CHAT);

  if (!expanded) {
    return (
      <button onClick={onToggle} style={{
        position: 'absolute', bottom: '24px', right: '24px', zIndex: 30,
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)',
        border: 'none', padding: '10px 24px', borderRadius: '100px',
        cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        fontFamily: "'Inter', sans-serif", fontSize: '13px', color: B.textSecondary,
        transition: 'all 0.3s',
      }}>say something</button>
    );
  }

  return (
    <div style={{
      position: 'absolute', bottom: '24px', right: '24px', zIndex: 30,
      width: 'min(360px, calc(100vw - 48px))',
      maxHeight: '340px',
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(14px)',
      borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(139,106,31,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {guest && (
            <span style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'rgba(94,113,72,0.12)', color: B.sage,
              fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{guest.initial}</span>
          )}
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: B.textSecondary }}>
            {guest ? `with ${guest.name}` : 'Quiet'}
          </span>
        </div>
        <button onClick={onToggle} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: B.textTertiary,
          fontSize: '16px', padding: '2px 6px',
        }}>−</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === 'You' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{
              padding: '9px 14px',
              borderRadius: m.from === 'You' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: m.from === 'You' ? B.gold : B.bg,
              color: m.from === 'You' ? '#fff' : B.textSecondary,
              fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: 1.55,
            }}>{m.text}</div>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '10px',
              color: B.textTertiary, marginTop: '3px',
              textAlign: m.from === 'You' ? 'right' : 'left',
            }}>{m.time}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(139,106,31,0.06)', display: 'flex', gap: '8px' }}>
        <input value={msg} onChange={e => setMsg(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && msg.trim()) {
              setMsgs([...msgs, { from: 'You', text: msg.trim(), time: 'now' }]);
              setMsg('');
            }
          }}
          placeholder="Speak softly…"
          style={{
            flex: 1, padding: '8px 14px', borderRadius: '10px',
            border: `1px solid ${B.borderGold}`, background: 'rgba(250,247,238,0.6)',
            fontFamily: "'Inter', sans-serif", fontSize: '13px', color: B.textPrimary, outline: 'none',
          }}
        />
      </div>
    </div>
  );
}

/* ── Main Room View ───────────────────────────────────── */
function ShrineRoom({ theme, objects, isHost, guest, candleLit, musicOn, editing,
  onToggleCandle, onToggleMusic, onEdit, onLeave, onMoveObject, onSelectObject, selectedObj }) {
  const [chatExpanded, setChatExpanded] = React.useState(true);
  const t = THEMES.find(th => th.id === theme) || THEMES[0];

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100vh',
      background: t.bg, overflow: 'hidden',
      transition: 'background 1.5s ease',
    }}>
      {/* Subtle vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(0,0,0,0.3) 100%)',
      }} />

      {/* Gemini badge (mock) */}
      <div style={{
        position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 25, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
        padding: '6px 16px', borderRadius: '100px',
        fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 500,
        color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {t.name} · Scene by Gemini
      </div>

      {/* Back pill */}
      <a href="Dashboard.html" style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 30,
        background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)',
        padding: '8px 18px', borderRadius: '100px', textDecoration: 'none',
        fontFamily: "'Inter', sans-serif", fontSize: '13px', color: B.textSecondary,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.25s',
      }}>← Back to dashboard</a>

      {/* Guest badge (for guest view) */}
      {!isHost && guest && (
        <div style={{
          position: 'absolute', top: '64px', left: '20px', zIndex: 30,
          background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
          padding: '6px 16px', borderRadius: '100px',
          fontFamily: "'Cormorant Garamond', serif", fontSize: '15px',
          fontStyle: 'italic', color: B.textSecondary,
        }}>{guest.name}'s shrine.</div>
      )}

      {/* Controls */}
      <ShrineControls isHost={isHost} candleLit={candleLit} musicOn={musicOn}
        onToggleCandle={onToggleCandle} onToggleMusic={onToggleMusic}
        onInvite={() => {}} onEdit={onEdit} onLeave={onLeave} />

      {/* Objects */}
      {objects.map(obj => (
        <DraggableObject key={obj.id} obj={obj} editing={editing}
          onMove={onMoveObject} onSelect={onSelectObject} selected={selectedObj === obj.id} />
      ))}

      {/* Presence */}
      {isHost && <PresenceIndicator guest={guest} />}

      {/* Chat */}
      <ShrineChat guest={guest} expanded={chatExpanded} onToggle={() => setChatExpanded(!chatExpanded)} />
    </div>
  );
}

Object.assign(window, {
  THEMES, ShrineRoom, ShrineCandle, ShrineParchment, ShrineFrame,
  ShrineFlower, ShrineBeads, ShrineIncense, ShrinePlacard,
  OBJECT_COMPONENTS, DraggableObject, B,
});
