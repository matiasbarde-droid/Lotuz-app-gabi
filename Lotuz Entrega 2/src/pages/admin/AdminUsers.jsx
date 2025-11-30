import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import UserForm from '../../components/admin/UserForm';
import { exportToCSV, exportToExcel } from '../../utils/export';
import AdminNav from '../../components/admin/AdminNav';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const [usersPage, setUsersPage] = useState({ content: [], totalElements: 0, number: 0, size: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('CLIENTE');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { user: currentUser } = useAuth();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [query, roleFilter, statusFilter, dateFrom, dateTo, sort, page, size]);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (roleFilter) params.set('rol', roleFilter);
      if (statusFilter) params.set('activo', statusFilter === 'activo' ? 'true' : statusFilter === 'inactivo' ? 'false' : '');
      if (dateFrom) params.set('from', `${dateFrom}T00:00:00`);
      if (dateTo) params.set('to', `${dateTo}T23:59:59`);
      params.set('page', page);
      params.set('size', size);
      params.set('sort', `${sort.field},${sort.dir}`);
      const response = await api.get(`/admin/usuarios?${params.toString()}`);
      const data = response.data;
      const pageData = Array.isArray(data) ? { content: data, totalElements: data.length, number: 0, size: data.length } : data;
      setUsersPage(pageData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err.userMessage || 'Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear nuevo usuario
  const handleAddNew = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  // Abrir modal para editar usuario existente
  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setShowModal(true);
  };

  // Manejar el guardado del usuario desde el formulario
  const handleSaveUser = async (savedUser) => {
    try {
      await api.post('/admin/audit', { action: savedUser?.id ? 'update_user' : 'create_user', user: savedUser?.correo || '-', details: JSON.stringify({ id: savedUser?.id }) });
    } catch {}
    await fetchUsers();
  };

  // Eliminar/Inhabilitar usuario
  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Está seguro que desea desactivar este usuario?');
    if (!confirmed) return;
    try {
      setLoading(true);
      await api.delete(`/admin/usuarios/${id}`);
      try { await api.post('/admin/audit', { action: 'deactivate_user', user: String(id), details: 'Desactivado por admin' }); } catch {}
      await fetchUsers();
    } catch (err) {
      console.error('Error al desactivar usuario:', err);
      setError(err.userMessage || 'Error al desactivar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil((usersPage.totalElements || 0) / (usersPage.size || size)) || 1;
  const users = (usersPage.content || [])
    .filter(u => u.rol === 'CLIENTE')
    .filter(u => (currentUser?.id ? u.id !== currentUser.id : true) && (currentUser?.correo ? u.correo !== currentUser.correo : true));

  const handleSort = (field) => {
    setSort((prev) => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const headersForExport = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'correo', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    { key: 'activo', label: 'Estado' },
    { key: 'createdAt', label: 'Fecha Creación' },
  ];

  const handleExportCSV = () => exportToCSV(users, headersForExport, 'usuarios.csv');
  const handleExportExcel = () => exportToExcel(users, headersForExport, 'usuarios.xls');

  if (loading && users.length === 0) {
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
      <AdminNav />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Administración de Usuarios</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleAddNew}
        >
          <i className="fas fa-plus me-2"></i>Nuevo Usuario
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, email o rol"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="CLIENTE">Clientes</option>
                <option value="ADMIN">Administradores</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <div>
              <button className="btn btn-outline-secondary me-2" onClick={handleExportCSV}>Exportar CSV</button>
              <button className="btn btn-outline-secondary" onClick={handleExportExcel}>Exportar Excel</button>
            </div>
            <div>
              <select className="form-select" style={{ width: 'auto', display: 'inline-block' }} value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID</th>
                  <th onClick={() => handleSort('nombre')} style={{ cursor: 'pointer' }}>Nombre</th>
                  <th onClick={() => handleSort('correo')} style={{ cursor: 'pointer' }}>Email</th>
                  <th>RUT</th>
                  <th onClick={() => handleSort('rol')} style={{ cursor: 'pointer' }}>Rol</th>
                  <th onClick={() => handleSort('activo')} style={{ cursor: 'pointer' }}>Estado</th>
                  <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>Fecha creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.correo}</td>
                      <td>{user.rut}</td>
                      <td>
                        <span className={`badge ${
                          user.rol === 'ADMIN' || user.rol === 'SUPER_ADMIN' 
                            ? 'bg-danger' 
                            : user.rol === 'VENDEDOR' 
                              ? 'bg-warning' 
                              : 'bg-info'
                        }`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.activo ? 'bg-success' : 'bg-secondary'}`}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-info me-2" 
                          onClick={() => handleEdit(user)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(user.id)}
                          disabled={user.rol === 'SUPER_ADMIN'}
                          title={user.rol === 'SUPER_ADMIN' ? 'No se puede inhabilitar un Super Admin' : ''}
                        >
                          <i className="fas fa-user-slash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No hay usuarios disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Página {usersPage.number + 1} de {totalPages}
            </div>
            <div>
              <button className="btn btn-outline-secondary me-2" disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Anterior</button>
              <button className="btn btn-outline-secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</button>
            </div>
          </div>
        </div>
      </div>

      {/* Componente UserForm integrado */}
      <UserForm 
        show={showModal}
        onClose={() => setShowModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default AdminUsers;
