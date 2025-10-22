import React, { useEffect, useState } from 'react';
import { api } from '../../api/apiClient';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'MOUSEPAD',
    fotoUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio ?? 0,
        categoria: product.categoria || 'MOUSEPAD',
        fotoUrl: product.fotoUrl || ''
      });
      setPreviewUrl(product.fotoUrl || '');
    } else {
      setFormData({ sku: '', nombre: '', descripcion: '', precio: 0, categoria: 'MOUSEPAD', fotoUrl: '' });
      setPreviewUrl('');
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sku?.trim()) newErrors.sku = 'SKU es requerido';
    if (!formData.nombre?.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!formData.descripcion?.trim()) newErrors.descripcion = 'Descripción es requerida';
    if (formData.precio === undefined || Number(formData.precio) <= 0) newErrors.precio = 'Precio debe ser mayor a 0';
    if (!formData.categoria?.trim()) newErrors.categoria = 'Categoría es requerida';
    if (!formData.fotoUrl?.trim()) newErrors.fotoUrl = 'URL de la foto es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'fotoUrl') setPreviewUrl(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const payload = {
        sku: formData.sku.trim(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        categoria: formData.categoria,
        fotoUrl: formData.fotoUrl.trim()
      };

      let response;
      if (product && product.sku) {
        response = await api.put(`/admin/productos/${product.sku}`, payload);
      } else {
        response = await api.post('/admin/productos', payload);
      }

      onSave?.(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">{product ? 'Editar Producto' : 'Nuevo Producto'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">SKU</label>
              <input
                type="text"
                name="sku"
                className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                value={formData.sku}
                onChange={handleChange}
                disabled={!!product}
              />
              {errors.sku && <div className="invalid-feedback">{errors.sku}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>

            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                rows="3"
                value={formData.descripcion}
                onChange={handleChange}
              />
              {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label">Precio</label>
              <input
                type="number"
                name="precio"
                className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
                value={formData.precio}
                onChange={handleChange}
                min="0"
                step="1"
              />
              {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label">Categoría</label>
              <select
                name="categoria"
                className={`form-select ${errors.categoria ? 'is-invalid' : ''}`}
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="MOUSEPAD">Mousepad</option>
                <option value="TECLADO">Teclado</option>
                <option value="MOUSE">Mouse</option>
                <option value="AUDIFONO">Audífono</option>
                <option value="ACCESORIO">Accesorio</option>
              </select>
              {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label">Foto URL</label>
              <input
                type="url"
                name="fotoUrl"
                className={`form-control ${errors.fotoUrl ? 'is-invalid' : ''}`}
                value={formData.fotoUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
              {errors.fotoUrl && <div className="invalid-feedback">{errors.fotoUrl}</div>}
            </div>

            <div className="col-12">
              {previewUrl ? (
                <img src={previewUrl} alt="Vista previa" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
              ) : (
                <span className="text-muted">Sin imagen de vista previa</span>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={submitting}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;