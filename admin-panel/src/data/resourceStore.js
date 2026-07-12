import { nextId } from './seedData.js';

// A tiny artificial delay so loading spinners are visible, purely for a
// realistic feel — this is NOT a network call, just a setTimeout.
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates an in-memory CRUD "store" for one collection (Services, Portfolio,
 * Blog, etc). This is the entire data layer for this frontend-only project —
 * there is no axios, no fetch, no backend. Data lives in a closured array
 * and resets on page refresh.
 */
export function createResourceStore(seed, { publishField = 'isPublished' } = {}) {
  let store = [...seed];

  return {
    list: async () => {
      await delay();
      return { data: store, total: store.length };
    },
    getOne: async (id) => {
      await delay(150);
      const item = store.find((r) => r._id === id);
      if (!item) throw new Error('Not found');
      return { data: item };
    },
    create: async (payload) => {
      await delay(350);
      const item = { _id: nextId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...payload };
      store = [item, ...store];
      return { data: item };
    },
    update: async (id, payload) => {
      await delay(350);
      let updated = null;
      store = store.map((r) => {
        if (r._id === id) {
          updated = { ...r, ...payload, updatedAt: new Date().toISOString() };
          return updated;
        }
        return r;
      });
      if (!updated) throw new Error('Not found');
      return { data: updated };
    },
    remove: async (id) => {
      await delay(250);
      store = store.filter((r) => r._id !== id);
      return { data: { success: true } };
    },
    publish: async (id, isPublished) => {
      await delay(200);
      let updated = null;
      store = store.map((r) => {
        if (r._id === id) {
          updated = { ...r, [publishField]: isPublished };
          return updated;
        }
        return r;
      });
      if (!updated) throw new Error('Not found');
      return { data: updated };
    },
  };
}

export { delay };
