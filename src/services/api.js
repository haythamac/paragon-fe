// src/components/services/api.js
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VUE_APP_API_URL || 'http://paragon.test/api',
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // TODO: Add authentication later when you implement login
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {  
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', error.response.status);
      }
    } else if (error.request) {
      console.error('Network error - Is your Laravel API running?');
    }
    return Promise.reject(error);
  }
);

export default api;