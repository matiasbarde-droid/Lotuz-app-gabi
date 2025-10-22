// src/components/client/OrderHistory.jsx 
import React, { useState, useEffect } from 'react'; 
import apiClient from '../../api/apiClient'; 
import { useAuth } from '../../context/AuthContext'; 
 
// Utilitarios (asumimos que ya existen) 
const money = v => Number(v || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }); 
const formatDate = dateString => new Date(dateString).toLocaleDateString('es-CL', { 
    year: 'numeric', month: 'short', day: 'numeric' 
}); 
 
export default function OrderHistory() { 
  const { user } = useAuth(); 
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
 
  useEffect(() => { 
    if (!user || !user.id) return; 
 
    const fetchOrders = async () => { 
      try { 
        setLoading(true); 
        setError(null); 
        
        // Conexión al endpoint de Spring Boot 
        const response = await apiClient.get(`/perfil/${user.id}/ordenes`); 
        setOrders(response.data || []); 
      } catch (err) { 
        console.error("Error al obtener historial de órdenes:", err); 
        setError("No fue posible cargar el historial de compras."); 
      } finally { 
        setLoading(false); 
      } 
    }; 
 
    fetchOrders(); 
  }, [user]); 
 
  if (loading) { 
    return <div className="card-body">Cargando historial de compras...</div>; 
  } 
 
  if (error) { 
    return <div className="card-body"><p className="error">{error}</p></div>; 
  } 
 
  // HTML migrado para mostrar la tabla de órdenes 
  return ( 
    <section className="card" style={{ marginTop: 20 }}> 
      <h2 className="titulo-seccion" style={{ marginTop: 0, marginBottom: 15, paddingLeft: 15 }}> 
        Historial de Compras 
      </h2> 
      <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}> 
        
        {orders.length === 0 ? ( 
          <p style={{ textAlign: 'center', padding: '15px' }}> 
            Aún no has realizado ninguna compra. 
          </p> 
        ) : ( 
          <table className="table table-striped table-hover" style={{ minWidth: 600 }}> 
            <thead> 
              <tr> 
                <th>ID Orden</th> 
                <th>Fecha</th> 
                <th>Total</th> 
                <th>Estado</th> 
                <th>Detalle</th> 
              </tr> 
            </thead> 
            <tbody> 
              {orders.map((order) => ( 
                <tr key={order.id} className={`order-status-${order.estado}`}> 
                  <td>#{order.id}</td> 
                  <td>{formatDate(order.fechaCreacion)}</td> 
                  <td>{money(order.total)}</td> 
                  <td> 
                    {/* El estado es típicamente un string o enum: PENDIENTE, PAGADO, DESPACHADO, etc. */} 
                    <span className={`badge status-${order.estado.toLowerCase()}`}> 
                      {order.estado} 
                    </span> 
                  </td> 
                  <td> 
                    {/* Botón para ver el detalle de la orden (puedes implementarlo con un Modal) */} 
                    <button className="btn btn-ghost btn-sm" /* onClick={() => showOrderDetails(order)} */> 
                      Ver 
                    </button> 
                  </td> 
                </tr> 
              ))} 
            </tbody> 
          </table> 
        )} 
      </div> 
    </section> 
  ); 
}