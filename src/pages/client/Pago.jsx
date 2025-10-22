import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Pago = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [transferData, setTransferData] = useState({
    transferName: '',
    transferRut: '',
    transferEmail: '',
    transferBank: ''
  });

  useEffect(() => {
    // Verificar si hay productos en el carrito
    if (!cart || cart.length === 0) {
      navigate('/carrito');
    }
  }, [cart, navigate]);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value
    });
  };

  const handleTransferInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData({
      ...transferData,
      [name]: value
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulación de procesamiento de pago
    setTimeout(() => {
      // Crear objeto de orden
      const order = {
        id: Math.floor(Math.random() * 1000000),
        userId: user?.id,
        items: cart,
        total: total,
        estado: 'Procesando',
        createdAt: new Date().toISOString(),
        paymentMethod: paymentMethod
      };
      
      // Guardar orden en localStorage (simulando backend)
      const orders = JSON.parse(localStorage.getItem('lotuz:orders') || '[]');
      orders.push(order);
      localStorage.setItem('lotuz:orders', JSON.stringify(orders));
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a confirmación
      alert('¡Pago procesado con éxito!');
      navigate('/');
    }, 1500);
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });
  };

  return (
    <div className="app-container" style={{ backgroundColor: "#1a1a1a", color: "white" }}>
      <Header />
      
      <main className="container">
        <div className="volver-link">
          <button onClick={() => navigate(-1)} className="btn-ghost" style={{ color: "white", fontWeight: "bold" }}>
            <i className="fas fa-arrow-left"></i> Volver
          </button>
        </div>
        
        <h1 className="titulo-seccion" style={{ color: "white", fontWeight: "bold", fontSize: "2rem", marginBottom: "1.5rem" }}>Finalizar Compra</h1>
        
        <div className="pago-container">
          <div className="pago-resumen">
            <div className="card" style={{ backgroundColor: "#2a2a2a", color: "white", border: "1px solid #444" }}>
              <div className="card-body" style={{ padding: "1.5rem" }}>
                <h2 style={{ color: "white", fontWeight: "bold", fontSize: "1.5rem", marginBottom: "1rem" }}>Resumen de compra</h2>
                <div className="resumen-items" style={{ marginBottom: "1rem" }}>
                  {cart && cart.map(item => (
                    <div key={item.id} className="resumen-item" style={{ marginBottom: "0.75rem", padding: "0.5rem", backgroundColor: "#333", borderRadius: "4px" }}>
                      <div className="resumen-item-info">
                        <p className="resumen-item-nombre" style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.25rem" }}>{item.nombre}</p>
                        <p className="resumen-item-cantidad" style={{ color: "#ddd", fontSize: "0.9rem" }}>x{item.quantity}</p>
                      </div>
                      <p className="resumen-item-precio" style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>{formatCurrency(item.precio * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="resumen-total" style={{ backgroundColor: "#333", padding: "0.75rem", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: "white", fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>Total</p>
                  <p className="precio-total" style={{ color: "white", fontWeight: "bold", fontSize: "1.5rem", margin: 0 }}>{formatCurrency(total)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pago-metodos">
            <div className="card" style={{ backgroundColor: "#2a2a2a", color: "white", border: "1px solid #444" }}>
              <div className="card-body" style={{ padding: "1.5rem" }}>
                <h2 style={{ color: "white", fontWeight: "bold", fontSize: "1.5rem", marginBottom: "1rem" }}>Método de pago</h2>
                
                <div className="metodos-tabs" style={{ display: "flex", marginBottom: "1.5rem", borderBottom: "1px solid #444" }}>
                  <button 
                    className={`metodo-tab ${paymentMethod === 'tarjeta' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('tarjeta')}
                    style={{ 
                      color: "white", 
                      fontWeight: paymentMethod === 'tarjeta' ? "bold" : "normal",
                      backgroundColor: paymentMethod === 'tarjeta' ? "#444" : "transparent",
                      padding: "0.75rem 1rem",
                      border: "none",
                      borderBottom: paymentMethod === 'tarjeta' ? "2px solid #fff" : "none",
                      flex: 1,
                      fontSize: "1.1rem"
                    }}
                  >
                    <i className="fas fa-credit-card"></i> Tarjeta
                  </button>
                  <button 
                    className={`metodo-tab ${paymentMethod === 'transferencia' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('transferencia')}
                    style={{ 
                      color: "white", 
                      fontWeight: paymentMethod === 'transferencia' ? "bold" : "normal",
                      backgroundColor: paymentMethod === 'transferencia' ? "#444" : "transparent",
                      padding: "0.75rem 1rem",
                      border: "none",
                      borderBottom: paymentMethod === 'transferencia' ? "2px solid #fff" : "none",
                      flex: 1,
                      fontSize: "1.1rem"
                    }}
                  >
                    <i className="fas fa-university"></i> Transferencia
                  </button>
                </div>
                
                <div className="metodo-content">
                  {paymentMethod === 'tarjeta' ? (
                    <form onSubmit={handleSubmit} className="form-pago" style={{ backgroundColor: "#333", padding: "1rem", borderRadius: "8px" }}>
                      <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label htmlFor="cardNumber" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Número de tarjeta</label>
                        <input 
                          type="text" 
                          id="cardNumber" 
                          name="cardNumber" 
                          value={cardData.cardNumber} 
                          onChange={handleCardInputChange} 
                          placeholder="1234 5678 9012 3456" 
                          required 
                          style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "0.75rem", borderRadius: "4px", width: "100%" }}
                        />
                      </div>
                      
                      <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label htmlFor="cardName" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Nombre en la tarjeta</label>
                        <input 
                          type="text" 
                          id="cardName" 
                          name="cardName" 
                          value={cardData.cardName} 
                          onChange={handleCardInputChange} 
                          placeholder="Juan Pérez" 
                          required 
                          style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "0.75rem", borderRadius: "4px", width: "100%" }}
                        />
                      </div>
                      
                      <div className="form-row" style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label htmlFor="cardExpiry" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Fecha de expiración</label>
                          <input 
                            type="text" 
                            id="cardExpiry" 
                            name="cardExpiry" 
                            value={cardData.cardExpiry} 
                            onChange={handleCardInputChange} 
                            placeholder="MM/AA" 
                            required 
                            style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "0.75rem", borderRadius: "4px", width: "100%" }}
                          />
                        </div>
                        
                        <div className="form-group" style={{ flex: 1 }}>
                          <label htmlFor="cardCvv" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>CVV</label>
                          <input 
                            type="text" 
                            id="cardCvv" 
                            name="cardCvv" 
                            value={cardData.cardCvv} 
                            onChange={handleCardInputChange} 
                            placeholder="123" 
                            required 
                            style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "0.75rem", borderRadius: "4px", width: "100%" }}
                          />
                        </div>
                      </div>
                      
                      <button type="submit" className="btn btn-primary btn-block" style={{ backgroundColor: "#007bff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "4px", fontWeight: "bold", width: "100%", color: "white" }}>
                        Pagar {formatCurrency(total)}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit} className="form-pago" style={{ backgroundColor: "#333", padding: "1rem", borderRadius: "8px" }}>
                      <div className="instrucciones-transferencia" style={{ color: "white", marginBottom: "1.5rem", backgroundColor: "#444", padding: "1rem", borderRadius: "6px" }}>
                        <p style={{ color: "#ddd", marginBottom: "0.75rem", fontWeight: "bold", fontSize: "1.1rem" }}>Realiza una transferencia a la siguiente cuenta:</p>
                        <p style={{ color: "white", marginBottom: "0.5rem" }}><strong>Banco:</strong> Banco Estado</p>
                        <p style={{ color: "white", marginBottom: "0.5rem" }}><strong>Tipo de cuenta:</strong> Cuenta Corriente</p>
                        <p style={{ color: "white", marginBottom: "0.5rem" }}><strong>Número:</strong> 12345678</p>
                        <p style={{ color: "white", marginBottom: "0.5rem" }}><strong>RUT:</strong> 76.123.456-7</p>
                        <p style={{ color: "white", marginBottom: "0.5rem" }}><strong>Nombre:</strong> Lotuz SpA</p>
                        <p style={{ color: "white", marginBottom: "0.5rem" }}><strong>Email:</strong> pagos@lotuz.cl</p>
                      </div>
                      
                      <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label htmlFor="transferName" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Nombre completo</label>
                        <input 
                          type="text" 
                          id="transferName" 
                          name="transferName" 
                          value={transferData.transferName} 
                          onChange={handleTransferInputChange} 
                          required 
                          style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "0.75rem", borderRadius: "4px", width: "100%" }}
                        />
                      </div>
                      
                      <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label htmlFor="transferRut" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>RUT</label>
                        <input 
                          type="text" 
                          id="transferRut" 
                          name="transferRut" 
                          value={transferData.transferRut} 
                          onChange={handleTransferInputChange} 
                          required 
                          style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "0.75rem", borderRadius: "4px", width: "100%" }}
                        />
                      </div>
                      
                      <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label htmlFor="transferEmail" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Email</label>
                        <input 
                          type="email" 
                          id="transferEmail" 
                          name="transferEmail" 
                          value={transferData.transferEmail} 
                          onChange={handleTransferInputChange} 
                          required 
                          style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "0.75rem", borderRadius: "4px", width: "100%" }}
                        />
                      </div>
                      
                      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="transferBank" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Banco</label>
                        <input 
                          type="text" 
                          id="transferBank" 
                          name="transferBank" 
                          value={transferData.transferBank} 
                          onChange={handleTransferInputChange} 
                          required 
                          style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "0.75rem", borderRadius: "4px", width: "100%" }}
                        />
                      </div>
                      
                      <button type="submit" className="btn btn-primary btn-block" style={{ backgroundColor: "#007bff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "4px", fontWeight: "bold", width: "100%", color: "white" }}>
                        Confirmar transferencia
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pago;