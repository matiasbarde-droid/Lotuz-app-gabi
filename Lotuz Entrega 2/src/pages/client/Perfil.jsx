import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    region: '',
    comuna: '',
    password: '',
    confirmPassword: ''
  });

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        region: user.region || '',
        comuna: user.comuna || '',
        password: '',
        confirmPassword: ''
      });
      
      // Cargar historial de compras (simulado con localStorage)
      const storedOrders = JSON.parse(localStorage.getItem('lotuz:orders') || '[]');
      const userOrders = storedOrders.filter(order => order.userId === user.id);
      setOrders(userOrders);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    // Aquí iría la lógica para actualizar los datos del usuario
    // Por ahora solo mostraremos un mensaje
    alert('Datos actualizados correctamente');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Formatear precio en formato moneda
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="container">
        <h1 className="titulo-seccion">Mi Cuenta</h1>
        
        <div className="card mb-4 bg-dark text-white border border-secondary">
          <div className="card-body">
            <h2>Resumen</h2>
            <div className="resumen-cuenta">
              <p><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Compras realizadas:</strong> {orders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card mb-4 bg-dark text-white border border-secondary">
          <div className="card-body">
            <h2>Historial de compras</h2>
            {orders.length > 0 ? (
              <div className="tabla-responsive">
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Orden #</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.estado}</td>
                        <td>{formatCurrency(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No has realizado compras aún.</p>
            )}
          </div>
        </div>
        
        <div className="card bg-dark text-white border border-secondary">
          <div className="card-body">
            <h2>Datos de cuenta</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.nombre} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input 
                    type="text" 
                    id="apellido" 
                    name="apellido" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.apellido} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input 
                    type="tel" 
                    id="telefono" 
                    name="telefono" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.telefono} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="direccion">Dirección</label>
                  <input 
                    type="text" 
                    id="direccion" 
                    name="direccion" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.direccion} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="region">Región</label>
                  <input 
                    type="text" 
                    id="region" 
                    name="region" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.region} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="comuna">Comuna</label>
                  <input 
                    type="text" 
                    id="comuna" 
                    name="comuna" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.comuna} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Nueva contraseña</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.password} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Guardar cambios</button>
                <button type="button" className="btn btn-ghost" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Perfil;