import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Manejar cambio de cantidad
  const handleQuantityChange = (sku, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(sku, newQuantity);
  };
  
  // Manejar eliminación de producto
  const handleRemoveItem = (sku, nombre) => {
    removeFromCart(sku);
    toast.info(`${nombre} eliminado del carrito`);
  };
  
  // Manejar vaciado del carrito
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      clearCart();
      toast.info('Carrito vaciado');
    }
  };
  
  // Ir al checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Carrito de Compras</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-shopping-cart fa-4x text-muted"></i>
          </div>
          <h2 className="h4 mb-4">Tu carrito está vacío</h2>
          <p className="text-muted mb-4">Parece que aún no has agregado productos a tu carrito.</p>
          <Link to="/productos" className="btn btn-primary">
            Explorar Productos
          </Link>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Productos ({cartItems.length})</h5>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleClearCart}
                  >
                    <i className="fas fa-trash me-1"></i>
                    Vaciar Carrito
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-borderless mb-0">
                      <thead className="text-muted small">
                        <tr>
                          <th scope="col" className="ps-4">Producto</th>
                          <th scope="col" className="text-center">Precio</th>
                          <th scope="col" className="text-center">Cantidad</th>
                          <th scope="col" className="text-center">Subtotal</th>
                          <th scope="col" className="text-end pe-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item, index) => (
                          <tr key={`${item.sku}-${index}`}>
                            <td className="align-middle ps-4">
                              <div className="d-flex align-items-center">
                                <img 
                                  src={item.imagen || '/img/placeholder.png'} 
                                  alt={item.nombre} 
                                  className="me-3"
                                  style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    objectFit: 'contain', 
                                    backgroundColor: '#ffffff', 
                                    border: '3px solid #444', 
                                    borderRadius: '8px',
                                    padding: '5px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                  }}
                                />
                                <div>
                                  <h6 className="mb-0">{item.nombre}</h6>
                                  <small className="text-muted">SKU: {item.sku}</small>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle text-center">
                              ${item.precio.toLocaleString()}
                            </td>
                            <td className="align-middle text-center">
                              <div className="input-group input-group-sm" style={{ width: '120px', margin: '0 auto' }}>
                                <button 
                                  className="btn btn-outline-secondary" 
                                  type="button"
                                  onClick={() => handleQuantityChange(item.sku, item.cantidad - 1)}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <input 
                                  type="number" 
                                  className="form-control text-center"
                                  value={item.cantidad}
                                  onChange={(e) => handleQuantityChange(item.sku, parseInt(e.target.value) || 1)}
                                  min="1"
                                />
                                <button 
                                  className="btn btn-outline-secondary" 
                                  type="button"
                                  onClick={() => handleQuantityChange(item.sku, item.cantidad + 1)}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="align-middle text-center fw-bold">
                              ${(item.precio * item.cantidad).toLocaleString()}
                            </td>
                            <td className="align-middle text-end pe-4">
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveItem(item.sku, item.nombre)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-between">
                <Link to="/productos" className="btn btn-outline-primary">
                  <i className="fas fa-arrow-left me-1"></i>
                  Seguir Comprando
                </Link>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-dark text-white py-3">
                  <h5 className="mb-0">Resumen de Compra</h5>
                </div>
                <div className="card-body" style={{ backgroundColor: "#2a2a2a", color: "white" }}>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <hr style={{ borderColor: "#555" }} />
                  <div className="d-flex justify-content-between mb-4">
                    <strong>Total</strong>
                    <strong className="fs-5">${getCartTotal().toLocaleString()}</strong>
                  </div>
                  <button 
                    className="btn btn-primary w-100"
                    onClick={handleCheckout}
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>
              
              <div className="card shadow-sm">
                <div className="card-header bg-dark text-white py-3">
                  <h5 className="mb-0">Información Adicional</h5>
                </div>
                <div className="card-body" style={{ backgroundColor: "#2a2a2a", color: "white" }}>
                  <h6 className="mb-3">Métodos de Pago Aceptados</h6>
                  <div className="d-flex gap-2 mb-3">
                    <i className="fab fa-cc-visa fa-2x text-light"></i>
                    <i className="fab fa-cc-mastercard fa-2x text-light"></i>
                    <i className="fab fa-cc-amex fa-2x text-light"></i>
                    <i className="fab fa-cc-paypal fa-2x text-light"></i>
                  </div>
                  <h6 className="mb-3">Envío Seguro</h6>
                  <p className="small text-light mb-0">
                    Todos nuestros envíos están asegurados y cuentan con seguimiento en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;