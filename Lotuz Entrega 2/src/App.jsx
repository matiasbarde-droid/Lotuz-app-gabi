import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminGuard from './components/common/AdminGuard';
import AdminProductoEditar from './pages/admin/AdminProductoEditar';
import AdminProducts from './pages/admin/AdminProducts';

// Páginas de cliente
import Login from './pages/client/Login';
import Profile from './pages/client/Profile';
import Home from './pages/client/Home';
import Products from './pages/client/Products';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import DetailProduct from './pages/client/DetailProduct';
import About from './pages/client/About';
import Nosotros from './pages/client/Nosotros';
import Perfil from './pages/client/Perfil';
import Pago from './pages/client/Pago';
import Register from './pages/client/Register';

// Páginas de administrador
import AdminLogin from './pages/admin/AdminLogin';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProductos from './pages/admin/AdminProductos';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductoNuevo from './pages/admin/AdminProductoNuevo';

// Componente para proteger rutas que requieren autenticación (solo clientes, no admin)
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si no está autenticado, enviar a login
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario es administrador, redirigir al panel admin
  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<DetailProduct />} />
          <Route path="/nosotros" element={<Nosotros />} />
          
          {/* Rutas protegidas para clientes */}
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } />
          
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago" element={<Pago />} />
          
          {/* Rutas de administrador */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          } />
          
          <Route path="/admin/productos" element={<AdminProducts />} />

          <Route path="/admin/productos/nuevo" element={
            <AdminGuard>
              <AdminProductoNuevo />
            </AdminGuard>
          } />
          <Route path="/admin/productos/:id/editar" element={
            <AdminGuard>
              <AdminProductoEditar />
            </AdminGuard>
          } />
          
          <Route path="/admin/ordenes" element={
            <AdminGuard>
              <AdminOrders />
            </AdminGuard>
          } />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;