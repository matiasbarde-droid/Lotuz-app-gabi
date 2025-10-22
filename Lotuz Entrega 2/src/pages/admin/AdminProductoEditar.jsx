import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';

const AdminProductoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productForm, setProductForm] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    imagen: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('lotuz:products') || '[]');
      const prod = stored.find(p => p.id === id);
      if (!prod) {
        setError('Producto no encontrado');
      } else {
        setProductForm(prod);
      }
    } catch (e) {
      setError('Error cargando el producto');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const stored = JSON.parse(localStorage.getItem('lotuz:products') || '[]');
      const updated = stored.map(p => (p.id === productForm.id ? productForm : p));
      localStorage.setItem('lotuz:products', JSON.stringify(updated));
      navigate('/admin/productos');
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <AdminNav />
        <main className="container py-5">
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminNav />
      <main className="container py-5">
        <div className="admin-header" style={{ justifyContent: 'space-between' }}>
          <h1 className="text-white">Editar Producto</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/productos')}>Volver al listado</button>
        </div>

        <div className="card shadow mb-4 bg-dark border border-secondary" style={{ marginTop: 12 }}>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">{error}</div>
            )}
            {!error && (
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group mb-3">
                  <label htmlFor="nombre" className="form-label text-white">Nombre del producto</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control bg-dark text-white border-secondary"
                    value={productForm.nombre}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="descripcion" className="form-label text-white">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-control bg-dark text-white border-secondary"
                    value={productForm.descripcion}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                </div>

                <div className="form-row d-flex gap-3">
                  <div className="form-group flex-fill">
                    <label htmlFor="precio" className="form-label text-white">Precio</label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      className="form-control bg-dark text-white border-secondary"
                      value={productForm.precio}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group flex-fill">
                    <label htmlFor="stock" className="form-label text-white">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      className="form-control bg-dark text-white border-secondary"
                      value={productForm.stock}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="categoria" className="form-label text-white">Categoría</label>
                  <input
                    type="text"
                    id="categoria"
                    name="categoria"
                    className="form-control bg-dark text-white border-secondary"
                    value={productForm.categoria}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="imagen" className="form-label text-white">URL de imagen</label>
                  <input
                    type="text"
                    id="imagen"
                    name="imagen"
                    className="form-control bg-dark text-white border-secondary"
                    value={productForm.imagen}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-actions" style={{ marginTop: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/productos')}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProductoEditar;