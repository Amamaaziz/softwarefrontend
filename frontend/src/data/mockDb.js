// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATABASE — replaces the backend entirely.
//
// Everything lives in one localStorage key. Because the admin panel is served
// from the SAME ORIGIN as the public site (see vite.config.js — the site
// proxies /admin to the admin dev server), both apps read and write the same
// record. Publish a service in the admin panel, refresh the site, it's there.
//
// Same-tab and cross-tab updates are broadcast so open pages refresh on their
// own (see `subscribe`).
//
// This file is duplicated verbatim in:
//   - frontend/src/data/mockDb.js
//   - admin-panel/src/data/mockDb.js
//
// To move to a real backend later: keep the function names, replace the bodies
// with axios calls. No page component needs to change.
// ─────────────────────────────────────────────────────────────────────────────

import { buildSeedDb } from './seed.js';

const DB_KEY = 'nexbyte.db.v1';
const CHANGE_EVENT = 'nexbyte:db-change';

// Artificial latency so loading spinners are visible. Not a network call.
export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

let idCounter = Date.now() % 100000;
export function uid(prefix = 'id') {
  idCounter += 1;
  return `${prefix}-${idCounter.toString(36)}`;
}

// ── Storage ─────────────────────────────────────────────────────────────────

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function readDb() {
  if (typeof window === 'undefined') return buildSeedDb();

  const raw = window.localStorage.getItem(DB_KEY);
  const parsed = raw ? safeParse(raw) : null;

  if (!parsed || typeof parsed !== 'object' || !parsed.services) {
    const seeded = buildSeedDb();
    writeDb(seeded, { silent: true });
    return seeded;
  }
  return parsed;
}

export function writeDb(db, { silent = false } = {}) {
  if (typeof window === 'undefined') return db;
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (err) {
    // Almost always a quota error from a very large base64 image.
    // eslint-disable-next-line no-console
    console.error('[mockDb] Could not save — storage is full.', err);
    throw new Error('Local storage is full. Use image URLs instead of large uploads.');
  }
  if (!silent) notify();
  return db;
}

/** Wipes local data and re-seeds. Also exposed as window.resetDemoData(). */
export function resetDb() {
  const seeded = buildSeedDb();
  writeDb(seeded);
  return seeded;
}

// ── Change notification (same tab + other tabs) ─────────────────────────────

const channel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel(CHANGE_EVENT)
    : null;

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  if (channel) channel.postMessage('changed');
}

/**
 * Calls `handler` whenever the database changes — in this tab, in another tab,
 * or in the other app. Returns an unsubscribe function.
 */
export function subscribe(handler) {
  if (typeof window === 'undefined') return () => {};

  const onLocal = () => handler();
  const onStorage = (e) => {
    if (e.key === DB_KEY) handler();
  };
  const onMessage = () => handler();

  window.addEventListener(CHANGE_EVENT, onLocal);
  window.addEventListener('storage', onStorage);
  if (channel) channel.addEventListener('message', onMessage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onLocal);
    window.removeEventListener('storage', onStorage);
    if (channel) channel.removeEventListener('message', onMessage);
  };
}

// ── Collection CRUD ─────────────────────────────────────────────────────────

/**
 * A CRUD store over one collection, with the same method names a REST client
 * would expose: list / getOne / create / update / remove / publish.
 * Every method returns `{ data }` (and `total` on list), mirroring axios.
 */
export function createCollection(name, { publishField = 'isPublished', idPrefix = 'rec', beforeWrite } = {}) {
  const all = () => readDb()[name] || [];

  const commit = (nextItems) => {
    const db = readDb();
    db[name] = nextItems;
    writeDb(db);
  };

  const store = {
    name,

    list: async () => {
      await delay();
      const data = all();
      return { data, total: data.length };
    },

    getOne: async (id) => {
      await delay(120);
      const item = all().find((r) => r._id === id);
      if (!item) throw new Error('Not found');
      return { data: item };
    },

    create: async (payload) => {
      await delay(300);
      const now = new Date().toISOString();
      let item = {
        _id: uid(idPrefix),
        createdAt: now,
        updatedAt: now,
        ...payload,
      };
      if (beforeWrite) item = beforeWrite(item, { mode: 'create', previous: null });
      commit([item, ...all()]);
      return { data: item };
    },

    update: async (id, payload) => {
      await delay(300);
      const items = all();
      const previous = items.find((r) => r._id === id);
      if (!previous) throw new Error('Not found');

      let updated = { ...previous, ...payload, updatedAt: new Date().toISOString() };
      if (beforeWrite) updated = beforeWrite(updated, { mode: 'update', previous });

      commit(items.map((r) => (r._id === id ? updated : r)));
      return { data: updated };
    },

    remove: async (id) => {
      await delay(200);
      const items = all();
      const target = items.find((r) => r._id === id);
      if (!target) throw new Error('Not found');
      commit(items.filter((r) => r._id !== id));
      return { data: { success: true, removed: target } };
    },

    publish: async (id, isPublished) => store.update(id, { [publishField]: isPublished }),
  };

  // Some pages call `.delete(id)` instead of `.remove(id)` — support both.
  store.delete = store.remove;

  return store;
}

// ── Settings (a single object, not a list) ──────────────────────────────────

export const settingsStore = {
  get: async () => {
    await delay(150);
    return { data: readDb().settings };
  },
  update: async (payload) => {
    await delay(300);
    const db = readDb();
    db.settings = {
      ...db.settings,
      ...payload,
      social: { ...db.settings.social, ...(payload.social || {}) },
      seoDefaults: { ...db.settings.seoDefaults, ...(payload.seoDefaults || {}) },
    };
    writeDb(db);
    return { data: db.settings };
  },
  // Synchronous read, for module-level config (site name in the navbar, etc).
  read: () => readDb().settings,
};

// Handy in the browser console: resetDemoData() puts every collection back to
// its seeded state.
if (typeof window !== 'undefined') {
  window.resetDemoData = resetDb;
}
