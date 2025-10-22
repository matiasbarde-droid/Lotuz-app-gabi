import React, { useState } from 'react';
import { api } from '../../api/apiClient';
import { validateRut, validatePhone, validateEmail, validateInstitutionalEmail, validatePassword } from '../../utils/validators';
import { Link } from 'react-router-dom';

// Lista de regiones de Chile para formularios
const regiones = [
  { id: 1, nombre: 'Arica y Parinacota' },
  { id: 2, nombre: 'Tarapacá' },
  { id: 3, nombre: 'Antofagasta' },
  { id: 4, nombre: 'Atacama' },
  { id: 5, nombre: 'Coquimbo' },
  { id: 6, nombre: 'Valparaíso' },
  { id: 7, nombre: 'Metropolitana de Santiago' },
  { id: 8, nombre: 'Libertador General Bernardo O\'Higgins' },
  { id: 9, nombre: 'Maule' },
  { id: 10, nombre: 'Ñuble' },
  { id: 11, nombre: 'Biobío' },
  { id: 12, nombre: 'La Araucanía' },
  { id: 13, nombre: 'Los Ríos' },
  { id: 14, nombre: 'Los Lagos' },
  { id: 15, nombre: 'Aysén del General Carlos Ibáñez del Campo' },
  { id: 16, nombre: 'Magallanes y de la Antártica Chilena' }
];

// Lista típica de comunas (fallback local por región)
const comunasPorRegion = {
  7: [
    { id: 'santiago', nombre: 'Santiago' },
    { id: 'providencia', nombre: 'Providencia' },
    { id: 'nunoa', nombre: 'Ñuñoa' },
    { id: 'las_condes', nombre: 'Las Condes' },
    { id: 'maipu', nombre: 'Maipú' },
    { id: 'puente_alto', nombre: 'Puente Alto' },
    { id: 'la_florida', nombre: 'La Florida' },
    { id: 'recoleta', nombre: 'Recoleta' },
    { id: 'penalolen', nombre: 'Peñalolén' }
  ],
  6: [
    { id: 'valparaiso', nombre: 'Valparaíso' },
    { id: 'vina_del_mar', nombre: 'Viña del Mar' },
    { id: 'quilpue', nombre: 'Quilpué' },
    { id: 'villa_alemana', nombre: 'Villa Alemana' }
  ],
  8: [
    { id: 'rancagua', nombre: 'Rancagua' },
    { id: 'machali', nombre: 'Machalí' },
    { id: 'san_vicente', nombre: 'San Vicente' }
  ],
  11: [
    { id: 'concepcion', nombre: 'Concepción' },
    { id: 'talcahuano', nombre: 'Talcahuano' },
    { id: 'san_pedro_de_la_paz', nombre: 'San Pedro de la Paz' }
  ],
  12: [
    { id: 'temuco', nombre: 'Temuco' },
    { id: 'padre_las_casas', nombre: 'Padre Las Casas' }
  ]
};

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [comunas, setComunas] = useState([]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error específico cuando el usuario modifica un campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Si cambia la región, cargar las comunas correspondientes
    if (name === 'region' && value) {
      loadComunas(value);
    }
  };
  
  // Cargar comunas según la región seleccionada
  const loadComunas = async (regionId) => {
    try {
      const response = await api.get(`/regiones/${regionId}/comunas`);
      const data = response.data;
      if (Array.isArray(data) && data.length) {
        setComunas(data);
        return;
      }
    } catch (error) {
      console.warn('Fallo API comunas, usando lista local:', error);
    }
    setComunas(comunasPorRegion[regionId] || []);
  };
  
  // Validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    
    // Validar campos obligatorios
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (formData.password && !validatePassword(formData.password, 8)) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    
    // Validar RUT
    if (!formData.rut.trim()) {
      newErrors.rut = 'El RUT es obligatorio';
    } else if (!validateRut(formData.rut)) {
      newErrors.rut = 'El RUT ingresado no es válido';
    }
    
    // Validar teléfono
    if (formData.telefono && !validatePhone(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener exactamente 9 dígitos';
    }
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Normalizar y validar formato de email
    const emailNormalized = (formData.email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailNormalized && !emailRegex.test(emailNormalized)) {
      newErrors.email = 'Ingrese un email válido';
    }
    // Temporalmente desactivamos la validación de email institucional para pruebas
    /*if (emailNormalized && !validateInstitutionalEmail(emailNormalized)) {
      newErrors.email = 'El email debe terminar en @profesor.duoc.cl o @duocuc.cl';
    }*/
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const nombreCompleto = `${(formData.nombre || '').trim()} ${(formData.apellido || '').trim()}`.trim();
      const payload = {
        nombre: nombreCompleto,
        rut: (formData.rut || '').trim(),
        telefono: (formData.telefono || '').trim(),
        region: formData.region || null,
        comuna: formData.comuna || null,
        direccion: (formData.direccion || '').trim(),
        password: formData.password,
        correo: (formData.email || '').trim().toLowerCase(),
      };
      const response = await api.post('/auth/register', payload);
      
      if (response.data) {
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          rut: '',
          email: '',
          telefono: '',
          region: '',
          comuna: '',
          direccion: '',
          password: '',
          confirmPassword: ''
        });
        
        // Notificar éxito al componente padre
        if (onRegisterSuccess) {
          onRegisterSuccess(response.data);
        }
      }
    } catch (error) {
      const status = error.response?.status;
      const errorMessage = status === 400
        ? 'Datos inválidos o correo ya registrado'
        : (error.response?.data?.message || 'Error al registrar usuario');
      setErrors({
        ...errors,
        general: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-form">
      <h2>Crear Cuenta</h2>
      
      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                value={formData.apellido}
                onChange={handleChange}
                required
              />
              {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="rut">RUT *</label>
              <input
                type="text"
                id="rut"
                name="rut"
                className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                value={formData.rut}
                onChange={handleChange}
                placeholder="12345678-9"
                required
              />
              {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                value={formData.telefono}
                onChange={handleChange}
                placeholder="123456789"
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="region">Región</label>
              <select
                id="region"
                name="region"
                className="form-control"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="">Seleccione una región</option>
                {regiones.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="comuna">Comuna</label>
              <select
                id="comuna"
                name="comuna"
                className="form-control"
                value={formData.comuna}
                onChange={handleChange}
                disabled={!formData.region}
              >
                <option value="">Seleccione una comuna</option>
                {comunas.map((comuna) => (
                  <option key={comuna.id} value={comuna.nombre}>
                    {comuna.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                className="form-control"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary btn-block mt-4"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      
      <div className="mt-3 text-center">
        <p>¿Ya tienes cuenta? <Link to="/login" className="text-info">Inicia sesión aquí</Link></p>
      </div>
    </div>
  );
};

export default RegisterForm;