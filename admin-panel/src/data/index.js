// ─────────────────────────────────────────────────────────────────────────────
// Single entry point for all data access in the admin panel.
//
// No axios, no fetch, no backend. Every store below is backed by the shared
// localStorage database in mockDb.js — the SAME database the public website
// reads from. Publish a service here and it appears on the site.
//
// Method names (list / getOne / create / update / remove / publish) match what
// a real REST client would expose, so swapping in a live API later means
// editing mockDb.js only — no page component has to change.
//
// No user management, no activity logging, no admin-editable settings — this
// panel has a single fixed admin account (see AuthContext.jsx) and site
// settings are fixed config seeded in seed.js.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createCollection,
  readDb,
  slugify,
  subscribe,
  resetDb,
} from './mockDb.js';

// ── Slugs: the forms don't ask for one, so derive it from the title ─────────
// Without this, anything created in the admin panel would have no slug and the
// public site's /services/:slug routes could never find it.
function ensureUniqueSlug(collection, item) {
  const base = slugify(item.slug || item.title || 'untitled') || 'untitled';
  const taken = (readDb()[collection] || [])
    .filter((r) => r._id !== item._id)
    .map((r) => r.slug);

  let slug = base;
  let n = 2;
  while (taken.includes(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

// ── Collections ─────────────────────────────────────────────────────────────

export const servicesApi = createCollection('services', {
  idPrefix: 'svc',
  beforeWrite: (item) => ({
    ...item,
    slug: ensureUniqueSlug('services', item),
    subServices: item.subServices || [],
    images: item.images || [],
    isPublished: item.isPublished ?? false,
  }),
});

export const portfolioApi = createCollection('portfolio', {
  idPrefix: 'proj',
  beforeWrite: (item) => ({
    ...item,
    slug: ensureUniqueSlug('portfolio', item),
    technologies: item.technologies || [],
    isPublished: item.isPublished ?? false,
    isFeatured: item.isFeatured ?? false,
  }),
});

export const blogApi = createCollection('blogs', {
  publishField: 'status',
  idPrefix: 'blog',
  beforeWrite: (item) => {
    const next = {
      ...item,
      slug: ensureUniqueSlug('blogs', item),
      author: item.author || 'Admin',
      seoMeta: item.seoMeta || { metaTitle: '', metaDescription: '' },
    };
    // Stamp the publish date the first time it goes live; clear it if it
    // returns to draft, so the site never shows a phantom date.
    if (next.status === 'published' && !next.publishedAt) {
      next.publishedAt = new Date().toISOString();
    }
    if (next.status !== 'published') next.publishedAt = null;
    return next;
  },
});

export const testimonialsApi = createCollection('testimonials', { idPrefix: 'test' });

export const jobsApi = createCollection('jobs', {
  publishField: 'status',
  idPrefix: 'job',
  beforeWrite: (item) => ({
    ...item,
    slug: ensureUniqueSlug('jobs', item),
    requirements: item.requirements || [],
    responsibilities: item.responsibilities || [],
    status: item.status || 'open',
  }),
});

export const applicationsApi = createCollection('applications', { publishField: 'status', idPrefix: 'app' });

export const leadsApi = createCollection('leads', { publishField: 'status', idPrefix: 'lead' });

// resetDb() wipes local changes and restores the seed. Also available in the
// browser console as resetDemoData().
export { resetDb, subscribe, readDb };