/**
 * Renders content authored in the admin panel's rich text editor.
 *
 * Admin fields (service descriptions, case study sections, blog bodies, job
 * descriptions) are stored as HTML. Rendering them as plain text would print
 * the tags on screen, so we inject them instead — but only after stripping
 * <script>, <iframe>, <style>, and inline event handlers.
 *
 * A note for the report: this is safe enough here because the only author is a
 * logged-in admin, and the sanitizer below is deliberately simple. If this ever
 * accepts untrusted input, swap in DOMPurify (`npm i dompurify`) and call
 * DOMPurify.sanitize() in place of `sanitize()`.
 */

const looksLikeHtml = (value) => typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value)

function sanitize(html) {
  return String(html)
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
}

export default function RichText({ html, className = '' }) {
  if (!html) return null

  if (!looksLikeHtml(html)) {
    return <p className={className}>{html}</p>
  }

  return (
    <div
      className={`rich-text ${className}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  )
}
