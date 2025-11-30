import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { validateEmail, validatePassword } from '../../utils/validators';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoggedIn } = useAuth();
  
  // Si el usuario ya está autenticado, redirigir a la página de inicio
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Ingrese un correo válido');
      return;
    }
    if (!validatePassword(password, 8)) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    const result = await login(email.trim().toLowerCase(), password);
    if (!result?.success) {
      setError(result?.message || 'Credenciales inválidas');
    }
  };
  
  return (
    <div className="app-container bg-dark text-white">
      <Header />
      
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-container p-4 bg-dark border border-secondary rounded">
              <h2 className="text-center mb-4">Iniciar sesión</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo</label>
                  <input 
                    type="email" 
                    className="form-control bg-dark text-white border-secondary" 
                    id="email" 
                    placeholder="tuemail@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control bg-dark text-white border-secondary" 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">Recordarme</label>
                  </div>
                  <div>
                    <a href="#" className="text-info">Olvidé mi contraseña</a>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-info w-100 py-2">Ingresar</button>
                
                <div className="text-center mt-4">
                  <p>¿Eres nuevo aquí? <Link to="/registro" className="text-info">Crea tu cuenta</Link></p>
                  <p><Link to="/" className="text-info">Volver al inicio</Link></p>
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

export default Login;
