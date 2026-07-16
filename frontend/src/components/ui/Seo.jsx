import { useEffect } from 'react'

// Lightweight per-page meta tag manager (no extra dependency needed for this scope).
//
// Extended version: in addition to <title> and description, it now manages
// Open Graph + Twitter Card tags (so shared links unfurl with a proper
// title/description/image on WhatsApp, LinkedIn, X, Slack, etc.) and a
// canonical URL for the current route.
//
// Usage stays the same as before — existing <Seo title description /> calls
// keep working. Pages can optionally pass `image` (absolute URL) and `type`.
//   <Seo title="Portfolio" description="..." />
//   <Seo title={post.title} description={post.excerpt} image={post.coverImage} type="article" />

const SITE_NAME = 'DevInt.Tech'
const DEFAULT_TITLE = 'DevInt.Tech — Custom Software, Web & Mobile Development'
const DEFAULT_DESCRIPTION =
  'DevInt.Tech builds modern web, mobile, and SaaS products for startups and growing businesses.'
// Set this to your production origin before launch, e.g. 'https://devint.tech'.
// Falls back to the current origin so it also works in dev/preview.
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : ''
// Default share image — put an og-image (1200×630) in /public and update the path.
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

function setNamedMeta(name, content) {
  if (!content) return
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setPropertyMeta(property, content) {
  if (!content) return
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export default function Seo({ title, description, image, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
    const desc = description || DEFAULT_DESCRIPTION
    const img = image || DEFAULT_IMAGE
    const url = `${SITE_URL}${window.location.pathname}`

    document.title = fullTitle
    setNamedMeta('description', desc)
    setCanonical(url)

    // Open Graph (WhatsApp, LinkedIn, Facebook, Slack…)
    setPropertyMeta('og:site_name', SITE_NAME)
    setPropertyMeta('og:type', type)
    setPropertyMeta('og:title', fullTitle)
    setPropertyMeta('og:description', desc)
    setPropertyMeta('og:url', url)
    setPropertyMeta('og:image', img)

    // Twitter / X cards
    setNamedMeta('twitter:card', 'summary_large_image')
    setNamedMeta('twitter:title', fullTitle)
    setNamedMeta('twitter:description', desc)
    setNamedMeta('twitter:image', img)
  }, [title, description, image, type])

  return null
}