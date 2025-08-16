import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Backend URL
  withCredentials: true, // needed if cookies are used for auth
});

export default api;
