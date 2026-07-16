// ─────────────────────────────────────────────────────────────────────────────
// The public website's "API".
//
// Services now come from the real backend (see lib/http.js). Everything else
// still reads from the shared localStorage database (src/data/mockDb.js) until
// those modules get the same treatment.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';
import { readDb, writeDb, uid, delay } from '../data/mockDb.js';

const http = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
const byNewest = (a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0);

// ── Reads ───────────────────────────────────────────────────────────────────

export async function getServices() {
  const { data } = await http.get('/services');
  return (data.data || []).sort(byOrder);
}

export async function getServiceBySlug(slug) {
  const { data } = await http.get(`/services/${slug}`);
  return data.data; // null if not found — see note below
}

export async function getPortfolio() {
  const { data } = await http.get('/portfolios', { params: { limit: 50 } });
  return data.data.items;
}

export async function getFeaturedPortfolio() {
  const { data } = await http.get('/portfolios', { params: { featured: 'true', limit: 50 } });
  return data.data.items;
}

export async function getPortfolioBySlug(slug) {
  try {
    const { data } = await http.get(`/portfolios/${slug}`);
    return data.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function getBlogs() {
  const { data } = await http.get('/blogs');
  return data.data || [];
}

export async function getBlogBySlug(slug) {
  const { data } = await http.get(`/blogs/${slug}`);
  return data.data;
}

export async function getTestimonials() {
  await delay(300);
  return (readDb().testimonials || []).filter((t) => t.isPublished);
}

export async function getJobs() {
  await delay(400);
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

// ── Writes (unchanged — still mock) ─────────────────────────────────────────

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
      resumeUrl: '',
      status: 'new',
      createdAt: new Date().toISOString(),
    },
    ...(db.applications || []),
  ];
  writeDb(db);
  return { success: true };
}

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