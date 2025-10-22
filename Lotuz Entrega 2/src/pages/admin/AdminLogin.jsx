import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: 'admin@lotuz.cl',
    password: 'admin123'
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Simulación de login de administrador
      const success = await adminLogin(formData.email, formData.password);
      
      if (success) {
        navigate('/admin');
      } else {
        setError('Credenciales inválidas. Por favor, intente nuevamente.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
      console.error('Error de inicio de sesión:', err);
    }
  };

  return (
    <div className="app-container bg-dark text-white">
      <Header />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="p-4 bg-dark border border-secondary rounded">
              <h2 className="text-center mb-4">Panel de administración</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@lotuz.cl"
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control bg-dark text-white border-secondary"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-info w-100 py-2">Entrar</button>

                <div className="text-center mt-4">
                  <Link to="/" className="text-info">Volver a la tienda</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;