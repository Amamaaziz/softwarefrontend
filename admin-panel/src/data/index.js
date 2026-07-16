import { http } from '../lib/http.js';
import {
  createCollection,
  readDb,
  slugify,
  subscribe,
  resetDb,
} from './mockDb.js';

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

// ── Services — now backed by the real API, not mockDb ───────────────────────
export const servicesApi = {
  list: () => http.get('/admin/services').then((r) => r.data),
  getOne: (id) => http.get(`/admin/services/${id}`).then((r) => r.data),
  create: (payload) => http.post('/admin/services', payload).then((r) => r.data),
  update: (id, payload) => http.patch(`/admin/services/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/admin/services/${id}`).then((r) => r.data),
  delete: (id) => http.delete(`/admin/services/${id}`).then((r) => r.data),
  publish: (id, isPublished) =>
    http.patch(`/admin/services/${id}/publish`, { isPublished }).then((r) => r.data),
};

// ── Everything else — still mock, unchanged ──────────────────────────────────

export const portfolioApi = {
  list: () =>
    http.get('/portfolios', { params: { all: 'true', limit: 50 } }).then((r) => ({
      ...r.data,
      data: r.data.data.items,
    })),
  getOne: (id) => http.get(`/portfolios/id/${id}`).then((r) => r.data),
  create: (payload) => http.post('/portfolios', payload).then((r) => r.data),
  update: (id, payload) => http.patch(`/portfolios/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/portfolios/${id}`).then((r) => r.data),
  publish: (id, isPublished) => http.patch(`/portfolios/${id}`, { isPublished }).then((r) => r.data),
};

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

export { resetDb, subscribe, readDb };