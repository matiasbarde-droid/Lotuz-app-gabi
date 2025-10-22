// src/components/client/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { validateEmail, validateRut, validatePhone } from '../../utils/validators';

export default function ProfileForm({ user, onUpdateSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        rut: user.rut || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar campos obligatorios
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.apellido) {
      newErrors.apellido = 'El apellido es obligatorio';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    // Validar RUT si está presente
    if (formData.rut && !validateRut(formData.rut)) {
      newErrors.rut = 'El RUT no es válido';
    }
    
    // Validar teléfono si está presente
    if (formData.telefono && !validatePhone(formData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido';
    }
    
    // Validar contraseña solo si se está cambiando
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Crear objeto para enviar al servidor
      const userData = { ...formData };
      
      // Si no se está cambiando la contraseña, eliminarla del objeto
      if (!formData.password) {
        delete userData.password;
      }
      
      // Eliminar confirmPassword ya que no se envía al servidor
      delete userData.confirmPassword;
      
      // Actualizar perfil
      await apiClient.put(`/perfil/${user.id}`, userData);
      
      // Notificar éxito
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError('Error al actualizar el perfil. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card-body">
      <h2 className="text-large mb-4">Editar Información Personal</h2>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="nombre" className="form-label">Nombre *</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            {errors.nombre && (
              <div className="invalid-feedback">{errors.nombre}</div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="apellido" className="form-label">Apellido *</label>
            <input
              type="text"
              className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            {errors.apellido && (
              <div className="invalid-feedback">{errors.apellido}</div>
            )}
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="rut" className="form-label">RUT</label>
            <input
              type="text"
              className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
              id="rut"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              placeholder="12.345.678-9"
            />
            {errors.rut && (
              <div className="invalid-feedback">{errors.rut}</div>
            )}
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input
              type="text"
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
            />
            {errors.telefono && (
              <div className="invalid-feedback">{errors.telefono}</div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <hr className="my-4" />
        <h6 className="mb-3">Cambiar Contraseña</h6>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Nueva Contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
            <small className="form-text text-muted">
              Dejar en blanco para mantener la contraseña actual
            </small>
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>
        </div>
        
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Actualizar Perfil'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}