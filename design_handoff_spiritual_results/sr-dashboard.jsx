// sr-dashboard.jsx — Dashboard for Spiritual Results

/* ── Brand ────────────────────────────────────────────── */
const BRAND = {
  bg: '#FAF7EE', surface: '#FFFFFF', surfaceAlt: '#F2EBD8',
  textPrimary: '#2A2218', textSecondary: '#5C4F3D', textTertiary: '#8A7A66',
  gold: '#8B6A1F', goldStrong: '#B8893C', goldHover: '#A07728',
  borderGold: 'rgba(139,106,31,0.20)', sage: '#5E7148',
  amber: '#A85C1B', darkOnGold: '#1F1810',
};

/* ── Mock Data ── MOCK: Replace all with real data from API */
const USER = { firstName: 'James', initials: 'JP', email: 'james@example.com', since: 'March 2025' };
const SHRINE_DATA = { theme: 'Candlelit Chapel', guest: { name: 'Maya', initial: 'M' } };
const GUESTS = [
  { name: 'Maya', initial: 'M' }, { name: 'Eli', initial: 'E' },
  { name: 'Sarah', initial: 'S' }, { name: 'David', initial: 'D' },
  { name: 'Hannah', initial: 'H' },
];
const MODULE_DATA = {
  title: 'The Way of Stillness', subtitle: 'Buddhist Foundations',
  tradition: 'Buddhism', lesson: 2, total: 3,
};
const JOURNAL_DATA = [
  { id: 1, date: 'May 18', text: 'Today I sat with the passage from Rumi about the wound being the place where the light enters\u2026' },
  { id: 2, date: 'May 15', text: 'The third lesson on compassion reminded me of something my grandmother once said\u2026' },
  { id: 3, date: 'May 12', text: 'A conversation with Maya about patience \u2014 she shared a verse from the Gita\u2026' },
];
const INITIAL_GOALS = [
  { id: 1, title: 'Practice daily stillness', desc: 'Ten minutes each morning before the house wakes', state: 'set', date: 'Apr 3' },
  { id: 2, title: 'Read the Bhagavad Gita', desc: null, state: 'reflecting', date: 'Mar 18' },
  { id: 3, title: 'Write a letter to my mother', desc: 'About the things I never said', state: 'released', date: 'Feb 2' },
];
const PHRASES = {
  morning: ['A new day begins gently.', 'The light returns.', 'Begin here.'],
  afternoon: ['Welcome back.', 'The path continues.', 'A quiet moment.'],
  evening: ['The day draws to a close.', 'Rest arrives.', 'A gentle evening.'],
};
const TOD_LABELS = { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' };

/* ── Utilities ────────────────────────────────────────── */
function getTimeOfDay(ov) {
  if (ov && ov !== 'auto') return ov;
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
}

/* ── Hooks ────────────────────────────────────────────── */
function useRotating(items, ms = 6000) {
  const [i, setI] = React.useState(0);
  const ref = React.useRef(items);
  ref.current = items;
  React.useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % ref.current.length), ms);
    return () => clearInterval(t);
  }, [ms]);
  return items[i % items.length];
}

/* ── Shared tiny components ───────────────────────────── */
function GoldLink({ children, style, ...p }) {
  const [h, setH] = React.useState(false);
  return (
    <a href="#" {...p} style={{
      color: h ? BRAND.goldHover : BRAND.gold,
      textDecoration: 'none', transition: 'color 0.25s',
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '16px', fontWeight: 400, ...style,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={e => { e.preventDefault(); p.onClick && p.onClick(e); }}
    >{children}</a>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600,
      letterSpacing: '0.13em', textTransform: 'uppercase',
      color: BRAND.textTertiary, marginBottom: '18px',
    }}>{children}</p>
  );
}

