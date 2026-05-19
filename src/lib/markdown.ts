/**
 * Tiny markdown → HTML renderer. Intentionally minimal so we don't pull in a
 * heavy dep for v1. Supports: headings, paragraphs, bold/italic, blockquotes,
 * unordered/ordered lists, links. Escapes HTML by default.
 *
 * For Phase 2: swap to `react-markdown` + `remark-gfm` once we need tables,
 * footnotes, syntax highlighting, etc.
 */
export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inUl = false;
  let inOl = false;
  let inBlockquote = false;
  let paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length) {
      out.push(`<p>${inline(paraBuf.join(" "))}</p>`);
      paraBuf = [];
    }
  };
  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };
  const closeBlockquote = () => {
    if (inBlockquote) {
      out.push("</blockquote>");
      inBlockquote = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line === "") {
      flushPara();
      closeLists();
      closeBlockquote();
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara();
      closeLists();
      closeBlockquote();
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith("> ")) {
      flushPara();
      closeLists();
      if (!inBlockquote) {
        out.push("<blockquote>");
        inBlockquote = true;
      }
      out.push(`<p>${inline(line.slice(2))}</p>`);
      continue;
    }

    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul) {
      flushPara();
      closeBlockquote();
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        out.push("<ul>");
        inUl = true;
      }
      out.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      flushPara();
      closeBlockquote();
      if (inUl) {
        out.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }

    closeLists();
    paraBuf.push(line);
  }

  flushPara();
  closeLists();
  closeBlockquote();
  return out.join("\n");
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string): string {
  // Escape first, then re-introduce safe inline markup.
  let r = esc(s);
  // Links [text](href) — only allow http(s) and / paths.
  r = r.replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g, (_, t, h) => {
    return `<a href="${h}" rel="noopener noreferrer">${t}</a>`;
  });
  // Bold **text**
  r = r.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic *text* or _text_
  r = r.replace(/(^|[\s(])\*([^*]+)\*(?=[\s.,;:!?)]|$)/g, "$1<em>$2</em>");
  r = r.replace(/(^|[\s(])_([^_]+)_(?=[\s.,;:!?)]|$)/g, "$1<em>$2</em>");
  return r;
}
