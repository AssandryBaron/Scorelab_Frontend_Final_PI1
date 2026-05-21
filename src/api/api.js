import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir si es 401 (No autenticado). 
    // El 403 (Prohibido) a veces es solo falta de un permiso específico, no sesión expirada.
    if (error.response && error.response.status === 401) {
      console.error("🔴 Sesión expirada. Redirigiendo al login...");
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;