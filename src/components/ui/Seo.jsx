import { useEffect } from 'react'

// Lightweight per-page meta tag manager (no extra dependency needed for this scope).
export default function Seo({ title, description }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — Nexbyte` : 'Nexbyte — Software House'
    document.title = fullTitle

    const setMeta = (name, content) => {
      if (!content) return
      let tag = document.querySelector(`meta[name="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    setMeta('description', description || 'Nexbyte builds web, mobile, and custom software products for startups and businesses worldwide.')
  }, [title, description])

  return null
}
