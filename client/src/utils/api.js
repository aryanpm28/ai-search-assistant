import axios from 'axios';

// Create axios instance that always sends the token
const api = axios.create({
  baseURL: '/api', // proxied to backend by Vite
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
