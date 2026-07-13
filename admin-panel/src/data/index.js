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
// ─────────────────────────────────────────────────────────────────────────────

import {
  createCollection,
  settingsStore,
  readDb,
  writeDb,
  resetDb,
  slugify,
  uid,
  delay,
  subscribe,
} from './mockDb.js';

// ── Who is doing the writing (for createdBy + activity logs) ────────────────
function currentUser() {
  try {
    const cached = window.sessionStorage.getItem('adminUser');
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }
  return { _id: 'user-1', name: 'Admin' };
}

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

// ── Activity log ────────────────────────────────────────────────────────────
function logActivity(action, moduleName, description) {
  const db = readDb();
  const user = currentUser();
  db.activityLogs = [
    {
      _id: uid('log'),
      user: { _id: user._id, name: user.name },
      action,
      module: moduleName,
      description,
      createdAt: new Date().toISOString(),
    },
    ...(db.activityLogs || []),
  ].slice(0, 200); // don't let the log grow forever
  writeDb(db);
}

/** Wraps a collection so every write shows up on the Activity Logs page. */
function withLogging(store, moduleName, label = (r) => r?.title || r?.name || r?._id) {
  const singular = moduleName.toLowerCase().replace(/s$/, '');

  const wrapped = {
    ...store,
    create: async (payload) => {
      const res = await store.create(payload);
      logActivity('create', moduleName, `Created ${singular}: ${label(res.data)}`);
      return res;
    },
    update: async (id, payload) => {
      const res = await store.update(id, payload);
      const keys = Object.keys(payload || {});
      const isStatusOnly = keys.length === 1 && ['status', 'isPublished', 'isActive'].includes(keys[0]);

      if (isStatusOnly) {
        const value = payload[keys[0]];
        const isLive = value === true || value === 'published' || value === 'open';
        logActivity(isLive ? 'publish' : 'update', moduleName, `Set ${label(res.data)} to "${value}"`);
      } else {
        logActivity('update', moduleName, `Updated ${singular}: ${label(res.data)}`);
      }
      return res;
    },
    remove: async (id) => {
      const res = await store.remove(id);
      logActivity('delete', moduleName, `Deleted ${singular}: ${label(res.data.removed)}`);
      return res;
    },
    publish: async (id, value) => {
      const res = await store.publish(id, value);
      logActivity(
        value ? 'publish' : 'update',
        moduleName,
        `${value ? 'Published' : 'Unpublished'} ${singular}: ${label(res.data)}`
      );
      return res;
    },
  };

  // Some pages call `.delete(id)` rather than `.remove(id)` — support both.
  wrapped.delete = wrapped.remove;
  return wrapped;
}

// ── Collections ─────────────────────────────────────────────────────────────

export const servicesApi = withLogging(
  createCollection('services', {
    idPrefix: 'svc',
    beforeWrite: (item, { mode }) => ({
      ...item,
      slug: ensureUniqueSlug('services', item),
      subServices: item.subServices || [],
      images: item.images || [],
      isPublished: item.isPublished ?? false,
      createdBy: mode === 'create' ? currentUser()._id : item.createdBy,
    }),
  }),
  'Services'
);

export const portfolioApi = withLogging(
  createCollection('portfolio', {
    idPrefix: 'proj',
    beforeWrite: (item, { mode }) => ({
      ...item,
      slug: ensureUniqueSlug('portfolio', item),
      technologies: item.technologies || [],
      isPublished: item.isPublished ?? false,
      isFeatured: item.isFeatured ?? false,
      createdBy: mode === 'create' ? currentUser()._id : item.createdBy,
    }),
  }),
  'Portfolio'
);

