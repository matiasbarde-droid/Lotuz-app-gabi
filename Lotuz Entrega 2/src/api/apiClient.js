import axios from 'axios';
import { toast } from 'react-toastify';

// Crear una instancia de Axios centralizada con configuración base
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de solicitud: agrega CSRF si existe
apiClient.interceptors.request.use((config) => {
  try {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    }
  } catch {}
  return config;
});

// Interceptor para manejar errores de forma global
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.status, error.response.data);
      const status = error.response.status;
      const url = error.config?.url || '';
      let message = 'Error en la solicitud';
      if (status === 401) {
        message = 'Sesión expirada o usuario no autenticado';
      } else if (status === 403) {
        message = 'No tiene permisos para realizar esta acción';
      } else if (status === 404) {
        message = 'Recurso no encontrado';
      } else if (status >= 500) {
        message = 'Error del servidor. Intente nuevamente más tarde.';
      } else if (status >= 400) {
        message = 'Solicitud inválida.';
      }
      error.userMessage = message;
      error.url = url;
      const suppress = error.config?.headers && (error.config.headers['X-Suppress-Toast'] === true || error.config.headers['X-Suppress-Toast'] === 'true');
      if (!suppress) {
        toast.error(`${message}${url ? ` (${url})` : ''}`);
      }
      
      // Manejo específico según el código de estado
      if (status === 401) {
        // No autorizado - podría redirigir al login
        console.error('Sesión expirada o usuario no autenticado');
        // Aquí podríamos llamar a una función de logout si es necesario
      } else if (status === 403) {
        // Prohibido - no tiene permisos
        console.error('No tiene permisos para realizar esta acción');
      }
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      const isTimeout = error.code === 'ECONNABORTED';
      const message = isTimeout ? 'La solicitud excedió el tiempo de espera' : 'No se pudo contactar al servidor';
      error.userMessage = message;
      const suppress = error.config?.headers && (error.config.headers['X-Suppress-Toast'] === true || error.config.headers['X-Suppress-Toast'] === 'true');
      if (!suppress) {
        toast.error(message);
      }
    } else {
      // Error al configurar la solicitud
      console.error('Error de configuración:', error.message);
      error.userMessage = 'Error al configurar la solicitud';
      const suppress = error.config?.headers && (error.config.headers['X-Suppress-Toast'] === true || error.config.headers['X-Suppress-Toast'] === 'true');
      if (!suppress) {
        toast.error(error.userMessage);
      }
    }
    
    return Promise.reject(error);
  }
);

// Métodos de ayuda para realizar solicitudes HTTP
export const api = {
  // GET request
  get: async (url, config = {}) => {
    return apiClient.get(url, config);
  },
  
  // POST request
  post: async (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },
  
  // PUT request
  put: async (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },
  
  // DELETE request
  delete: async (url, config = {}) => {
    return apiClient.delete(url, config);
  }
};

export default api;
