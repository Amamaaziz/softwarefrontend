import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // The admin panel runs on its own Vite server (port 5174) but is served
      // to the browser THROUGH this one, at http://localhost:5173/admin.
      //
      // That matters: browsers scope localStorage per origin, and the mock
      // database lives in localStorage. Serving both apps from one origin is
      // what lets the admin panel and the public site share a single database
      // with no backend involved.
      '/admin': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
