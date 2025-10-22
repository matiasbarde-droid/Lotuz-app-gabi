import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import UserForm from '../../components/admin/UserForm';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/usuarios');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear nuevo usuario
  const handleAddNew = () => {
    setCurrentUser(null);
    setShowModal(true);
  };

  // Abrir modal para editar usuario existente
  const handleEdit = (user) => {
    setCurrentUser({ ...user });
    setShowModal(true);
  };

  // Manejar el guardado del usuario desde el formulario
  const handleSaveUser = async (savedUser) => {
    await fetchUsers();
  };

  // Eliminar/Inhabilitar usuario
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea inhabilitar este usuario?')) {
      try {
        setLoading(true);
        await api.delete(`/admin/usuarios/${id}`);
        await fetchUsers();
      } catch (err) {
        console.error('Error al inhabilitar usuario:', err);
        setError('Error al inhabilitar el usuario');
      } finally {
        setLoading(false);
      }
    }
  };

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Administración de Usuarios</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleAddNew}
        >
          <i className="fas fa-plus me-2"></i>Nuevo Usuario
        </button>
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
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>RUT</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{`${user.nombre} ${user.apellido || ''}`}</td>
                      <td>{user.email}</td>
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
                    <td colSpan="7" className="text-center">
                      No hay usuarios disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Componente UserForm integrado */}
      <UserForm 
        show={showModal}
        onClose={() => setShowModal(false)}
        user={currentUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default AdminUsers;