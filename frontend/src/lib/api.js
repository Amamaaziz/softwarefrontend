// ─────────────────────────────────────────────────────────────────────────────
// The public website's "API".
//
// Services now come from the real backend (see lib/http.js). Everything else
// still reads from the shared localStorage database (src/data/mockDb.js) until
// those modules get the same treatment.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';
import { readDb, writeDb, uid, delay } from '../data/mockDb.js';

// In Docker/production this comes from the VITE_API_URL build arg (see
// frontend.Dockerfile / docker-compose.yml). Falls back to localhost for
// plain `npm run dev`.
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : 'http://localhost:5000/api/v1';

const http = axios.create({ baseURL: API_BASE_URL });

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
  return data.data?.data || [];
}
export async function getBlogBySlug(slug) {
  const { data } = await http.get(`/blogs/${slug}`);
  return data.data;
}

export async function getTestimonials() {
  const { data } = await http.get('/testimonials');
  return data.data || [];
}

export async function getJobs() {
  const { data } = await http.get('/jobs');
  return data.data || [];
}

export async function getJobBySlug(slug) {
  try {
    const { data } = await http.get(`/jobs/${slug}`);
    return data.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function getSettings() {
  await delay(150);
  return readDb().settings;
}

export async function getTeam() {
  const { data } = await http.get('/team');
  return data.data || [];
}

// ── Writes (unchanged — still mock) ─────────────────────────────────────────
export async function submitContactForm(payload) {
  const { data } = await http.post('/leads', payload);
  return data;
}
export async function submitJobApplication(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'resumeFile') return;
    if (value !== undefined && value !== null) formData.append(key, value);
  });

  if (payload.resumeFile) {
    formData.append('resume', payload.resumeFile);
  }

  // Do NOT set Content-Type manually — axios needs to set the multipart
  // boundary itself based on the FormData instance.
  const { data } = await http.post('/applications', formData);
  return data;
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