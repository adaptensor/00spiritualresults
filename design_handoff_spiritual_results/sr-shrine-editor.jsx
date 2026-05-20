// sr-shrine-editor.jsx — Shrine designer with Gemini prompt flow

const BE = window.B || window.BRAND;

/* ── Structured Gemini Prompt Template ────────────────── */
function buildGeminiPrompt(userInput, presetTheme) {
  const preset = presetTheme ? `Starting from the "${presetTheme.name}" theme: ${presetTheme.desc}. ` : '';
  return `You are generating a background scene for a contemplative digital sanctuary.

STYLE CONSTRAINTS:
- Painterly, illustrated style — NOT photographic
- Calm, contemplative mood with dawn or dusk lighting
- Low contrast, warm earth-tone palette (ambers, creams, deep browns, sage greens)
- No people, no text, no faces, no animals
- Aspect ratio: 16:9 (1920×1080)
- Leave the center 40% relatively uncluttered (objects will be overlaid)
- Edges should have atmospheric depth and gentle darkening

${preset}USER'S DESCRIPTION:
${userInput || '(no description — use the preset theme)'}

MOOD WORDS: quiet · warm · candlelit · parchment · prayerful · breath · hush · dawn · dusk · still

Generate a single image that serves as the background of a digital meditation room.`;
}

/* ── Soundscape options ───────────────────────────────── */
const SOUNDSCAPES = ['Wind', 'Bells', 'Water', 'Fire crackle', 'Silence'];
const VISIBILITY_OPTIONS = [
  { value: 'invited', label: 'Invited people only' },
  { value: 'link', label: 'Anyone with the link' },
  { value: 'private', label: 'Just me' },
];

/* ── Object definitions ───────────────────────────────── */
const AVAILABLE_OBJECTS = [
  { type: 'candle', label: 'Lit candle', emoji: '🕯' },
  { type: 'parchment', label: 'Sacred passage', emoji: '📜' },
  { type: 'frame', label: 'Icon or photo', emoji: '🖼' },
  { type: 'flower', label: 'Flower offering', emoji: '🌸' },
  { type: 'beads', label: 'Prayer beads', emoji: '📿' },
  { type: 'incense', label: 'Incense stick', emoji: '🪔' },
  { type: 'placard', label: 'A single word', emoji: '🪧' },
];

/* ── Small reusable components ────────────────────────── */
function EditorSection({ title, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.13em', textTransform: 'uppercase',
        color: BE.textTertiary, marginBottom: '14px',
      }}>{title}</p>
      {children}
    </div>
  );
}

