import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - solo redirigir si estamos en una ruta protegida
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        console.log('Token expirado, redirigiendo al login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/admin/login';
      }
    } else if (error.response?.status === 403) {
      // No autorizado
      console.error('Error 403: No tienes permisos para esta acción');
    } else if (error.response?.status >= 500) {
      // Error del servidor
      console.error('Error del servidor:', error.response?.data?.error || 'Error interno del servidor');
    }
    return Promise.reject(error);
  }
);

export default api;
