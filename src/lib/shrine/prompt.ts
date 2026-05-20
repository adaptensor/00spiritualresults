import { getTheme } from "./themes";

export function buildGeminiPrompt(userInput: string | undefined, themeId: string): string {
  const theme = getTheme(themeId);
  const preset = `Starting from the "${theme.name}" theme: ${theme.desc} `;
  const desc = userInput?.trim() || "(no description — use the preset theme)";

  return `You are generating a background scene for a contemplative digital sanctuary.

STYLE CONSTRAINTS:
- Painterly, illustrated style — NOT photographic
- Calm, contemplative mood with dawn or dusk lighting
- Low contrast, warm earth-tone palette (ambers, creams, deep browns, sage greens)
- No people, no text, no faces, no animals
- Aspect ratio: 16:9 (1920×1080)
- Leave the center 40% relatively uncluttered (objects will be overlaid)
- Edges should have atmospheric depth and gentle darkening

${preset}
USER'S DESCRIPTION:
${desc}

MOOD WORDS: quiet · warm · candlelit · parchment · prayerful · breath · hush · dawn · dusk · still

Generate a single image that serves as the background of a digital meditation room.`;
}