function EditorRadio({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {options.map(o => (
        <label key={o.value} style={{
          display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
          padding: '8px 12px', borderRadius: '10px',
          background: value === o.value ? 'rgba(139,106,31,0.06)' : 'transparent',
          transition: 'background 0.2s',
        }}>
          <span style={{
            width: '16px', height: '16px', borderRadius: '50%',
            border: `2px solid ${value === o.value ? BE.goldStrong : BE.borderGold}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {value === o.value && <span style={{
              width: '8px', height: '8px', borderRadius: '50%', background: BE.goldStrong,
            }} />}
          </span>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: '13px',
            color: BE.textSecondary,
          }}>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

/* ── Theme Picker ─────────────────────────────────────── */
function ThemePicker({ themes, activeId, onSelect }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px',
    }}>
      {themes.map(t => (
        <button key={t.id} onClick={() => onSelect(t.id)}
          style={{
            width: '100%', aspectRatio: '16/10', borderRadius: '10px',
            background: t.bg, border: activeId === t.id
              ? `2.5px solid ${BE.goldStrong}` : '2.5px solid transparent',
            cursor: 'pointer', position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
          <span style={{
            position: 'absolute', bottom: '4px', left: 0, right: 0,
            fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 500,
            color: 'rgba(255,255,255,0.7)', textAlign: 'center',
          }}>{t.name}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Gemini Prompt Section ────────────────────────────── */
function GeminiPromptSection({ theme, onGenerate }) {
  const [userInput, setUserInput] = React.useState('');
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const [refinements, setRefinements] = React.useState(0);

  const currentTheme = window.THEMES.find(t => t.id === theme);
  const fullPrompt = buildGeminiPrompt(userInput, currentTheme);

  const handleGenerate = () => {
    setGenerating(true);
    // MOCK: Simulate Gemini API call
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setRefinements(r => r + 1);
      onGenerate && onGenerate(userInput);
    }, 2200);
  };

  return (
    <div>
      <textarea value={userInput}
        onChange={e => setUserInput(e.target.value)}
        placeholder="Describe your ideal sanctuary... e.g. 'A quiet stone chapel with morning light through stained glass and motes of dust in the air'"
        rows={3}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: '12px',
          border: `1px solid ${BE.borderGold}`, background: BE.bg,
          fontFamily: "'Inter', sans-serif", fontSize: '13px', color: BE.textPrimary,
          lineHeight: 1.6, resize: 'vertical', outline: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
        <button onClick={handleGenerate}
          disabled={generating}
          style={{
            padding: '10px 20px', borderRadius: '100px', border: 'none',
            background: generating ? BE.surfaceAlt : BE.goldStrong,
            color: generating ? BE.textTertiary : BE.darkOnGold,
            fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 500,
            cursor: generating ? 'default' : 'pointer',
            transition: 'all 0.3s',
          }}>
          {generating ? 'Generating\u2026' : refinements > 0 ? 'Regenerate' : 'Generate with Gemini'}
        </button>

        <button onClick={() => setShowPrompt(!showPrompt)}
          style={{
            padding: '10px 16px', borderRadius: '100px',
            border: `1px solid ${BE.borderGold}`, background: 'transparent',
            fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BE.textTertiary,
            cursor: 'pointer',
          }}>
          {showPrompt ? 'Hide' : 'View'} prompt
        </button>
      </div>

      {generating && (
        <div style={{
          marginTop: '14px', padding: '16px', borderRadius: '12px',
          background: 'rgba(139,106,31,0.04)', textAlign: 'center',
        }}>
          <div className="gemini-shimmer" style={{
            width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 10px',
            background: `radial-gradient(circle, ${BE.goldStrong} 0%, transparent 70%)`,
          }} />
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '15px',
            fontStyle: 'italic', color: BE.textTertiary,
          }}>Imagining your sanctuary\u2026</p>
        </div>
      )}

      {generated && !generating && (
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '12px',
          color: BE.sage, marginTop: '10px',
        }}>✓ Background generated ({refinements}/3 refinements used)</p>
      )}

      {showPrompt && (
        <div style={{
          marginTop: '12px', padding: '14px', borderRadius: '10px',
          background: 'rgba(42,34,24,0.04)', border: `1px solid ${BE.borderGold}`,
          maxHeight: '200px', overflowY: 'auto',
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: BE.textTertiary, marginBottom: '8px',
          }}>Structured prompt sent to Gemini:</p>
          <pre style={{
            fontFamily: "'Inter', monospace", fontSize: '11px',
            color: BE.textSecondary, lineHeight: 1.6, whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>{fullPrompt}</pre>
        </div>
      )}
    </div>
  );
}

/* ── Object Manager ───────────────────────────────────── */
function ObjectManager({ objects, onAdd, onRemove, onUpdateProps, maxObjects = 7 }) {
  const [editingText, setEditingText] = React.useState({});

  return (
    <div>
      {/* Placed objects */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {objects.map(obj => {
          const def = AVAILABLE_OBJECTS.find(a => a.type === obj.type);
          return (
            <div key={obj.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', borderRadius: '10px',
              background: 'rgba(139,106,31,0.04)',
            }}>
              <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>{def?.emoji}</span>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: '13px',
                color: BE.textSecondary, flex: 1,
              }}>{def?.label}</span>

              {/* Text edit for parchment/placard */}
              {(obj.type === 'parchment' || obj.type === 'placard') && (
                <input
                  value={editingText[obj.id] ?? (obj.props?.text || obj.props?.word || '')}
                  onChange={e => {
                    setEditingText({ ...editingText, [obj.id]: e.target.value });
                    const prop = obj.type === 'placard' ? 'word' : 'text';
                    onUpdateProps(obj.id, { [prop]: e.target.value });
                  }}
                  placeholder={obj.type === 'placard' ? 'Word\u2026' : 'Passage\u2026'}
                  style={{
                    width: '100px', padding: '4px 8px', borderRadius: '6px',
                    border: `1px solid ${BE.borderGold}`, background: BE.surface,
                    fontFamily: "'Inter', sans-serif", fontSize: '11px',
                    color: BE.textPrimary, outline: 'none',
                  }}
                />
              )}

              <button onClick={() => onRemove(obj.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: BE.textTertiary, fontSize: '14px', padding: '2px 6px',
              }}>×</button>
            </div>
          );
        })}
      </div>

      {/* Add object */}
      {objects.length < maxObjects && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {AVAILABLE_OBJECTS.filter(a => !objects.find(o => o.type === a.type)).map(a => (
            <button key={a.type} onClick={() => onAdd(a.type)}
              style={{
                padding: '6px 12px', borderRadius: '100px',
                border: `1px solid ${BE.borderGold}`, background: BE.surface,
                fontFamily: "'Inter', sans-serif", fontSize: '12px', color: BE.textSecondary,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
              onMouseEnter={e => e.target.style.borderColor = BE.goldStrong}
              onMouseLeave={e => e.target.style.borderColor = BE.borderGold}
            >
              <span style={{ fontSize: '13px' }}>{a.emoji}</span> {a.label}
            </button>
          ))}
        </div>
      )}
      {objects.length >= maxObjects && (
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '11px',
          color: BE.textTertiary, fontStyle: 'italic',
        }}>Maximum {maxObjects} objects placed.</p>
      )}
    </div>
  );
}

/* ── Main Shrine Editor ───────────────────────────────── */
function ShrineEditor({ theme, objects, soundscape, visibility, sacredText, placardWord,
  onChangeTheme, onAddObject, onRemoveObject, onUpdateObjectProps,
  onChangeSoundscape, onChangeVisibility, onSave, onDiscard, onGenerate }) {

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 40%) 1fr',
      height: '100vh', overflow: 'hidden',
    }} className="shrine-editor-grid">
      {/* Left: Controls */}
      <div style={{
        background: BE.surface, overflowY: 'auto',
        padding: 'clamp(20px, 3vw, 36px)',
        borderRight: `1px solid ${BE.borderGold}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '26px',
            fontWeight: 300, color: BE.gold, letterSpacing: '-0.01em',
          }}>Design your shrine</h2>
        </div>

        <EditorSection title="Theme">
          <ThemePicker themes={window.THEMES} activeId={theme} onSelect={onChangeTheme} />
        </EditorSection>

        <EditorSection title="Generate with Gemini">
          <GeminiPromptSection theme={theme} onGenerate={onGenerate} />
        </EditorSection>

        <EditorSection title="Objects">
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '12px',
            color: BE.textTertiary, marginBottom: '12px',
          }}>Drag objects in the preview to reposition them.</p>
          <ObjectManager objects={objects}
            onAdd={onAddObject} onRemove={onRemoveObject}
            onUpdateProps={onUpdateObjectProps} />
        </EditorSection>

        <EditorSection title="Soundscape">
          <EditorRadio options={SOUNDSCAPES.map(s => ({ value: s.toLowerCase(), label: s }))}
            value={soundscape} onChange={onChangeSoundscape} />
        </EditorSection>

        <EditorSection title="Visibility">
          <EditorRadio options={VISIBILITY_OPTIONS}
            value={visibility} onChange={onChangeVisibility} />
        </EditorSection>

        {/* Save / Discard */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingBottom: '32px' }}>
          <button onClick={onSave} style={{
            padding: '12px 28px', borderRadius: '100px', border: 'none',
            background: BE.goldStrong, color: BE.darkOnGold,
            fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', transition: 'background 0.3s',
          }}>Save</button>
          <button onClick={onDiscard} style={{
            padding: '12px 20px', borderRadius: '100px',
            border: `1px solid ${BE.borderGold}`, background: 'transparent',
            fontFamily: "'Inter', sans-serif", fontSize: '14px', color: BE.textSecondary,
            cursor: 'pointer',
          }}>Discard</button>
        </div>
      </div>

      {/* Right: Live Preview */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <ShrineRoom
          theme={theme} objects={objects}
          isHost={true} guest={{ name: 'Maya', initial: 'M' }}
          candleLit={true} musicOn={false} editing={true}
          onToggleCandle={() => {}} onToggleMusic={() => {}}
          onEdit={() => {}} onLeave={onDiscard}
          onMoveObject={(id, x, y) => {
            const obj = objects.find(o => o.id === id);
            if (obj) { obj.x = x; obj.y = y; }
          }}
          onSelectObject={() => {}}
          selectedObj={null}
        />
      </div>
    </div>
  );
}

Object.assign(window, {
  ShrineEditor, buildGeminiPrompt, ThemePicker,
  GeminiPromptSection, ObjectManager, AVAILABLE_OBJECTS,
});
