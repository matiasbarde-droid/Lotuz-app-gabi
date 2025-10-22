import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import RegisterForm from '../../components/auth/RegisterForm';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    toast.success('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
    navigate('/login');
  };

  return (
    <div className="app-container bg-dark text-white">
      <Header />
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="p-4 bg-dark border border-secondary rounded">
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;