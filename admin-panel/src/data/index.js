// Single entry point for all "data access" in this frontend-only project.
// No axios, no fetch, no environment variables — just in-memory state.
// Every export below has the same method names (list/getOne/create/update/
// remove/publish) so pages don't need to know this isn't a real API.

import { createResourceStore, delay } from './resourceStore.js';
import {
  seedServices,
  seedPortfolio,
  seedBlogs,
  seedTestimonials,
  seedJobs,
  seedJobApplications,
  seedLeads,
  seedUsers,
  seedActivityLogs,
  seedSettings,
  buildDashboardStats,
} from './seedData.js';

export const servicesApi = createResourceStore(seedServices);
export const portfolioApi = createResourceStore(seedPortfolio);
export const blogApi = createResourceStore(seedBlogs, { publishField: 'status' });
export const testimonialsApi = createResourceStore(seedTestimonials);
export const jobsApi = createResourceStore(seedJobs, { publishField: 'status' });
export const applicationsApi = createResourceStore(seedJobApplications, { publishField: 'status' });
export const leadsApi = createResourceStore(seedLeads, { publishField: 'status' });
export const usersApi = createResourceStore(seedUsers, { publishField: 'isActive' });
export const activityLogsApi = createResourceStore(seedActivityLogs);

export const dashboardApi = {
  stats: async () => {
    await delay(250);
    return { data: buildDashboardStats() };
  },
};

// Settings is a single object, not a list — kept mutable in module scope.
const settingsState = { ...seedSettings };
export const settingsApi = {
  get: async () => {
    await delay(250);
    return { data: settingsState };
  },
  update: async (payload) => {
    await delay(350);
    Object.assign(settingsState, payload);
    return { data: settingsState };
  },
};

// Image "upload" just creates a local preview URL from the file the user
// picked — nothing is sent anywhere.
export const mediaApi = {
  upload: async (file, onProgress) => {
    for (let pct = 25; pct <= 100; pct += 25) {
      // eslint-disable-next-line no-await-in-loop
      await delay(100);
      if (onProgress) onProgress(pct);
    }
    return { url: URL.createObjectURL(file) };
  },
};
