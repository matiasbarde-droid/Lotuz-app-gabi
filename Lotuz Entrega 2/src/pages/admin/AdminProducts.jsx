import React, { useEffect, useState } from 'react';
import { api } from '../../api/apiClient';
import ProductForm from '../../components/admin/ProductForm';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/productos');
      setProducts(response.data);
    } catch (err) {
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de inactivar este producto?')) return;
    try {
      await api.put(`/admin/products/${id}`, { estado: 'INACTIVO' }, { headers: { 'X-ADMIN': 'true' } });
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, estado: 'INACTIVO' } : p)));
    } catch (err) {
      alert('Error al inactivar el producto');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleSave = (savedProduct) => {
    setShowForm(false);
    setSelectedProduct(null);
    // Si existe en la lista, lo reemplazamos; si no, lo agregamos
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      return exists
        ? prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
        : [savedProduct, ...prev];
    });
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Administración de Productos</h2>
        <button className="btn btn-primary" onClick={handleCreate}>Nuevo Producto</button>
      </div>

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setSelectedProduct(null); }}
        />
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.sku}>
                <td>{product.id}</td>
                <td>
                  {product.fotoUrl ? (
                    <img src={product.fotoUrl} alt={product.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                  ) : (
                    <span className="text-muted">Sin imagen</span>
                  )}
                </td>
                <td>{product.nombre}</td>
                <td>{product.categoria}</td>
                <td>${Number(product.precio).toLocaleString('es-CL')}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => handleEdit(product)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
