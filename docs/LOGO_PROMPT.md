# Logo Prompt — Spiritual Results

**Strategy:** generate the MARK only (no text). Image models can't reliably
render lettering. We will set the wordmark "Spiritual Results" separately in
Cormorant Garamond inside the site code so the typography stays perfect.

Run the prompt below several times. Each run, swap the bracketed `SUBJECT`
line for one of the four directions listed underneath. Compare the four
families of marks. Pick the strongest concept, then iterate inside that
concept.

---

## The base prompt (paste into Flux or Gemini)

> A minimalist logo mark for a contemplative wisdom platform called *Spiritual
> Results*. The platform is a quiet sanctuary that draws from many wisdom
> traditions — Christianity, Buddhism, Sufism, Hinduism, Judaism, Stoic
> philosophy, Bahá'í, Taoism, Confucianism, Shinto, Jainism, Sikhism. It
> privileges no one tradition. The mark must feel ecumenical, ancient, warm,
> and timeless — like an emblem you might find on a 19th-century devotional
> book or a monastery seal, redrawn cleanly for today.
>
> **Subject:** [SUBJECT — see the four directions below]
>
> **Style:** minimalist single-weight line illustration. Hand-drawn ink feel,
> with subtle organic imperfection in the line — not perfectly geometric, not
> cold vector. Reminiscent of a mid-20th century book imprint logo, an
> apothecary seal, or an engraved frontispiece. A small amount of fine
> texture is welcome; heavy texture is not.
>
> **Composition:** centered, symmetric, fits within a 1:1 square. Generous
> negative space around the mark. The mark should occupy roughly the middle
> 60% of the canvas.
>
> **Color:** lines in deep warm gold (`#8B6A1F`). Background warm cream
> (`#FAF7EE`). No gradients, no glow, no shadow, no second color.
>
> **Mood words:** quiet, sacred, candlelit, parchment, hush, dawn, threshold,
> sanctuary.
>
> **Must work at 32×32 pixels** as a favicon — the silhouette has to read
> clearly even when small. Bias toward simpler shapes and fewer lines.
>
> **DO NOT include any text, letters, numbers, or words anywhere in the
> image.**
>
> **DO NOT use any specific religious or denominational symbols:** no cross,
> no crescent, no Star of David, no Om, no dharmachakra, no yin-yang, no
> nine-pointed star, no khanda, no torii gate. The mark must remain
> non-denominational.
>
> **DO NOT use:** neon colors, vibrant gradients, glassmorphism, 3D
> rendering, photographic realism, drop shadows, glow effects, sparkles,
> floating particles, emoji, or anything trendy. Avoid corporate tech-startup
> visual language entirely.
>
> Produce four (4) variations of the mark on a single sheet, arranged in a
> 2×2 grid, all using the same subject and style, varying only in interior
> detail and proportion.

---

## The four subject directions (try each one)

Replace the `[SUBJECT]` line above with ONE of these per run. Don't combine
them — each is a distinct concept.

### A. The Sanctuary Flame
> A single tall candle flame, drawn as a simple ink silhouette. The flame
> tapers gently upward. Optionally, a faint circular halo or thin enclosing
> circle around the flame, to suggest a sanctuary lamp or a vigil light. The
> flame itself is the focal element. No candle base needed — the flame can
> float, or sit on a single short horizontal line representing a wick or
> altar edge.

### B. The Threshold (the Open Doorway)
> A simple architectural arch or open doorway, drawn in a single weight of
> ink line. A pointed-Gothic or rounded-Romanesque arch — pick whichever
> reads more timeless and less specifically Christian. The doorway is empty,
> framing only soft space. The base of the arch rests on a single horizontal
> line. This is the threshold to a sanctuary.

### C. The Dawn Arc
> A horizon line with a half-sun rising behind it — the sun shown as a
> simple semicircle just clearing the horizon. Three short, evenly-spaced
> rays may extend gently upward from the sun, but no more than three. The
> horizon line extends slightly past the sun on each side. The shape
> suggests a new morning, a beginning.

### D. The Vesica (Two Overlapping Circles)
> Two equal circles overlapping by exactly half their diameter, forming a
> central almond-shaped intersection (the vesica piscis). Drawn in a single
> thin line. This ancient geometric figure appears in Christian, Sufi, and
> sacred-geometry traditions and reads as universal rather than
> denominational. Optionally, place a small single dot in the center of the
> almond. Nothing else inside the circles.

---

## After you have the mark

When you find the variation that feels right, do these three things:

1. **Save the original at maximum resolution** the model will give you (Flux
   usually does 1024×1024 or 2048×2048).
2. **Vectorize it.** Drop the PNG into a tool like `vectorizer.ai`,
   Illustrator's Image Trace, or Inkscape's "Trace Bitmap" — the final logo
   should be an SVG so it stays crisp at every size.
3. **Hand it to me.** I'll add it to the site as `/public/spiritual-results-
   mark.svg`, set the wordmark next to it in Cormorant Garamond, and produce
   a favicon set (16, 32, 48, 192, 512, plus the Apple touch icon).

---

## Optional refinements once you've picked a direction

Once you've settled on one of A–D, you can ask Flux/Gemini for variations
within that family by tacking these onto the end of the prompt:

- *"Render the same mark on a vertical 9:16 canvas for a tall stacked
  composition."*
- *"Render the same mark in pure black on white — no color — for a single-
  color version."*
- *"Show the same mark contained inside a thin circular border ring, to test
  it as a sealed emblem or watermark."*
- *"Show three weight options of the same mark: thin (1px), regular (2px),
  and bold (4px) line thickness."*
