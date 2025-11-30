import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../api/apiClient';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { cartItems, getCartTotal, checkout, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  // Estados para compra como invitado
  const [emailInvitado, setEmailInvitado] = useState('');
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState('');
  const [guestSuccess, setGuestSuccess] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    region: '',
    comuna: '',
    metodoPago: 'tarjeta'
  });

  // Opciones de pago
  const metodosPago = [
    { id: 'tarjeta', nombre: 'Tarjeta de Crédito/Débito' },
    { id: 'transferencia', nombre: 'Transferencia Bancaria' },
    { id: 'paypal', nombre: 'PayPal' }
  ];

  // Cargar datos del usuario si está autenticado (solo clientes, no admin)
  useEffect(() => {
    if (user && !isAdmin()) {
      setFormData(prev => ({
        ...prev,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.correo || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        region: user.region || '',
        comuna: user.comuna || ''
      }));
    }
  }, [user, isAdmin]);

  // Redireccionar si el carrito está vacío
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/carrito');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Comprar como invitado con solo correo
  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    setGuestError('');
    setGuestSuccess('');

    const email = (emailInvitado || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setGuestError('Ingresa un correo válido para comprar como invitado');
      return;
    }

    try {
      setGuestLoading(true);
      // Delegamos al contexto del carrito para armar el payload
      await checkout({ email: email });
      setGuestSuccess('Compra realizada como invitado. Revisa tu correo.');
      toast.success('¡Compra como invitado realizada!');
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo completar la compra';
      setGuestError(msg);
      toast.error(msg);
    } finally {
      setGuestLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      // Usar siempre el correo para el checkout (tratamos como invitado en H2)
      const emailToUse = ((user && !isAdmin()) ? (user.correo || '') : (formData.email || emailInvitado || '')).trim();
      if (!emailToUse) {
        toast.error('Necesitamos un correo para la compra');
        setLoading(false);
        return;
      }

      // Procesar el checkout con email como invitado para garantizar persistencia en backend
      await checkout({ email: emailToUse });
      toast.success('¡Compra realizada con éxito!');
      clearCart();
      navigate('/');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error procesando el pago';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Formulario de datos de compra */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Datos de Compra</h5>
            </div>
            <div className="card-body bg-dark text-white">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label text-white">Nombre</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      disabled={!!user && !isAdmin()}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="apellido" className="form-label text-white">Apellido</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      disabled={!!user && !isAdmin()}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-white">Email</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-white guest-input"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    disabled={!!user && !isAdmin()}
                  />
                </div>

                {/* Otros campos no depende de usuario */}
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label text-white">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control bg-dark text-white"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="metodoPago" className="form-label text-white">Método de Pago</label>
                    <select
                      className="form-select bg-dark text-white"
                      id="metodoPago"
                      name="metodoPago"
                      value={formData.metodoPago}
                      onChange={handleChange}
                    >
                      {metodosPago.map(mp => (
                        <option key={mp.id} value={mp.id}>{mp.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <button type="submit" className="btn btn-info w-100" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Procesando...
                      </>
                    ) : (
                      'Pagar Ahora'
                    )}
                  </button>
                </div>
              </form>

              {/* Compra como invitado */}
              <div className="mt-4">
                <div className="alert alert-secondary bg-dark text-white" role="alert">
                  También puedes comprar como invitado:
                </div>
                <form onSubmit={handleGuestCheckout}>
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control bg-dark text-white guest-input"
                      placeholder="Tu correo electrónico"
                      value={emailInvitado}
                      onChange={(e) => setEmailInvitado(e.target.value)}
                      autoComplete="email"
                    />
                    <button className="btn btn-outline-info" type="submit" disabled={guestLoading}>
                      {guestLoading ? 'Procesando...' : 'Comprar como invitado'}
                    </button>
                  </div>
                  {guestError && (
                    <div className="alert alert-danger mt-2 bg-dark text-white" role="alert">{guestError}</div>
                  )}
                  {guestSuccess && (
                    <div className="alert alert-success mt-2 bg-dark text-white" role="alert">{guestSuccess}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Resumen del Pedido</h5>
            </div>
            <div className="card-body bg-dark text-white">
              <ul className="list-group list-group-flush">
                {cartItems.map(item => (
                  <li key={item.sku} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                    <div>
                      <span className="fw-bold">{item.cantidad}x</span> {item.nombre}
                    </div>
                    <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              
              <hr />
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Subtotal:</span>
                <span>${getCartTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
