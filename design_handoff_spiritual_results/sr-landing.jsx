// sr-landing.jsx — Landing Page components for Spiritual Results

const BRAND = {
  bg: '#FAF7EE',
  surface: '#FFFFFF',
  surfaceAlt: '#F2EBD8',
  textPrimary: '#2A2218',
  textSecondary: '#5C4F3D',
  textTertiary: '#8A7A66',
  gold: '#8B6A1F',
  goldStrong: '#B8893C',
  goldHover: '#A07728',
  borderGold: 'rgba(139,106,31,0.20)',
  sage: '#5E7148',
  amber: '#A85C1B',
  darkOnGold: '#1F1810',
};

// MOCK: Quotes from various wisdom traditions
const QUOTES = [
  { text: "Be still, and know that I am God.", source: "Psalm 46:10" },
  { text: "The obstacle is the path.", source: "Zen proverb" },
  { text: "O you who believe, seek help in patience and prayer.", source: "Qur'an 2:153" },
  { text: "Each new morning we are born again.", source: "Buddha" },
  { text: "The unexamined life is not worth living.", source: "Socrates" },
];

const TRADITIONS = [
  "Christianity", "Islam", "Buddhism", "Hinduism", "Judaism", "Sufism",
  "Taoism", "Confucianism", "Bahá'í", "Jainism", "Sikhism", "Shinto",
];

const FEATURES = [
  {
    title: "Learn at your pace.",
    desc: "Self-paced lessons with short readings, reflection prompts, and an optional review quiz.",
    icon: "book",
  },
  {
    title: "Build a sanctuary.",
    desc: "A personal room you design. Invite a trusted friend to come and talk.",
    icon: "arch",
  },
  {
    title: "Keep a journal.",
    desc: "A private place to write what you're thinking. Yours alone.",
    icon: "pen",
  },
];

/* ── Hooks ────────────────────────────────────────────────── */

function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', h, { passive: true });
    h();
    return () => window.removeEventListener('scroll', h);
  }, [threshold]);
  return scrolled;
}

/* ── Icons (thin, contemplative line drawings) ────────────── */

function BookIcon({ size = 30, color = BRAND.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ArchIcon({ size = 30, color = BRAND.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V10c0-4.4 3.6-8 8-8s8 3.6 8 8v12" />
      <path d="M9 22v-5c0-1.7 1.3-3 3-3s3 1.3 3 3v5" />
    </svg>
  );
}

function PenIcon({ size = 30, color = BRAND.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

const ICON_MAP = { book: BookIcon, arch: ArchIcon, pen: PenIcon };

/* ── Reusable Button ──────────────────────────────────────── */

function SRButton({ variant = 'filled', shape = 'rounded', children, style = {}, ...props }) {
  const [hov, setHov] = React.useState(false);
  const [foc, setFoc] = React.useState(false);

  const radius = shape === 'pill' ? '100px' : shape === 'rounded' ? '10px' : '5px';

  const base = {
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 500,
    padding: '14px 34px',
    cursor: 'pointer',
    transition: 'all 0.35s ease',
    borderRadius: radius,
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.01em',
  };

  const filled = {
    backgroundColor: hov ? BRAND.goldHover : BRAND.goldStrong,
    color: BRAND.darkOnGold,
    border: '1px solid transparent',
    boxShadow: foc ? '0 0 0 3px rgba(139,106,31,0.25)' : hov ? '0 2px 12px rgba(139,106,31,0.15)' : 'none',
  };

  const outline = {
    backgroundColor: hov ? 'rgba(139,106,31,0.04)' : 'transparent',
    color: hov ? BRAND.goldHover : BRAND.gold,
    border: `1px solid ${hov ? 'rgba(139,106,31,0.35)' : BRAND.borderGold}`,
    boxShadow: foc ? '0 0 0 3px rgba(139,106,31,0.15)' : 'none',
  };

  return (
    <button
      style={{ ...base, ...(variant === 'filled' ? filled : outline), ...style }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={() => setFoc(true)}
      onBlur={() => setFoc(false)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── Header ───────────────────────────────────────────────── */

function SRHeader({ scrolled, wordmarkStyle = 'pendant', ctaShape = 'rounded' }) {
  const [signInHov, setSignInHov] = React.useState(false);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 clamp(20px, 5vw, 56px)',
      height: '72px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'background-color 0.6s ease, backdrop-filter 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease',
      backgroundColor: scrolled ? 'rgba(255,255,255,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(139,106,31,0.07)' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 8px rgba(42,34,24,0.04)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {wordmarkStyle !== 'text' && (
          <img src="pendant.png" alt="" style={{
            height: '38px', width: '38px',
            objectFit: 'contain',
          }} />
        )}
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '23px', fontWeight: 400,
          color: BRAND.gold, letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}>
          Spiritual Results
        </span>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <a href="#" style={{
          color: signInHov ? BRAND.gold : BRAND.textSecondary,
          textDecoration: 'none',
          fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400,
          transition: 'color 0.25s ease',
        }}
          onMouseEnter={() => setSignInHov(true)}
          onMouseLeave={() => setSignInHov(false)}
        >Sign in</a>
        <SRButton variant="filled" shape={ctaShape}
          style={{ padding: '9px 24px', fontSize: '14px' }}>
          Begin
        </SRButton>
      </nav>
    </header>
  );
}

/* ── Hero Section ─────────────────────────────────────────── */

function HeroSection({ glow = 'subtle', ctaShape = 'rounded' }) {
  const glowAlpha = glow === 'subtle' ? 0.045 : glow === 'medium' ? 0.09 : 0;

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
      padding: '100px clamp(28px, 6vw, 80px) 60px',
      background: glowAlpha > 0
        ? `radial-gradient(ellipse 850px 650px at 50% 44%, rgba(184,137,60,${glowAlpha}) 0%, transparent 100%)`
        : 'none',
    }}>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(44px, 6.5vw, 78px)',
        fontWeight: 300,
        color: BRAND.gold,
        letterSpacing: '-0.01em',
        lineHeight: 1.12,
        maxWidth: '780px',
        marginBottom: '32px',
        textWrap: 'balance',
      }}>
        Connect with ancient wisdom.
      </h1>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 'clamp(16px, 1.4vw, 19px)',
        color: BRAND.textSecondary,
        lineHeight: 1.7,
        maxWidth: '540px',
        marginBottom: '52px',
        textWrap: 'pretty',
      }}>
        A safe, soothing space for spiritual growth and cross-faith dialogue.
        Learn from thousands of years of teaching — at your own pace.
      </p>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <SRButton variant="filled" shape={ctaShape}>Begin your path</SRButton>
        <SRButton variant="outline" shape={ctaShape}>Browse what's here</SRButton>
      </div>
    </section>
  );
}

