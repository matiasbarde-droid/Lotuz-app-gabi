import axios from 'axios';

// Crear una instancia de Axios centralizada con configuración base
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
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
      
      // Manejo específico según el código de estado
      if (error.response.status === 401) {
        // No autorizado - podría redirigir al login
        console.error('Sesión expirada o usuario no autenticado');
        // Aquí podríamos llamar a una función de logout si es necesario
      } else if (error.response.status === 403) {
        // Prohibido - no tiene permisos
        console.error('No tiene permisos para realizar esta acción');
      }
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Error al configurar la solicitud
      console.error('Error de configuración:', error.message);
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