// ─────────────────────────────────────────────────────────────────────────────
// Compatibility layer.
//
// The site's data now comes from the shared localStorage database (mockDb.js),
// which the admin panel writes to. This file keeps the old named exports
// (COMPANY, SERVICES, …) working for the components that import them directly
// — the navbar, footer, contact page, and legal pages.
//
// These are snapshots taken when the page loads. Data-driven pages use
// src/lib/api.js instead and refresh live when the admin panel saves something.
// ─────────────────────────────────────────────────────────────────────────────

import { readDb } from './mockDb.js';

const db = readDb();
const settings = db.settings;

export const COMPANY = {
  name: settings.companyName,
  tagline: settings.tagline,
  foundedYear: settings.foundedYear,
  email: settings.contactEmail,
  phone: settings.contactPhone,
  address: settings.officeAddress,
  logo: settings.logo,
  social: {
    linkedin: settings.social?.linkedin || '#',
    twitter: settings.social?.twitter || '#',
    github: settings.social?.github || '#',
    instagram: settings.social?.instagram || '#',
    facebook: settings.social?.facebook || '#',
  },
  stats: settings.stats || [],
  seo: settings.seoDefaults || {},
};

export const SERVICES = (db.services || []).filter((s) => s.isPublished).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
export const PORTFOLIO = (db.portfolio || []).filter((p) => p.isPublished);
export const BLOGS = (db.blogs || []).filter((b) => b.status === 'published');
export const TESTIMONIALS = (db.testimonials || []).filter((t) => t.isPublished);
export const JOBS = db.jobs || [];