/* ── Gold hairline divider ────────────────────────────────── */

function GoldDivider() {
  return (
    <div style={{
      width: '100px', height: '1px',
      background: BRAND.borderGold,
      margin: '0 auto',
    }} />
  );
}

/* ── Traditions Strip ─────────────────────────────────────── */

function TraditionsStrip() {
  return (
    <section style={{
      padding: 'clamp(56px, 7vw, 88px) clamp(28px, 6vw, 80px)',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px', fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: BRAND.textTertiary,
        marginBottom: '28px',
      }}>
        Drawing from
      </p>
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center', gap: '10px',
        maxWidth: '700px', margin: '0 auto',
      }}>
        {TRADITIONS.map(t => (
          <span key={t} style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px', color: BRAND.textSecondary,
            padding: '7px 18px',
            borderRadius: '100px',
            border: `1px solid ${BRAND.borderGold}`,
            background: BRAND.bg,
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}>
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── Features (3 columns) ────────────────────────────────── */

function FeaturesSection() {
  return (
    <section style={{
      padding: 'clamp(56px, 7vw, 100px) clamp(28px, 6vw, 80px)',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(28px, 3.2vw, 38px)',
        fontWeight: 300, color: BRAND.gold,
        letterSpacing: '-0.01em',
        marginBottom: 'clamp(44px, 5vw, 68px)',
      }}>
        What you'll find
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'clamp(36px, 4vw, 56px)',
        maxWidth: '920px', margin: '0 auto',
      }}>
        {FEATURES.map(f => {
          const Icon = ICON_MAP[f.icon];
          return (
            <div key={f.title} style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '20px', opacity: 0.85 }}>
                <Icon size={32} />
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '23px', fontWeight: 400,
                color: BRAND.textPrimary,
                letterSpacing: '-0.01em',
                marginBottom: '12px',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px', color: BRAND.textSecondary,
                lineHeight: 1.7,
                maxWidth: '280px', margin: '0 auto',
              }}>
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Quote Carousel ───────────────────────────────────────── */

function QuoteCarousel({ interval = 8 }) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => {
      setActive(p => (p + 1) % QUOTES.length);
    }, interval * 1000);
    return () => clearInterval(t);
  }, [interval]);

  return (
    <section style={{
      padding: 'clamp(72px, 9vw, 128px) clamp(28px, 6vw, 80px)',
      textAlign: 'center',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: '620px', minHeight: '130px',
      }}>
        {QUOTES.map((q, i) => (
          <div key={i} style={{
            position: i === 0 ? 'relative' : 'absolute',
            inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: i === active ? 1 : 0,
            transition: 'opacity 1.6s ease',
            pointerEvents: i === active ? 'auto' : 'none',
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(21px, 2.8vw, 30px)',
              fontWeight: 300,
              color: BRAND.textPrimary,
              lineHeight: 1.55,
              marginBottom: '16px',
              textWrap: 'balance',
            }}>
              "{q.text}"
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: BRAND.textTertiary,
              letterSpacing: '0.02em',
            }}>
              — {q.source}
            </p>
          </div>
        ))}

        {/* Small dot indicators */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '8px',
          marginTop: '32px',
        }}>
          {QUOTES.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              aria-label={`Quote ${i + 1}`}
              style={{
                width: '6px', height: '6px',
                borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
                background: i === active ? BRAND.gold : BRAND.borderGold,
                transition: 'background 0.5s ease',
                outline: 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────── */

function SRFooter() {
  const [hovLink, setHovLink] = React.useState(false);

  return (
    <footer style={{
      padding: '52px clamp(28px, 6vw, 80px)',
      textAlign: 'center',
      borderTop: `1px solid ${BRAND.borderGold}`,
    }}>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px', color: BRAND.textTertiary,
        marginBottom: '10px',
      }}>
        © {new Date().getFullYear()} Spiritual Results
      </p>
      <a href="https://spiritualresults.ai" target="_blank" rel="noopener noreferrer"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          color: hovLink ? BRAND.gold : BRAND.textTertiary,
          textDecoration: 'none',
          transition: 'color 0.25s ease',
        }}
        onMouseEnter={() => setHovLink(true)}
        onMouseLeave={() => setHovLink(false)}
      >
        Want to go deeper? Visit spiritualresults.ai →
      </a>
    </footer>
  );
}

