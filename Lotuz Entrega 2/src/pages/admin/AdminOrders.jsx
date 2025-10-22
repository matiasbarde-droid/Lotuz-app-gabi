import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const navigate = useNavigate();
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });

  // Opciones de estado de orden
  const orderStatuses = [
    { value: '', label: 'Todos los estados' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'PAGADO', label: 'Pagado' },
    { value: 'PREPARACION', label: 'En preparación' },
    { value: 'DESPACHADO', label: 'Despachado' },
    { value: 'ENTREGADO', label: 'Entregado' },
    { value: 'CANCELADO', label: 'Cancelado' }
  ];

  // Cargar órdenes al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []);

  // Obtener órdenes con filtros aplicados
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.estado) {
        params.append('estadoFiltro', filters.estado);
      }
      if (filters.busqueda) {
        params.append('terminoBusqueda', filters.busqueda);
      }
      const response = await api.get(`/admin/ordenes?${params.toString()}`);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('Error al cargar la lista de órdenes');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Aplicar filtros
  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      estado: '',
      fechaDesde: '',
      fechaHasta: '',
      busqueda: ''
    });
    // Esperar a que se actualice el estado antes de hacer la búsqueda
    setTimeout(() => {
      fetchOrders();
    }, 0);
  };

  // Ver detalle de orden
  const handleViewDetail = async (orderId) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/ordenes/${orderId}`);
      setCurrentOrder(response.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error al cargar detalle de orden:', err);
      setError('Error al cargar el detalle de la orden');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de orden
  const handleChangeStatus = async (orderNumber, newStatus) => {
    try {
      setLoading(true);
      await api.put(`/admin/ordenes/${orderNumber}/estado?nuevoEstado=${newStatus}`);
      if (currentOrder && currentOrder.numeroOrden === orderNumber) {
        setCurrentOrder({
          ...currentOrder,
          estado: newStatus
        });
      }
      await fetchOrders();
      setError(null);
    } catch (err) {
      console.error('Error al cambiar estado de orden:', err);
      setError('Error al cambiar el estado de la orden');
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  // Obtener clase de badge según estado
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-warning';
      case 'PAGADO':
        return 'bg-info';
      case 'PREPARACION':
        return 'bg-primary';
      case 'DESPACHADO':
        return 'bg-success';
      case 'ENTREGADO':
        return 'bg-success';
      case 'CANCELADO':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h1 className="h3 mb-4">Administración de Órdenes</h1>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/admin')}>
            Volver
          </button>
        </div>
        <div>
          <button className="btn btn-outline-primary" onClick={fetchOrders}>
            Actualizar
          </button>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Filtros de búsqueda</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleApplyFilters}>
            <div className="row mb-3">
              <div className="col-md-3">
                <label htmlFor="estado" className="form-label">Estado</label>
                <select
                  className="form-select"
                  id="estado"
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                >
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="fechaDesde" className="form-label">Fecha desde</label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaDesde"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="fechaHasta" className="form-label">Fecha hasta</label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaHasta"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="busqueda" className="form-label">Búsqueda</label>
                <input
                  type="text"
                  className="form-control"
                  id="busqueda"
                  name="busqueda"
                  placeholder="ID, Cliente, RUT..."
                  value={filters.busqueda}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={handleResetFilters}
              >
                Limpiar
              </button>
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabla de órdenes */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
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
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{formatDate(order.fechaCreacion)}</td>
                      <td>{order.emailCliente || 'Cliente'}</td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.estado)}`}>
                          {order.estado}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-info me-2" 
                          onClick={() => handleViewDetail(order.id)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay órdenes disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de detalle de orden */}
      {showDetailModal && currentOrder && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalle de Orden #{currentOrder.id}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Información del Cliente</h6>
                    <p>
                      <strong>Nombre:</strong> {currentOrder.cliente?.nombre} {currentOrder.cliente?.apellido}<br />
                      <strong>Email:</strong> {currentOrder.cliente?.email}<br />
                      <strong>RUT:</strong> {currentOrder.cliente?.rut}<br />
                      <strong>Teléfono:</strong> {currentOrder.cliente?.telefono || 'No especificado'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Información de Envío</h6>
                    <p>
                      <strong>Dirección:</strong> {currentOrder.direccionEnvio || 'No especificada'}<br />
                      <strong>Comuna:</strong> {currentOrder.comuna || 'No especificada'}<br />
                      <strong>Región:</strong> {currentOrder.region || 'No especificada'}
                    </p>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-12">
                    <h6>Estado de la Orden</h6>
                    <div className="d-flex align-items-center">
                      <span className={`badge ${getStatusBadgeClass(currentOrder.estado)} me-3`}>
                        {currentOrder.estado}
                      </span>
                      
                      <div className="dropdown">
                        <button 
                          className="btn btn-sm btn-outline-primary dropdown-toggle" 
                          type="button" 
                          id="dropdownMenuButton" 
                          data-bs-toggle="dropdown" 
                          aria-expanded="false"
                        >
                          Cambiar Estado
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          {orderStatuses
                            .filter(status => status.value && status.value !== currentOrder.estado)
                            .map(status => (
                              <li key={status.value}>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => handleChangeStatus(currentOrder.numeroOrden, status.value)}
                                >
                                  {status.label}
                                </button>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h6>Productos</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.producto?.nombre}</td>
                          <td>{formatPrice(item.precioUnitario)}</td>
                          <td>{item.cantidad}</td>
                          <td>{formatPrice(item.precioUnitario * item.cantidad)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                        <td><strong>{formatPrice(currentOrder.total)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {currentOrder.notas && (
                  <div className="mt-3">
                    <h6>Notas</h6>
                    <p>{currentOrder.notas}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDetailModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;