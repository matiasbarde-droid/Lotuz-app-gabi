import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api/apiClient';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estado para almacenar la información del usuario autenticado
  const [user, setUser] = useState(null);
  // Estado para controlar si se está cargando la información de autenticación
  const [loading, setLoading] = useState(true);

  // Efecto para cargar la sesión del usuario al iniciar la aplicación
  useEffect(() => {
    const storedUserJSON = localStorage.getItem('authUser');
    if (storedUserJSON) {
      try {
        const storedUser = JSON.parse(storedUserJSON);
        setUser(storedUser);
      } catch (e) {
        localStorage.removeItem('authUser');
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { correo: email, password });
      const userData = response.data;
      // Guardar el usuario en localStorage
      localStorage.setItem('authUser', JSON.stringify(userData));
      // Actualizar el estado del usuario
      setUser(userData);
      return {
        success: true,
        user: userData
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // No hay endpoint de logout en backend actual; limpiar sesión local
    } finally {
      localStorage.removeItem('authUser');
      setUser(null);
    }
  };

  // Función para verificar si el usuario está autenticado
  const isLoggedIn = () => {
    return !!user;
  };

  // Función para verificar si el usuario es administrador
  const isAdmin = () => {
    return user?.rol === 'ADMIN' || user?.rol === 'SUPER_ADMIN';
  };

  // Login específico para administradores usando backend y validando rol
  const adminLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { correo: email, password });
      const userData = response.data;
      if (userData?.rol === 'ADMIN' || userData?.rol === 'SUPER_ADMIN') {
        localStorage.setItem('authUser', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // Valores y funciones que se proporcionarán a través del contexto
  const value = {
    user,
    loading,
    login,
    adminLogin,
    logout,
    isLoggedIn,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;