/* ── Main App ─────────────────────────────────────────────── */

const SR_DEFAULTS = {
  wordmarkStyle: "pendant",
  heroGlow: "none",
  ctaShape: "rounded",
  showDividers: true,
};

function LandingPage() {
  const scrolled = useScrolled(50);
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS || SR_DEFAULTS);

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh' }}>
      <SRHeader scrolled={scrolled} wordmarkStyle={tweaks.wordmarkStyle} ctaShape={tweaks.ctaShape} />
      <HeroSection glow={tweaks.heroGlow} ctaShape={tweaks.ctaShape} />
      {tweaks.showDividers && <GoldDivider />}
      <TraditionsStrip />
      {tweaks.showDividers && <GoldDivider />}
      <FeaturesSection />
      {tweaks.showDividers && <GoldDivider />}
      <QuoteCarousel interval={8} />
      <SRFooter />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Header">
          <TweakSelect label="Wordmark" value={tweaks.wordmarkStyle}
            options={[
              { value: 'pendant', label: 'Pendant + text' },
              { value: 'text', label: 'Text only' },
            ]}
            onChange={v => setTweak('wordmarkStyle', v)} />
        </TweakSection>
        <TweakSection label="Hero">
          <TweakSelect label="Background glow" value={tweaks.heroGlow}
            options={[
              { value: 'subtle', label: 'Subtle' },
              { value: 'medium', label: 'Medium' },
              { value: 'none', label: 'None' },
            ]}
            onChange={v => setTweak('heroGlow', v)} />
        </TweakSection>
        <TweakSection label="Buttons">
          <TweakSelect label="Shape" value={tweaks.ctaShape}
            options={[
              { value: 'pill', label: 'Pill' },
              { value: 'rounded', label: 'Rounded' },
              { value: 'slight', label: 'Slight rounding' },
            ]}
            onChange={v => setTweak('ctaShape', v)} />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakToggle label="Section dividers" value={tweaks.showDividers}
            onChange={v => setTweak('showDividers', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

Object.assign(window, {
  LandingPage, SRHeader, HeroSection, TraditionsStrip,
  FeaturesSection, QuoteCarousel, SRFooter, GoldDivider,
  SRButton, BRAND, QUOTES, TRADITIONS, FEATURES,
});
