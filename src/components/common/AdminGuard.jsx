import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente de protección para rutas de administrador
 * Reemplaza la funcionalidad de Lotuz/js/admin_guard.js
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si el usuario tiene permisos
 * @returns {React.ReactNode} - Componente hijo o redirección a login
 */
const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  // Verificar si el usuario está autenticado y tiene rol de administrador
  if (!user || (user.rol !== 'ADMIN' && user.rol !== 'SUPER_ADMIN')) {
    // Redirigir a la página de login si no tiene permisos
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario tiene permisos, renderizar los componentes hijos
  return children;
};

export default AdminGuard;