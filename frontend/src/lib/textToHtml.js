// Converts plain text (with optional "- " or "* " bullets) into safe HTML.
// Groups consecutive bullet lines into a <ul>, everything else into <p> tags.

function escapeHtml(str) {
  return str
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