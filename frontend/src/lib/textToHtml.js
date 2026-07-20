// Converts plain text (with optional "- " or "* " bullets) into safe HTML.
// Groups consecutive bullet lines into a <ul>, everything else into <p> tags.

// Some stored text already contains literal HTML entities (e.g. "&amp;"
// typed directly into a form field). Exported so plain-text fields like
// titles — which don't go through textToHtml() — can also be cleaned up
// before rendering.
export function decodeCommonEntities(str) {
  if (!str) return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeHtml(str) {
  return decodeCommonEntities(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function textToHtml(text) {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const bulletMatch = line.match(/^[-]\s+(.+)/);

    if (bulletMatch) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${escapeHtml(bulletMatch[1])}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (line) {
        html += `<p>${escapeHtml(line)}</p>`;
      }
    }
  }

  if (inList) html += '</ul>';

  return html;
}