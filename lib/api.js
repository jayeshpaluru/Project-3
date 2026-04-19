import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

export function getApiErrorMessage(error, fallback = 'Request failed.') {
  if (error.response?.data) {
    return typeof error.response.data === 'string'
      ? error.response.data
      : error.response.data.message || fallback;
  }

  return fallback;
}

export async function getCurrentUser() {
  const response = await api.get('/admin/me');
  return response.data;
}

export async function loginUser(credentials) {
  const response = await api.post('/admin/login', credentials);
  return response.data;
}

export async function logoutUser() {
  await api.post('/admin/logout', {});
}

export async function registerUser(user) {
  const response = await api.post('/user', user);
  return response.data;
}

export default api;
