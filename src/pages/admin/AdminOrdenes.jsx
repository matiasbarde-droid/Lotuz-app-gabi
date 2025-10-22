import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/admin/AdminNav';

const AdminOrdenes = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    // Cargar órdenes desde localStorage (simulando backend)
    const storedOrders = JSON.parse(localStorage.getItem('lotuz:orders') || '[]');
    setOrders(storedOrders);
    setFilteredOrders(storedOrders);
  }, []);

  useEffect(() => {
    // Aplicar filtros cuando cambien
    let result = [...orders];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(order => 
        order.id.toString().includes(searchTerm) || 
        (order.userId && order.userId.toString().includes(searchTerm))
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'todos') {
      result = result.filter(order => order.estado.toLowerCase() === statusFilter);
    }
    
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCloseDetails = () => {
    setShowOrderDetails(false);
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedOrder) return;
    
    // Actualizar estado de la orden
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return { ...order, estado: newStatus };
      }
      return order;
    });
    
    // Actualizar estado y localStorage
    setOrders(updatedOrders);
    localStorage.setItem('lotuz:orders', JSON.stringify(updatedOrders));
    
    // Actualizar orden seleccionada
    setSelectedOrder({ ...selectedOrder, estado: newStatus });
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-container">
      <AdminNav />
      
      <main className="admin-content">
        <div className="admin-header">
          <h1>Gestión de Órdenes</h1>
        </div>
        
        <div className="admin-filters">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar por ID o cliente..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="btn-icon">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="filter-group">
            <label>Estado:</label>
            <select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="todos">Todos</option>
              <option value="procesando">Procesando</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.userId || 'Cliente'}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span className={`status-badge status-${order.estado.toLowerCase()}`}>
                        {order.estado}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleViewOrder(order)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No se encontraron órdenes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      
      {/* Modal de detalles de orden */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Detalles de Orden #{selectedOrder.id}</h2>
              <button className="btn-close" onClick={handleCloseDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-details">
                <div className="order-info">
                  <p><strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p><strong>Cliente ID:</strong> {selectedOrder.userId || 'N/A'}</p>
                  <p><strong>Método de pago:</strong> {selectedOrder.paymentMethod === 'tarjeta' ? 'Tarjeta de crédito' : 'Transferencia bancaria'}</p>
                  <p>
                    <strong>Estado:</strong> 
                    <span className={`status-badge status-${selectedOrder.estado.toLowerCase()}`}>
                      {selectedOrder.estado}
                    </span>
                  </p>
                </div>
                
                <div className="order-items">
                  <h3>Productos</h3>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nombre}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.precio)}</td>
                          <td>{formatCurrency(item.precio * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="total-label">Total</td>
                        <td className="total-value">{formatCurrency(selectedOrder.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="order-actions">
                <h3>Actualizar estado</h3>
                <div className="status-buttons">
                  <button 
                    className={`btn ${selectedOrder.estado === 'Procesando' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleUpdateStatus('Procesando')}
                  >
                    Procesando
                  </button>
                  <button 
                    className={`btn ${selectedOrder.estado === 'Enviado' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleUpdateStatus('Enviado')}
                  >
                    Enviado
                  </button>
                  <button 
                    className={`btn ${selectedOrder.estado === 'Entregado' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleUpdateStatus('Entregado')}
                  >
                    Entregado
                  </button>
                  <button 
                    className={`btn ${selectedOrder.estado === 'Cancelado' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => handleUpdateStatus('Cancelado')}
                  >
                    Cancelado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdenes;