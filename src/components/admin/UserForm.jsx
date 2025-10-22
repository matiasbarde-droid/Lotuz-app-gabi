import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import { validateRut, formatRut, validatePhone } from '../../utils/validators';

const UserForm = ({ show, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: '',
    region: '',
    comuna: '',
    password: '',
    confirmPassword: '',
    rol: 'CLIENTE',
    activo: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'CLIENTE', label: 'Cliente' },
    { value: 'VENDEDOR', label: 'Vendedor' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'SUPER_ADMIN', label: 'Super Administrador' }
  ];

  // Cargar datos del usuario cuando se edita
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || null,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        rut: user.rut || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        region: user.region || '',
        comuna: user.comuna || '',
        password: '',
        confirmPassword: '',
        rol: user.rol || 'CLIENTE',
        activo: user.activo !== undefined ? user.activo : true
      });
    } else {
      // Reset form para nuevo usuario
      setFormData({
        id: null,
        nombre: '',
        apellido: '',
        rut: '',
        email: '',
        telefono: '',
        direccion: '',
        region: '',
        comuna: '',
        password: '',
        confirmPassword: '',
        rol: 'CLIENTE',
        activo: true
      });
    }
    
    setErrors({});
  }, [user, show]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'rut') {
      // Formatear RUT mientras se escribe
      setFormData({
        ...formData,
        [name]: formatRut(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
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
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }
    
    if (!formData.rut.trim()) {
      newErrors.rut = 'El RUT es obligatorio';
    } else if (!validateRut(formData.rut)) {
      newErrors.rut = 'El RUT no es válido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (formData.telefono && !validatePhone(formData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido';
    }
    
    // Validar contraseña solo para nuevos usuarios o si se está cambiando
    if (!formData.id) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      
      // Crear objeto para enviar al servidor
      const userData = { ...formData };
      
      // Si no se está cambiando la contraseña en edición, eliminarla del objeto
      if (formData.id && !formData.password) {
        delete userData.password;
      }
      
      // Eliminar confirmPassword ya que no se envía al servidor
      delete userData.confirmPassword;
      
      let response;
      
      if (formData.id) {
        // Actualizar usuario
        response = await api.put(`/admin/usuarios/${formData.id}`, userData);
      } else {
        // Crear usuario
        response = await api.post('/admin/usuarios', userData);
      }
      
      // Notificar al componente padre
      if (onSave) {
        onSave(response.data);
      }
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setErrors({
        ...errors,
        submit: 'Error al guardar el usuario. Intente nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {formData.id ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}
              
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
                  <label htmlFor="rut" className="form-label">RUT *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                    id="rut"
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                    placeholder="12.345.678-9"
                    required
                  />
                  {errors.rut && (
                    <div className="invalid-feedback">{errors.rut}</div>
                  )}
                </div>
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
                    placeholder="+56912345678"
                  />
                  {errors.telefono && (
                    <div className="invalid-feedback">{errors.telefono}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="region" className="form-label">Región</label>
                  <input
                    type="text"
                    className="form-control"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="comuna" className="form-label">Comuna</label>
                  <input
                    type="text"
                    className="form-control"
                    id="comuna"
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleChange}
                  />
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
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    {formData.id ? 'Contraseña (dejar en blanco para mantener)' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!formData.id}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label">
                    {formData.id ? 'Confirmar Contraseña' : 'Confirmar Contraseña *'}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!formData.id}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="rol" className="form-label">Rol *</label>
                  <select
                    className="form-select"
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    required
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="activo"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="activo">
                      Usuario Activo
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
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
                  'Guardar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;