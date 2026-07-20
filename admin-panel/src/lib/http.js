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