function StateBadge({ state }) {
  const colors = {
    set: { bg: 'rgba(139,106,31,0.08)', color: BRAND.gold },
    reflecting: { bg: 'rgba(139,106,31,0.06)', color: BRAND.goldHover },
    released: { bg: 'rgba(138,122,102,0.08)', color: BRAND.textTertiary },
  };
  const c = colors[state] || colors.set;
  return (
    <span style={{
      fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '100px',
      background: c.bg, color: c.color,
      textTransform: 'lowercase',
    }}>{state}</span>
  );
}

/* ── Dashboard Nav ────────────────────────────────────── */
function DashboardNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [hovLink, setHovLink] = React.useState(null);
  const [showAccount, setShowAccount] = React.useState(false);
  const acctRef = React.useRef(null);

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true }); h();
    return () => window.removeEventListener('scroll', h);
  }, []);

  React.useEffect(() => {
    if (!showAccount) return;
    const h = e => { if (acctRef.current && !acctRef.current.contains(e.target)) setShowAccount(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showAccount]);

  const links = [
    { label: 'Dashboard', active: true }, { label: 'Modules' },
    { label: 'Journal' }, { label: 'Goals' }, { label: 'Shrine' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 clamp(20px, 5vw, 48px)', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(255,255,255,0.92)' : BRAND.surface,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: `1px solid rgba(139,106,31,${scrolled ? '0.08' : '0.05'})`,
      transition: 'all 0.5s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <img src="pendant.png" alt="" style={{ height: '30px', width: '30px', objectFit: 'contain' }} />
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '19px',
          fontWeight: 400, color: BRAND.gold, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
        }}>Spiritual Results</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="db-nav-links" style={{ display: 'flex', gap: '22px' }}>
          {links.map(l => (
            <a key={l.label} href="#" onClick={e => e.preventDefault()} style={{
              fontFamily: "'Inter', sans-serif", fontSize: '13px',
              fontWeight: l.active ? 500 : 400,
              color: hovLink === l.label ? BRAND.gold : l.active ? BRAND.textPrimary : BRAND.textSecondary,
              textDecoration: 'none', transition: 'color 0.25s',
            }}
              onMouseEnter={() => setHovLink(l.label)} onMouseLeave={() => setHovLink(null)}
            >{l.label}</a>
          ))}
        </div>

        <div ref={acctRef} style={{ position: 'relative' }}>
          <button onClick={() => setShowAccount(!showAccount)} style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: showAccount ? BRAND.goldStrong : BRAND.surfaceAlt,
            border: `1px solid ${BRAND.borderGold}`,
            color: showAccount ? '#fff' : BRAND.textSecondary,
            fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s',
          }}>{USER.initials}</button>

          {showAccount && (
            <div style={{
              position: 'absolute', top: '44px', right: 0, width: '260px',
              background: BRAND.surface, borderRadius: '14px',
              border: `1px solid ${BRAND.borderGold}`,
              boxShadow: '0 8px 32px rgba(42,34,24,0.10)', padding: '20px',
              zIndex: 200,
            }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500, color: BRAND.textPrimary }}>{USER.firstName}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: BRAND.textSecondary, marginTop: '2px' }}>{USER.email}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BRAND.textTertiary, marginTop: '4px' }}>Member since {USER.since}</p>
              <div style={{ height: '1px', background: BRAND.borderGold, margin: '16px 0' }} />
              <GoldLink style={{ fontSize: '14px', fontFamily: "'Inter', sans-serif", color: BRAND.amber, display: 'block', marginBottom: '10px' }}>Sign out</GoldLink>
              <a href="https://spiritualresults.ai" target="_blank" rel="noopener" style={{
                fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BRAND.textTertiary, textDecoration: 'none',
              }}>Manage subscription on spiritualresults.ai →</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ── Greeting ─────────────────────────────────────────── */
