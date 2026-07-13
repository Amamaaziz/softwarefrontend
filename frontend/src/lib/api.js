// ─────────────────────────────────────────────────────────────────────────────
// The public website's "API".
//
// There is no backend. These functions read from the shared localStorage
// database (src/data/mockDb.js) that the admin panel writes to. Anything the
// admin publishes shows up here; anything a visitor submits (contact form,
// job application, newsletter) is written back and appears in the admin panel
// under Leads / Applications.
//
// Every function returns a Promise and simulates latency, so loading states
// stay visible. To go live later, keep these names and swap the bodies:
//   export const getServices = () => axios.get('/api/services').then(r => r.data)
// ─────────────────────────────────────────────────────────────────────────────

import { readDb, writeDb, uid, delay } from '../data/mockDb.js';

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
const byNewest = (a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0);

// ── Reads ───────────────────────────────────────────────────────────────────

export async function getServices() {
  await delay(400);
  return (readDb().services || []).filter((s) => s.isPublished).sort(byOrder);
}

export async function getServiceBySlug(slug) {
  await delay(400);
  return (readDb().services || []).find((s) => s.slug === slug && s.isPublished) || null;
}

export async function getPortfolio() {
  await delay(400);
  return (readDb().portfolio || []).filter((p) => p.isPublished);
}

export async function getFeaturedPortfolio() {
  await delay(300);
  return (readDb().portfolio || []).filter((p) => p.isPublished && p.isFeatured);
}

export async function getPortfolioBySlug(slug) {
  await delay(400);
  return (readDb().portfolio || []).find((p) => p.slug === slug && p.isPublished) || null;
}

export async function getBlogs() {
  await delay(400);
  return (readDb().blogs || []).filter((b) => b.status === 'published').sort(byNewest);
}

export async function getBlogBySlug(slug) {
  await delay(400);
  return (readDb().blogs || []).find((b) => b.slug === slug && b.status === 'published') || null;
}

export async function getTestimonials() {
  await delay(300);
  return (readDb().testimonials || []).filter((t) => t.isPublished);
}

export async function getJobs() {
  await delay(400);
  // The careers page shows closed roles too (greyed out), so return everything.
  return readDb().jobs || [];
}

export async function getJobBySlug(slug) {
  await delay(400);
  return (readDb().jobs || []).find((j) => j.slug === slug) || null;
}

export async function getSettings() {
  await delay(150);
  return readDb().settings;
}

// ── Writes (these are what make the admin panel's Leads / Applications real) ─

/** Contact form → a new lead in the admin panel. */
export async function submitContactForm(payload) {
  await delay(600);
  const db = readDb();
  db.leads = [
    {
      _id: uid('lead'),
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      category: payload.category || '',
      message: payload.message,
      source: 'contact',
      status: 'new',
      createdAt: new Date().toISOString(),
    },
    ...(db.leads || []),
  ];
  writeDb(db);
  return { success: true };
}

/**
 * Careers form → a new application in the admin panel.
 * The two forms on the site send different shapes: the job detail page sends
 * `job` (a slug), the careers page sends `applyFor` (a job title). Resolve
 * either into the { _id, title } object the admin Applications page expects.
 */
export async function submitJobApplication(payload) {
  await delay(600);
  const db = readDb();
  const jobs = db.jobs || [];

  const matched =
    jobs.find((j) => j.slug === payload.job) ||
    jobs.find((j) => j._id === payload.job) ||
    jobs.find((j) => j.title === payload.applyFor) ||
    jobs.find((j) => j.title === payload.job) ||
    null;

  const { job, applyFor, resume, ...rest } = payload;

  db.applications = [
    {
      _id: uid('app'),
      job: matched
        ? { _id: matched._id, title: matched.title }
        : { _id: '', title: applyFor || job || 'General application' },
      ...rest,
      resumeUrl: '', // no file storage without a backend — we keep the filename
      status: 'new',
      createdAt: new Date().toISOString(),
    },
    ...(db.applications || []),
  ];
  writeDb(db);
  return { success: true };
}

/** Newsletter signup → a lead tagged with source: 'newsletter'. */
export async function submitNewsletter(email) {
  await delay(400);
  const db = readDb();
  db.leads = [
    {
      _id: uid('lead'),
      name: email.split('@')[0],
      email,
      phone: '',
      message: 'Subscribed to the newsletter.',
      source: 'newsletter',
      status: 'new',
      createdAt: new Date().toISOString(),
    },
    ...(db.leads || []),
  ];
  writeDb(db);
  return { success: true };
}
