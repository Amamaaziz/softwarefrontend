import axios from 'axios';

// In Docker/production this comes from the VITE_API_URL build arg (see
// frontend.Dockerfile / docker-compose.yml). Falls back to localhost for
// plain `npm run dev`.
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : 'http://localhost:5000/api/v1';

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends/receives the httpOnly JWT cookie set by /auth/login
});

// ── Silent token refresh ────────────────────────────────────────────────
//
// The access token cookie expires after 15 minutes (see
// backend/Controller/auth.controller.js). Without this, any request made
// after that window fails with a 401 and the admin panel effectively
// looks "logged out" mid-session.
//
// This interceptor catches a 401, calls /auth/refresh once (which also
// rotates the refresh token), then retries the original request. If
// several requests 401 around the same time, they all wait on the same
// in-flight refresh instead of triggering multiple refresh calls.

let refreshPromise = null;

function clearSessionAndRedirect() {
  window.sessionStorage.removeItem('adminUser');
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // No response at all (network error) or not a 401 — nothing to do here.
    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }

    // Don't try to refresh on the refresh/login endpoints themselves, and
    // never retry a request more than once.
    const isAuthEndpoint =
      config.url?.includes('/auth/refresh') || config.url?.includes('/auth/login');
    if (isAuthEndpoint || config._retried) {
      if (config.url?.includes('/auth/refresh')) {
        clearSessionAndRedirect();
      }
      return Promise.reject(error);
    }

    config._retried = true;

    try {
      // Share one in-flight refresh across concurrent 401s.
      if (!refreshPromise) {
        refreshPromise = http.post('/auth/refresh').finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;

      // Refresh succeeded — retry the original request with the new cookie.
      return http(config);
    } catch (refreshError) {
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);