export const blogApi = withLogging(
  createCollection('blogs', {
    publishField: 'status',
    idPrefix: 'blog',
    beforeWrite: (item, { mode }) => {
      const next = {
        ...item,
        slug: ensureUniqueSlug('blogs', item),
        author: item.author || currentUser().name,
        seoMeta: item.seoMeta || { metaTitle: '', metaDescription: '' },
      };
      // Stamp the publish date the first time it goes live; clear it if it
      // returns to draft, so the site never shows a phantom date.
      if (next.status === 'published' && !next.publishedAt) {
        next.publishedAt = new Date().toISOString();
      }
      if (next.status !== 'published') next.publishedAt = null;
      if (mode === 'create') next.createdBy = currentUser()._id;
      return next;
    },
  }),
  'Blog'
);

export const testimonialsApi = withLogging(
  createCollection('testimonials', { idPrefix: 'test' }),
  'Testimonials',
  (r) => r?.clientName || r?._id
);

export const jobsApi = withLogging(
  createCollection('jobs', {
    publishField: 'status',
    idPrefix: 'job',
    beforeWrite: (item, { mode }) => ({
      ...item,
      slug: ensureUniqueSlug('jobs', item),
      requirements: item.requirements || [],
      responsibilities: item.responsibilities || [],
      status: item.status || 'open',
      postedBy: mode === 'create' ? currentUser()._id : item.postedBy,
    }),
  }),
  'Jobs'
);

export const applicationsApi = withLogging(
  createCollection('applications', { publishField: 'status', idPrefix: 'app' }),
  'Applications',
  (r) => r?.applicantName || r?._id
);

export const leadsApi = withLogging(
  createCollection('leads', { publishField: 'status', idPrefix: 'lead' }),
  'Leads',
  (r) => r?.name || r?._id
);

export const usersApi = withLogging(
  createCollection('users', {
    publishField: 'isActive',
    idPrefix: 'user',
    beforeWrite: (item) => {
      // Never persist a password — there is no auth backend, and every seeded
      // user signs in with the shared demo password (see AuthContext).
      const { password, confirmPassword, ...rest } = item;
      return {
        ...rest,
        isActive: rest.isActive ?? true,
        role: rest.role || 'content_editor',
      };
    },
  }),
  'Users',
  (r) => r?.name || r?.email || r?._id
);

// Activity logs are read-only from the UI's point of view.
const activityLogsCollection = createCollection('activityLogs', { idPrefix: 'log' });
export const activityLogsApi = {
  list: async () => {
    const res = await activityLogsCollection.list();
    const data = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { data, total: data.length };
  },
};

// ── Settings ────────────────────────────────────────────────────────────────
export const settingsApi = settingsStore;

// ── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: async () => {
    await delay(200);
    const db = readDb();

    const leadsOverTime = Array.from({ length: 14 }).map((_, i) => {
      const day = new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000);
      const count = (db.leads || []).filter(
        (l) => new Date(l.createdAt).toDateString() === day.toDateString()
      ).length;
      return { date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count };
    });

    return {
      data: {
        leadsCount: (db.leads || []).length,
        openJobsCount: (db.jobs || []).filter((j) => j.status === 'open').length,
        publishedPortfolioCount: (db.portfolio || []).filter((p) => p.isPublished).length,
        publishedBlogCount: (db.blogs || []).filter((b) => b.status === 'published').length,
        applicationsCount: (db.applications || []).length,
        leadsOverTime,
      },
    };
  },
};

// ── Media ───────────────────────────────────────────────────────────────────
// Image fields take URLs (see ImageUploader). If a File ever reaches this, we
// inline it as a data URL so it survives a refresh — a blob: URL would not.
export const mediaApi = {
  upload: async (file, onProgress) => {
    for (let pct = 25; pct <= 75; pct += 25) {
      // eslint-disable-next-line no-await-in-loop
      await delay(80);
      if (onProgress) onProgress(pct);
    }
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    if (onProgress) onProgress(100);
    return { url };
  },
};

// resetDb() wipes local changes and restores the seed. Also available in the
// browser console as resetDemoData().
export { resetDb, subscribe, readDb };
