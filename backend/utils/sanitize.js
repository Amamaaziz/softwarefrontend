// utils/sanitize.js

const sanitizeHtmlLib = require("sanitize-html");

/**
 * Two distinct sanitization functions with two distinct threat models:
 *
 * - sanitizeText(): for fields that should NEVER contain markup at all
 *   (titles, names, slugs, categories, tags). Strips ALL tags.
 *
 * - sanitizeHtml(): for genuine rich-text fields (portfolio/blog
 *   descriptions) where the admin panel's WYSIWYG editor legitimately
 *   produces HTML that needs to render on the public frontend. Allows a
 *   tight, explicit allowlist of tags/attributes — everything else
 *   (script, iframe, on* handlers, style, svg, etc.) is stripped.
 *
 * Why this matters: even though Prisma parameterizes DB queries (no SQL
 * injection risk), unsanitized HTML stored in the DB becomes a STORED XSS
 * vector the moment the public React frontend renders it — e.g. via
 * dangerouslySetInnerHTML for rich descriptions. Sanitizing on the way IN
 * (here) means every consumer of this data is protected without having
 * to remember to sanitize on the way OUT.
 */

// ---- Plain text sanitization ----

/**
 * Strips all HTML tags and normalizes whitespace/control characters.
 * Use for: titles, names, slugs, categories, client names, tags, short text.
 */
function sanitizeText(input) {
  if (input === null || input === undefined) return "";

  const str = String(input);

  const noTags = sanitizeHtmlLib(str, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  });

  return noTags
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // strip control chars (keeps \n, \t)
    .replace(/\s+/g, " ")
    .trim();
}

// ---- Rich text (HTML) sanitization ----

const RICH_TEXT_ALLOWED_TAGS = [
  "p", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "mark",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div",
];

const RICH_TEXT_ALLOWED_ATTRIBUTES = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
  span: ["class"],
  div: ["class"],
  "*": [], // no global attributes (blocks style="", onclick, etc. on every other tag)
};

/**
 * Sanitizes rich-text HTML for fields like portfolio/blog descriptions.
 * Allows a curated tag/attribute set; strips everything else including
 * <script>, <iframe>, event handlers (onerror, onclick, ...), inline
 * <style>, and javascript: URLs.
 */
function sanitizeHtml(input) {
  if (input === null || input === undefined) return "";

  const str = String(input);

  return sanitizeHtmlLib(str, {
    allowedTags: RICH_TEXT_ALLOWED_TAGS,
    allowedAttributes: RICH_TEXT_ALLOWED_ATTRIBUTES,
    // Only allow http/https/mailto links — blocks javascript:, data:, vbscript: schemes
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"], // no data: URIs for images — prevents payload smuggling via base64
    },
    // Force safe defaults on links regardless of what the editor produced
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      }),
    },
    disallowedTagsMode: "discard",
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
  });
}

// ---- Filename sanitization (used by upload.middleware.js later) ----

/**
 * Sanitizes a filename for safe storage on disk / in a URL path.
 * Prevents path traversal (../../etc/passwd) and strips characters
 * that are problematic across filesystems.
 */
function sanitizeFilename(filename) {
  if (!filename) return "";

  const base = String(filename)
    .replace(/^.*[\\/]/, "") // strip any directory component
    .replace(/\.\./g, "")     // strip traversal sequences
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 200);

  return base || "file";
}

module.exports = {
  sanitizeText,
  sanitizeHtml,
  sanitizeFilename,
};