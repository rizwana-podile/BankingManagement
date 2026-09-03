import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      const p = window.location.pathname;
      if (p !== '/login' && p !== '/' && p !== '/register') {
        localStorage.removeItem('aura_token');
        localStorage.removeItem('aura_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(err);
  }
);

export default api;