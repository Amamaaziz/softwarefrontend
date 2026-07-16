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

// ── Services — real API ──────────────────────────────────────────────────
export const servicesApi = {
  list: () =>
    http.get('/admin/services').then((r) => ({
      ...r.data,
      total: r.data.data.length,
    })),
  getOne: (id) => http.get(`/admin/services/${id}`).then((r) => r.data),
  create: (payload) => http.post('/admin/services', payload).then((r) => r.data),
  update: (id, payload) => http.patch(`/admin/services/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/admin/services/${id}`).then((r) => r.data),
  delete: (id) => http.delete(`/admin/services/${id}`).then((r) => r.data),
  publish: (id, isPublished) =>
    http.patch(`/admin/services/${id}/publish`, { isPublished }).then((r) => r.data),
};

// ── Portfolio — real API ──────────────────────────────────────────────────
// NOTE: getOne currently points at /portfolios/id/:id, which has no
// matching backend route yet — see flag above. Needs a backend fix before
// editing an existing portfolio item will work.
export const portfolioApi = {
  list: () =>
    http.get('/portfolios', { params: { all: 'true', limit: 50 } }).then((r) => ({
      ...r.data,
      data: r.data.data.items,
      total: r.data.data.pagination.total,
    })),
  getOne: (id) => http.get(`/portfolios/id/${id}`).then((r) => r.data),
  create: (payload) => http.post('/portfolios', payload).then((r) => r.data),
  update: (id, payload) => http.patch(`/portfolios/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/portfolios/${id}`).then((r) => r.data),
  publish: (id, isPublished) => http.patch(`/portfolios/${id}`, { isPublished }).then((r) => r.data),
};

// ── Blog — real API ──────────────────────────────────────────────────────
export const blogApi = {
  list: () =>
    http.get('/admin/blogs').then((r) => ({
      ...r.data,
      data: r.data.data.data,
      total: r.data.data.total,
    })),

  getOne: (id) => http.get(`/admin/blogs/${id}`).then((r) => r.data),
  create: (payload) => http.post('/admin/blogs', payload).then((r) => r.data),
  update: (id, payload) => http.patch(`/admin/blogs/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/admin/blogs/${id}`).then((r) => r.data),
  delete: (id) => http.delete(`/admin/blogs/${id}`).then((r) => r.data),
};
// ── Jobs — real API ───────────────────────────────────────────────────────
// No .publish() — JobsList.jsx toggles status directly via update(), same
// pattern as blogApi.
export const jobsApi = {
  list: () => http.get('/admin/jobs').then((r) => r.data),
  getOne: (id) => http.get(`/admin/jobs/${id}`).then((r) => r.data),
  create: (payload) => http.post('/admin/jobs', payload).then((r) => r.data),
  update: (id, payload) => http.patch(`/admin/jobs/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/admin/jobs/${id}`).then((r) => r.data),
  delete: (id) => http.delete(`/admin/jobs/${id}`).then((r) => r.data),
};

// ── Applications — real API ────────────────────────────────────────────────
// No .create() — applications are only ever created by the public
// submitJobApplication() flow, never from the admin panel.
export const applicationsApi = {
  list: () => http.get('/admin/applications').then((r) => r.data),
  getOne: (id) => http.get(`/admin/applications/${id}`).then((r) => r.data),
  update: (id, payload) => http.patch(`/admin/applications/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/admin/applications/${id}`).then((r) => r.data),
  delete: (id) => http.delete(`/admin/applications/${id}`).then((r) => r.data),
};

// ── Everything else — still mock, unchanged ──────────────────────────────

export const testimonialsApi = {
  list: () => http.get('/admin/testimonials').then((r) => ({
    ...r.data,
    total: r.data.data.length,
  })),
  getOne: (id) => http.get(`/admin/testimonials/${id}`).then((r) => r.data),
  create: (payload) => http.post('/admin/testimonials', payload).then((r) => r.data),
  update: (id, payload) => http.patch(`/admin/testimonials/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/admin/testimonials/${id}`).then((r) => r.data),
  delete: (id) => http.delete(`/admin/testimonials/${id}`).then((r) => r.data),
  publish: (id, isPublished) =>
    http.patch(`/admin/testimonials/${id}/publish`, { isPublished }).then((r) => r.data),
};

export const leadsApi = {
  list: () => http.get('/admin/leads').then((r) => r.data),
  getOne: (id) => http.get(`/admin/leads/${id}`).then((r) => r.data),
  update: (id, payload) => http.patch(`/admin/leads/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/admin/leads/${id}`).then((r) => r.data),
  delete: (id) => http.delete(`/admin/leads/${id}`).then((r) => r.data),
};

export { resetDb, subscribe, readDb };