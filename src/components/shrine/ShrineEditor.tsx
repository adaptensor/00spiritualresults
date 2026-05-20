"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShrineRoom } from "./ShrineRoom";
import { SHRINE_THEMES, getTheme } from "@/lib/shrine/themes";
import { AVAILABLE_OBJECTS, MAX_OBJECTS } from "@/lib/shrine/objects";
import { buildGeminiPrompt } from "@/lib/shrine/prompt";
import type {
  ShrineObject,
  ShrineObjectType,
  ShrineVisibility,
  Soundscape,
} from "@/lib/shrine/types";

type Props = {
  initial: {
    theme: string;
    objects: ShrineObject[];
    soundscape: Soundscape;
    visibility: ShrineVisibility;
    candleLit: boolean;
    musicOn: boolean;
    generatedBgUrl: string | null;
  };
};

const SOUNDSCAPES: Soundscape[] = ["wind", "bells", "water", "fire crackle", "silence"];
const VISIBILITY_OPTIONS: { value: ShrineVisibility; label: string }[] = [
  { value: "INVITED", label: "Invited people only" },
  { value: "LINK", label: "Anyone with the link" },
  { value: "PRIVATE", label: "Just me" },
];

export function ShrineEditor({ initial }: Props) {
  const router = useRouter();
  const [theme, setTheme] = useState(initial.theme);
  const [objects, setObjects] = useState<ShrineObject[]>(initial.objects);
  const [soundscape, setSoundscape] = useState<Soundscape>(initial.soundscape);
  const [visibility, setVisibility] = useState<ShrineVisibility>(initial.visibility);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [generatedBgUrl, setGeneratedBgUrl] = useState<string | null>(initial.generatedBgUrl);
  const [saving, startSave] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function moveObject(id: string, x: number, y: number) {
    setObjects((prev) => prev.map((o) => (o.id === id ? { ...o, x, y } : o)));
  }

  function addObject(type: ShrineObjectType) {
    if (objects.length >= MAX_OBJECTS) return;
    const def = AVAILABLE_OBJECTS.find((a) => a.type === type);
    if (!def) return;
    const newObj: ShrineObject = {
      id: `obj-${type}-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      props: { ...def.defaults },
    };
    setObjects((prev) => [...prev, newObj]);
    setSelectedObjectId(newObj.id);
  }

  function removeObject(id: string) {
    setObjects((prev) => prev.filter((o) => o.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  }

  function updateProps(id: string, partial: ShrineObject["props"]) {
    setObjects((prev) =>
      prev.map((o) => (o.id === id ? { ...o, props: { ...o.props, ...partial } } : o)),
    );
  }

  function save() {
    setSaveError(null);
    startSave(async () => {
      const res = await fetch("/api/shrine", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          objects,
          soundscape,
          visibility,
          candleLit: initial.candleLit,
          musicOn: initial.musicOn,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSaveError(body.error ?? "Could not save.");
        return;
      }
      router.push("/shrine");
      router.refresh();
    });
  }

  return (
    <div className="shrine-editor-grid grid h-screen overflow-hidden">
      {/* Left: controls */}
      <div
        className="overflow-y-auto bg-white"
        style={{
          padding: "clamp(20px, 3vw, 36px)",
          borderRight: "1px solid rgba(139,106,31,0.20)",
        }}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2
            className="text-[#8B6A1F]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 26,
              fontWeight: 300,
              letterSpacing: "-0.01em",
            }}
          >
            Design your shrine
          </h2>
          <button
            onClick={() => router.push("/shrine")}
            className="text-xs text-[#8A7A66] hover:text-[#8B6A1F]"
          >
            ← Back
          </button>
        </div>

        <EditorSection title="Theme">
          <ThemePicker activeId={theme} onSelect={setTheme} />
        </EditorSection>

        <EditorSection title="Generate with Gemini">
          <GeminiPromptSection
            theme={theme}
            generatedBgUrl={generatedBgUrl}
            onGenerated={setGeneratedBgUrl}
            onCleared={() => setGeneratedBgUrl(null)}
          />
        </EditorSection>

        <EditorSection title="Objects">
          <p className="mb-3 text-xs text-[#8A7A66]">
            Drag objects in the preview to reposition them.
          </p>
          <ObjectManager
            objects={objects}
            onAdd={addObject}
            onRemove={removeObject}
            onUpdateProps={updateProps}
          />
        </EditorSection>

        <EditorSection title="Soundscape">
          <RadioGroup
            options={SOUNDSCAPES.map((s) => ({ value: s, label: capitalize(s) }))}
            value={soundscape}
            onChange={(v) => setSoundscape(v as Soundscape)}
          />
        </EditorSection>

        <EditorSection title="Visibility">
          <RadioGroup
            options={VISIBILITY_OPTIONS}
            value={visibility}
            onChange={(v) => setVisibility(v as ShrineVisibility)}
          />
        </EditorSection>

        <div className="mt-4 flex gap-3 pb-8">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-[#B8893C] px-7 py-3 text-sm font-medium text-[#1F1810] transition hover:bg-[#A07728] disabled:cursor-default disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => router.push("/shrine")}
            className="rounded-full border border-[rgba(139,106,31,0.20)] bg-transparent px-5 py-3 text-sm text-[#5C4F3D]"
          >
            Discard
          </button>
        </div>
        {saveError && (
          <p className="text-xs text-[#A85C1B]">{saveError}</p>
        )}
      </div>

      {/* Right: live preview */}
      <div className="relative overflow-hidden">
        <ShrineRoom
          themeId={theme}
          objects={objects}
          isHost
          editing
          candleLit={initial.candleLit}
          musicOn={initial.musicOn}
          generatedBgUrl={generatedBgUrl}
          selectedObjectId={selectedObjectId}
          onMoveObject={moveObject}
          onSelectObject={setSelectedObjectId}
        />
      </div>
    </div>
  );
}

/* ── Small reusable bits ────────────────────────────────────────────── */

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <p
        className="mb-3 text-[#8A7A66]"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map((o) => (
        <label
          key={o.value}
          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 transition"
          style={{
            background: value === o.value ? "rgba(139,106,31,0.06)" : "transparent",
          }}
        >
          <input
            type="radio"
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="sr-only"
          />
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: 16,
              height: 16,
              border: `2px solid ${value === o.value ? "#B8893C" : "rgba(139,106,31,0.20)"}`,
            }}
          >
            {value === o.value && (
              <span
                className="rounded-full bg-[#B8893C]"
                style={{ width: 8, height: 8 }}
              />
            )}
          </span>
          <span className="text-[13px] text-[#5C4F3D]">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

function ThemePicker({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="grid gap-2.5"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))" }}
    >
      {SHRINE_THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          aria-label={t.name}
          className="relative overflow-hidden rounded-[10px] transition"
          style={{
            width: "100%",
            aspectRatio: "16 / 10",
            background: t.bg,
            border:
              activeId === t.id
                ? "2.5px solid #B8893C"
                : "2.5px solid transparent",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <span
            className="absolute bottom-1 left-0 right-0 text-center"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 9,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {t.name}
          </span>
        </button>
      ))}
    </div>
  );
}

function GeminiPromptSection({
  theme,
  generatedBgUrl,
  onGenerated,
  onCleared,
}: {
  theme: string;
  generatedBgUrl: string | null;
  onGenerated: (url: string) => void;
  onCleared: () => void;
}) {
  const [userInput, setUserInput] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fullPrompt = buildGeminiPrompt(userInput, theme);
  const themeName = getTheme(theme).name;

  async function generate() {
    setError(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/shrine/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: userInput.trim() || undefined,
          theme,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.imageUrl) {
        setError(body.error ?? "Generation failed. Try a different description.");
        return;
      }
      onGenerated(body.imageUrl);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function clearBg() {
    setError(null);
    const res = await fetch("/api/shrine/generate", { method: "DELETE" });
    if (res.ok) {
      onCleared();
    } else {
      setError("Could not clear the generated background.");
    }
  }

  return (
    <div>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Describe your ideal sanctuary… e.g. 'A quiet stone chapel with morning light through stained glass'"
        rows={3}
        disabled={generating}
        className="w-full rounded-xl border border-[rgba(139,106,31,0.20)] bg-[#FAF7EE] px-3.5 py-3 text-[13px] text-[#2A2218] outline-none disabled:opacity-60"
        style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6, resize: "vertical" }}
      />

      <div className="mt-2.5 flex flex-wrap gap-2">
        <button
          onClick={generate}
          disabled={generating}
          className="rounded-full bg-[#B8893C] px-5 py-2.5 text-[13px] font-medium text-[#1F1810] transition hover:bg-[#A07728] disabled:cursor-default disabled:opacity-60"
        >
          {generating
            ? "Painting your scene…"
            : generatedBgUrl
            ? "Regenerate scene"
            : "Generate with Gemini"}
        </button>

        {generatedBgUrl && !generating && (
          <button
            onClick={clearBg}
            className="rounded-full border border-[rgba(139,106,31,0.20)] bg-transparent px-4 py-2.5 text-[12px] text-[#8A7A66] hover:text-[#A85C1B]"
          >
            Clear · use preset
          </button>
        )}

        <button
          onClick={() => setShowPrompt((v) => !v)}
          className="rounded-full border border-[rgba(139,106,31,0.20)] bg-transparent px-4 py-2.5 text-[12px] text-[#8A7A66]"
        >
          {showPrompt ? "Hide" : "View"} prompt
        </button>
      </div>

      {generating && (
        <p className="mt-2 text-[11px] italic text-[#8A7A66]">
          Imagen 4 Ultra typically takes 25–40 seconds. The preview will update on its own.
        </p>
      )}

      {error && <p className="mt-2 text-[11px] text-[#A85C1B]">{error}</p>}

      {!generating && !error && (
        <p className="mt-2 text-[11px] italic text-[#8A7A66]">
          {generatedBgUrl
            ? "Generated scene is live in the preview. Save to keep, or clear to revert to the " +
              themeName +
              " preset."
            : "Currently using the " +
              themeName +
              " preset. Generate to paint a unique scene from your description."}
        </p>
      )}

      {showPrompt && (
        <div
          className="mt-3 max-h-[200px] overflow-y-auto rounded-[10px] border border-[rgba(139,106,31,0.20)] p-3.5"
          style={{ background: "rgba(42,34,24,0.04)" }}
        >
          <pre
            className="whitespace-pre-wrap break-words text-[11px] text-[#5C4F3D]"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: 1.6 }}
          >
            {fullPrompt}
          </pre>
        </div>
      )}
    </div>
  );
}

function ObjectManager({
  objects,
  onAdd,
  onRemove,
  onUpdateProps,
}: {
  objects: ShrineObject[];
  onAdd: (t: ShrineObjectType) => void;
  onRemove: (id: string) => void;
  onUpdateProps: (id: string, p: ShrineObject["props"]) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex flex-col gap-2">
        {objects.map((obj) => {
          const def = AVAILABLE_OBJECTS.find((a) => a.type === obj.type);
          const isParchment = obj.type === "parchment";
          const isPlacard = obj.type === "placard";
          return (
            <div
              key={obj.id}
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2"
              style={{ background: "rgba(139,106,31,0.04)" }}
            >
              <span className="w-6 text-center text-base">{def?.emoji}</span>
              <span className="flex-1 text-[13px] text-[#5C4F3D]">{def?.label}</span>

              {(isParchment || isPlacard) && (
                <input
                  value={isPlacard ? obj.props.word ?? "" : obj.props.text ?? ""}
                  onChange={(e) =>
                    onUpdateProps(
                      obj.id,
                      isPlacard ? { word: e.target.value } : { text: e.target.value },
                    )
                  }
                  placeholder={isPlacard ? "Word…" : "Passage…"}
                  className="w-[120px] rounded-md border border-[rgba(139,106,31,0.20)] bg-white px-2 py-1 text-[11px] text-[#2A2218] outline-none"
                />
              )}

              <button
                onClick={() => onRemove(obj.id)}
                aria-label={`Remove ${def?.label}`}
                className="text-[#8A7A66] hover:text-[#A85C1B]"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", fontSize: 14 }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {objects.length < MAX_OBJECTS ? (
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_OBJECTS.filter(
            (a) => !objects.some((o) => o.type === a.type),
          ).map((a) => (
            <button
              key={a.type}
              onClick={() => onAdd(a.type)}
              className="flex items-center gap-1 rounded-full border border-[rgba(139,106,31,0.20)] bg-white px-3 py-1.5 text-[12px] text-[#5C4F3D] transition hover:border-[#B8893C]"
            >
              <span className="text-[13px]">{a.emoji}</span> {a.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[11px] italic text-[#8A7A66]">
          Maximum {MAX_OBJECTS} objects placed.
        </p>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
