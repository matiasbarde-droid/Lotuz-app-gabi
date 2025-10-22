import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import Footer from '../../components/common/Footer';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    ordenes: 0,
    ingresos: 0,
    ticketPromedio: 0,
    actividadReciente: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardStats = () => {
      try {
        setLoading(true);
        const raw = localStorage.getItem('lotuz:orders');
        const orders = JSON.parse(raw || '[]');
        const lista = Array.isArray(orders) ? orders : [];
        const ordenes = lista.length;
        const ingresos = lista.reduce((sum, o) => sum + Number(o.total || 0), 0);
        const ticketPromedio = ordenes ? Math.round(ingresos / ordenes) : 0;
        const actividadReciente = lista.slice(-5).reverse();
        setStats({ ordenes, ingresos, ticketPromedio, actividadReciente });
        setError(null);
      } catch (err) {
        console.error('Error al calcular estadísticas:', err);
        setError('Error al calcular estadísticas');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column">
      <AdminNav />

      <main className="container py-4 flex-grow-1">
        <h1 className="h5 mb-3">Dashboard</h1>

        <div className="row g-3">
          <div className="col-12">
            <div className="p-3 bg-dark border border-secondary rounded">
              <div className="fw-semibold mb-1">Órdenes</div>
              <div className="fs-4">{stats.ordenes}</div>
            </div>
          </div>
          <div className="col-12">
            <div className="p-3 bg-dark border border-secondary rounded">
              <div className="fw-semibold mb-1">Ingresos</div>
              <div className="fs-4">
                {stats.ingresos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="p-3 bg-dark border border-secondary rounded">
              <div className="fw-semibold mb-1">Ticket promedio</div>
              <div className="fs-4">
                {stats.ticketPromedio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="p-3 bg-dark border border-secondary rounded">
              <div className="fw-semibold mb-1">Actividad reciente</div>
              {stats.actividadReciente.length === 0 ? (
                <div>No hay movimientos.</div>
              ) : (
                <ul className="mb-0">
                  {stats.actividadReciente.map((o, idx) => (
                    <li key={o.id || idx}>
                      {new Date(o.fechaCreacion || o.createdAt || o.fecha || o.date).toLocaleDateString('es-CL')} — {(o.total || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;