function GreetingSection({ timeOfDay }) {
  const phrases = PHRASES[timeOfDay] || PHRASES.morning;
  const phrase = useRotating(phrases, 6000);

  return (
    <section style={{ padding: '72px 0 16px', textAlign: 'left' }}>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 300,
        color: BRAND.gold, letterSpacing: '-0.01em', lineHeight: 1.15,
      }}>
        {TOD_LABELS[timeOfDay]}, {USER.firstName}.
      </h1>
      <p key={phrase} style={{
        fontFamily: "'Inter', sans-serif", fontSize: '16px',
        color: BRAND.textSecondary, fontStyle: 'italic',
        marginTop: '10px', opacity: 0,
        animation: 'fadeInPhrase 1.2s ease forwards',
      }}>{phrase}</p>
    </section>
  );
}

/* ── Shrine Card ──────────────────────────────────────── */
function ShrineCard({ showGuest = true }) {
  const [hov, setHov] = React.useState(false);

  return (
    <section style={{ padding: '32px 0' }}>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          position: 'relative', height: '200px', borderRadius: '20px',
          background: `linear-gradient(135deg, rgba(184,137,60,${hov ? 0.13 : 0.08}) 0%, rgba(184,137,60,0.02) 60%, transparent 100%)`,
          border: `1px solid rgba(139,106,31,${hov ? 0.18 : 0.10})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.5s ease', overflow: 'hidden',
        }}
      >
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: BRAND.textTertiary, marginBottom: '14px',
        }}>{SHRINE_DATA.theme}</p>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '22px',
          fontWeight: 400, color: BRAND.gold, letterSpacing: '-0.01em',
          transition: 'color 0.3s',
        }}>Enter your shrine →</span>

        {showGuest && SHRINE_DATA.guest && (
          <div style={{
            position: 'absolute', bottom: '18px', right: '22px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span className="sage-pulse" style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: BRAND.sage, display: 'inline-block',
            }} />
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: '13px',
              color: BRAND.sage, fontWeight: 400,
            }}>{SHRINE_DATA.guest.name} is here with you.</span>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Recent Guests ────────────────────────────────────── */
function RecentGuests() {
  const [hovIdx, setHovIdx] = React.useState(-1);
  const [tooltip, setTooltip] = React.useState(null);

  return (
    <section style={{ padding: '12px 0 40px' }}>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: '14px',
        color: BRAND.textSecondary, marginBottom: '16px',
      }}>People who've been with you recently.</p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', position: 'relative' }}>
        {GUESTS.map((g, i) => (
          <div key={g.name} style={{ position: 'relative' }}>
            <button
              onClick={() => setTooltip(tooltip === i ? null : i)}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(-1)}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: hovIdx === i ? 'rgba(139,106,31,0.08)' : BRAND.surfaceAlt,
                border: `1.5px solid ${hovIdx === i ? BRAND.goldStrong : BRAND.borderGold}`,
                color: hovIdx === i ? BRAND.gold : BRAND.textSecondary,
                fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >{g.initial}</button>
            {tooltip === i && (
              <div style={{
                position: 'absolute', bottom: '52px', left: '50%', transform: 'translateX(-50%)',
                background: BRAND.surface, border: `1px solid ${BRAND.borderGold}`,
                borderRadius: '10px', padding: '10px 16px', whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(42,34,24,0.08)', zIndex: 50,
              }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: BRAND.textSecondary }}>
                  Invite {g.name} back →
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Module Card ──────────────────────────────────────── */
function ModuleCard() {
  const [hov, setHov] = React.useState(false);
  const m = MODULE_DATA;

  return (
    <section style={{ padding: '8px 0 40px' }}>
      <SectionLabel>Your path</SectionLabel>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          background: BRAND.surface, borderRadius: '16px',
          border: `1px solid ${hov ? 'rgba(139,106,31,0.18)' : BRAND.borderGold}`,
          padding: 'clamp(20px, 3vw, 28px)', cursor: 'pointer',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          boxShadow: hov ? '0 2px 12px rgba(139,106,31,0.06)' : '0 1px 4px rgba(42,34,24,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500,
              padding: '3px 10px', borderRadius: '100px',
              background: 'rgba(139,106,31,0.06)', color: BRAND.gold,
            }}>{m.tradition}</span>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '21px',
              fontWeight: 400, color: BRAND.textPrimary, letterSpacing: '-0.01em',
              marginTop: '10px',
            }}>{m.title}: {m.subtitle}</h3>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '13px',
              color: BRAND.textTertiary, marginBottom: '6px',
            }}>Lesson {m.lesson} of {m.total}</p>
            <GoldLink style={{ fontSize: '15px' }}>Continue →</GoldLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Journal Section ──────────────────────────────────── */
function JournalSection() {
  const [hovId, setHovId] = React.useState(null);

  return (
    <section style={{ padding: '8px 0 40px' }}>
      <SectionLabel>Your journal</SectionLabel>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '14px',
      }}>
        {JOURNAL_DATA.map(j => (
          <div key={j.id}
            onMouseEnter={() => setHovId(j.id)} onMouseLeave={() => setHovId(null)}
            style={{
              background: BRAND.surface, borderRadius: '14px',
              border: `1px solid ${hovId === j.id ? 'rgba(139,106,31,0.16)' : BRAND.borderGold}`,
              padding: '20px', cursor: 'pointer',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              boxShadow: hovId === j.id ? '0 2px 10px rgba(139,106,31,0.05)' : 'none',
            }}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '12px',
              fontWeight: 600, color: BRAND.textTertiary, marginBottom: '8px',
            }}>{j.date}</p>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '14px',
              color: BRAND.textSecondary, lineHeight: 1.6,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>{j.text}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '18px' }}>
        <GoldLink style={{ fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>Open journal →</GoldLink>
      </div>
    </section>
  );
}

/* ── Goals Section ────────────────────────────────────── */
function GoalsSection() {
  const [goals, setGoals] = React.useState(INITIAL_GOALS);
  const [newText, setNewText] = React.useState('');
  const [showAdd, setShowAdd] = React.useState(false);
  const [confirming, setConfirming] = React.useState(null);

  const addGoal = () => {
    if (!newText.trim()) return;
    setGoals([{
      id: Date.now(), title: newText.trim(), desc: null, state: 'set',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }, ...goals]);
    setNewText(''); setShowAdd(false);
  };

  const releaseGoal = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, state: 'released' } : g));
    setConfirming(null);
  };

  return (
    <section style={{ padding: '8px 0 40px' }}>
      <SectionLabel>Your goals</SectionLabel>

      {/* Add goal */}
      {showAdd ? (
        <div style={{
          display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap',
        }}>
          <input value={newText} onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGoal()}
            placeholder="What do you hope this season holds?"
            autoFocus
            style={{
              flex: 1, minWidth: '200px', padding: '12px 16px', borderRadius: '12px',
              border: `1px solid ${BRAND.borderGold}`, background: BRAND.surface,
              fontFamily: "'Inter', sans-serif", fontSize: '14px', color: BRAND.textPrimary,
              outline: 'none',
            }}
          />
          <button onClick={addGoal} style={{
            padding: '10px 22px', borderRadius: '100px', border: 'none',
            background: BRAND.goldStrong, color: BRAND.darkOnGold,
            fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500,
            cursor: 'pointer',
          }}>Save</button>
          <button onClick={() => { setShowAdd(false); setNewText(''); }} style={{
            padding: '10px 16px', borderRadius: '100px',
            border: `1px solid ${BRAND.borderGold}`, background: 'transparent',
            fontFamily: "'Inter', sans-serif", fontSize: '14px', color: BRAND.textSecondary,
            cursor: 'pointer',
          }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Inter', sans-serif", fontSize: '14px',
          color: BRAND.gold, marginBottom: '20px', padding: 0,
        }}>+ Add a goal</button>
      )}

      {goals.length === 0 && (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '20px',
          fontStyle: 'italic', color: BRAND.textTertiary, padding: '32px 0',
        }}>What do you hope this season holds for you?</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map(g => (
          <div key={g.id} style={{
            background: BRAND.surface, borderRadius: '14px',
            border: `1px solid ${BRAND.borderGold}`, padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <StateBadge state={g.state} />
              <h4 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '19px',
                fontWeight: 400, color: BRAND.gold, letterSpacing: '-0.01em', flex: 1,
              }}>{g.title}</h4>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BRAND.textTertiary,
              }}>{g.date}</span>
            </div>
            {g.desc && (
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: '14px',
                color: BRAND.textSecondary, marginTop: '8px', lineHeight: 1.6,
              }}>{g.desc}</p>
            )}
            <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="https://spiritualresults.ai" target="_blank" rel="noopener" style={{
                fontFamily: "'Inter', sans-serif", fontSize: '12px',
                color: BRAND.textTertiary, textDecoration: 'none',
              }}>Coaching on this goal lives at spiritualresults.ai →</a>

              {g.state !== 'released' && confirming !== g.id && (
                <button onClick={() => setConfirming(g.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BRAND.textTertiary,
                  textDecoration: 'underline', textDecorationColor: 'rgba(138,122,102,0.3)',
                }}>Release this goal</button>
              )}
              {confirming === g.id && (
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BRAND.textSecondary }}>
                  Are you sure?{' '}
                  <button onClick={() => releaseGoal(g.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BRAND.gold, fontWeight: 500,
                  }}>Yes</button>
                  {' / '}
                  <button onClick={() => setConfirming(null)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BRAND.textTertiary,
                  }}>Cancel</button>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Outbound ─────────────────────────────────────────── */
function OutboundLink() {
  return (
    <section style={{ padding: '24px 0 80px', textAlign: 'center' }}>
      <a href="https://spiritualresults.ai" target="_blank" rel="noopener" style={{
        fontFamily: "'Inter', sans-serif", fontSize: '14px',
        color: BRAND.textTertiary, textDecoration: 'none',
      }}>Looking for a teacher? Visit spiritualresults.ai →</a>
    </section>
  );
}

/* ── Main Dashboard ───────────────────────────────────── */
function Dashboard() {
  const [tweaks, setTweak] = useTweaks(window.DB_TWEAK_DEFAULTS || {
    timeOverride: 'auto', showGuestPresence: true, spacing: 'spacious',
  });
  const tod = getTimeOfDay(tweaks.timeOverride);

  const pad = tweaks.spacing === 'spacious' ? 'clamp(24px, 5vw, 48px)' : 'clamp(16px, 3vw, 28px)';

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh' }}>
      <DashboardNav />
      <main style={{ maxWidth: '896px', margin: '0 auto', padding: `0 ${pad}` }}>
        <GreetingSection timeOfDay={tod} />
        <ShrineCard showGuest={tweaks.showGuestPresence} />
        <RecentGuests />
        <ModuleCard />
        <JournalSection />
        <GoalsSection />
        <OutboundLink />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Preview">
          <TweakSelect label="Time of day" value={tweaks.timeOverride}
            options={[
              { value: 'auto', label: 'Auto (real time)' },
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'evening', label: 'Evening' },
            ]}
            onChange={v => setTweak('timeOverride', v)} />
        </TweakSection>
        <TweakSection label="Shrine">
          <TweakToggle label="Show guest presence" value={tweaks.showGuestPresence}
            onChange={v => setTweak('showGuestPresence', v)} />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakRadio label="Spacing" value={tweaks.spacing}
            options={[
              { value: 'spacious', label: 'Spacious' },
              { value: 'compact', label: 'Compact' },
            ]}
            onChange={v => setTweak('spacing', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

Object.assign(window, { BRAND, Dashboard });
