import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // sends/receives the httpOnly JWT cookie set by /auth/login
});