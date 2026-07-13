import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Served under /admin so the public site can proxy to it and both apps end
  // up on the same origin (see frontend/vite.config.js).
  base: '/admin/',
  server: {
    port: 5173,
    strictPort: true,
    // Let the HMR socket talk to this server directly instead of going back
    // through the site's proxy.
    hmr: { protocol: 'ws', host: 'localhost', port: 5174 },
  },
});
