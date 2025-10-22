import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';

const AdminProductos = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, edit, create
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  // Formulario para producto
  const [productForm, setProductForm] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    imagen: ''
  });

  useEffect(() => {
    // Cargar productos desde localStorage (simulando backend)
    const storedProducts = JSON.parse(localStorage.getItem('lotuz:products') || '[]');

    if (!storedProducts || storedProducts.length === 0) {
      const seedProducts = [
        { id: 'artisan_rojo1', nombre: 'Artisan Rojo', precio: 74990, imagen: '/img/productos/artisan_rojo1.png', categoria: 'Mousepads', descripcion: 'Mousepad con superficie control y base antideslizante.', stock: 20 },
        { id: 'raypad_azul1', nombre: 'X-Raypad Azul', precio: 39990, imagen: '/img/productos/raypad_azul1.png', categoria: 'Mousepads', descripcion: 'Mousepad speed azul, bordes cosidos premium.', stock: 20 },
        { id: 'raypad_rosado1', nombre: 'X-Raypad Rosado', precio: 49990, imagen: '/img/productos/raypad_rosado1.png', categoria: 'Mousepads', descripcion: 'Mousepad speed rosado, base de goma de alta densidad.', stock: 20 },
        { id: 'mouse_logi_rosa1', nombre: 'Logitech Superlight', precio: 115990, imagen: '/img/productos/mouse_logi_rosa1.png', categoria: 'Mouse', descripcion: 'Edición rosa, ligero y ergonómico.', stock: 15 },
        { id: 'mouse_mitsuri', nombre: 'Mouse Pulsar Mitsuri', precio: 132990, imagen: '/img/productos/mouse_mitsuri.png', categoria: 'Mouse', descripcion: 'Precisión y estabilidad.', stock: 12 },
        { id: 'razer_mouse1', nombre: 'Razer Deathadder v3', precio: 145990, imagen: '/img/productos/razer_mouse1.png', categoria: 'Mouse', descripcion: 'Switches ópticos.', stock: 18 },
        { id: 'audifonos_logi1', nombre: 'Audífonos Logitech Aurora', precio: 215990, imagen: '/img/productos/audifonos_logi1.png', categoria: 'Audífonos', descripcion: 'Sonido envolvente.', stock: 10 },
        { id: 'hyperx_cloud1', nombre: 'HyperX Cloud Flight', precio: 105990, imagen: '/img/productos/hyperx_cloud1.png', categoria: 'Audífonos', descripcion: 'Comodidad legendaria.', stock: 14 },
        { id: 'razer_kittynegros', nombre: 'Razer Kitty Negros', precio: 99990, imagen: '/img/productos/razer_kittynegros.png', categoria: 'Audífonos', descripcion: 'Orejas luminosas.', stock: 16 },
        { id: 'logitech_teclado_rosa', nombre: 'Teclado Logitech Pro', precio: 179990, imagen: '/img/productos/logitech_teclado_rosa.png', categoria: 'Teclados', descripcion: 'Compacto, RGB.', stock: 9 },
        { id: 'teclado_aurora', nombre: 'Teclado Aurora', precio: 189990, imagen: '/img/productos/teclado_aurora.png', categoria: 'Teclados', descripcion: 'TKL y keycaps premium.', stock: 11 },
        { id: 'tecladoatk_rosado1', nombre: 'Teclado ATK Rosado', precio: 75990, imagen: '/img/productos/tecladoatk_rosado1.png', categoria: 'Teclados', descripcion: 'Layout cómodo.', stock: 22 }
      ];
      localStorage.setItem('lotuz:products', JSON.stringify(seedProducts));
      setProducts(seedProducts);
      setFilteredProducts(seedProducts);
    } else {
      setProducts(storedProducts);
      setFilteredProducts(storedProducts);
    }
  }, []);

  useEffect(() => {
    // Aplicar filtros cuando cambien
    let result = [...products];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (categoryFilter !== 'todas') {
      result = result.filter(product => product.categoria === categoryFilter);
    }

    // Ordenar por clave seleccionada (por defecto ID ascendente)
    result.sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      if (sortKey === 'precio' || sortKey === 'stock') {
        return sortDir === 'asc' ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      return sortDir === 'asc'
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });

    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products, sortKey, sortDir]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setProductForm(product);
    setModalMode('view');
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm(product);
    setModalMode('edit');
    setShowProductModal(true);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setProductForm({
      id: Date.now().toString(),
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
      imagen: ''
    });
    setModalMode('create');
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('lotuz:products', JSON.stringify(updatedProducts));
      setShowProductModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    });
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      // Crear nuevo producto
      const newProducts = [...products, productForm];
      setProducts(newProducts);
      localStorage.setItem('lotuz:products', JSON.stringify(newProducts));
    } else if (modalMode === 'edit') {
      // Actualizar producto existente
      const updatedProducts = products.map(product => 
        product.id === productForm.id ? productForm : product
      );
      setProducts(updatedProducts);
      localStorage.setItem('lotuz:products', JSON.stringify(updatedProducts));
    }
    
    setShowProductModal(false);
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });
  };

  // Obtener categorías únicas para el filtro
  const categories = [...new Set(products.map(product => product.categoria))];

  return (
    <div className="admin-container">
      <AdminNav />
      
      <main className="container">
         <div className="admin-header">
           <h1>Gestión de productos</h1>
           <Link to="/admin/productos/nuevo" className="btn btn-primary">
             <i className="fas fa-plus"></i> Nuevo producto
           </Link>
         </div>
         
         <div className="admin-filters">
           <div className="search-box">
             <input 
               type="text" 
               placeholder="Buscar..." 
               value={searchTerm}
               onChange={handleSearchChange}
             />
             <button className="btn-icon">
               <i className="fas fa-search"></i>
             </button>
           </div>
           
           <div className="filter-group">
             <select value={categoryFilter} onChange={handleCategoryFilterChange}>
               <option value="todas">Todas las categorías</option>
               {categories.map(category => (
                 <option key={category} value={category}>{category}</option>
               ))}
             </select>
           </div>
         </div>
         
        <div className="card" style={{ marginTop: 12 }}>
          <div className="card-body">
            <table className="table">
               <thead>
                 <tr>
                   <th>ID</th>
                   <th>Nombre</th>
                   <th>Categoría</th>
                   <th>Precio</th>
                   <th>Acciones</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredProducts.length > 0 ? (
                   filteredProducts.map(product => (
                     <tr key={product.id}>
                       <td>#{product.id}</td>
                       <td>
                         <div className="product-name-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <div className="product-thumbnail">
                             <img
                               src={product.imagen || '/img/placeholder.png'}
                               alt={product.nombre}
                               loading="lazy"
                               style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: '8px' }}
                             />
                           </div>
                           <span>{product.nombre}</span>
                         </div>
                       </td>
                       <td>{product.categoria}</td>
                       <td>{formatCurrency(product.precio)}</td>
                       <td className="actions-cell">
                         <Link 
                           to={`/admin/productos/${product.id}/editar`} 
                           className="btn btn-secondary btn-sm"
                         >
                           Editar
                         </Link>
                         <button 
                           className="btn btn-danger btn-sm ms-2" 
                           onClick={() => handleDeleteProduct(product.id)}
                         >
                           Eliminar
                         </button>
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan="7" className="empty-table">
                       No se encontraron productos
                     </td>
                   </tr>
                 )}
</tbody>
            </table>
          </div>
        </div>
      </main>
      
      {/* Modal de producto */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>
                {modalMode === 'view' ? 'Detalles de Producto' : 
                 modalMode === 'edit' ? 'Editar Producto' : 'Crear Producto'}
              </h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmitProduct} className="product-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del producto</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    value={productForm.nombre} 
                    onChange={handleFormChange} 
                    disabled={modalMode === 'view'}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea 
                    id="descripcion" 
                    name="descripcion" 
                    value={productForm.descripcion} 
                    onChange={handleFormChange} 
                    disabled={modalMode === 'view'}
                    required 
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="precio">Precio</label>
                    <input 
                      type="number" 
                      id="precio" 
                      name="precio" 
                      value={productForm.precio} 
                      onChange={handleFormChange} 
                      disabled={modalMode === 'view'}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input 
                      type="number" 
                      id="stock" 
                      name="stock" 
                      value={productForm.stock} 
                      onChange={handleFormChange} 
                      disabled={modalMode === 'view'}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="categoria">Categoría</label>
                  <input 
                    type="text" 
                    id="categoria" 
                    name="categoria" 
                    value={productForm.categoria} 
                    onChange={handleFormChange} 
                    disabled={modalMode === 'view'}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="imagen">URL de imagen</label>
                  <input 
                    type="text" 
                    id="imagen" 
                    name="imagen" 
                    value={productForm.imagen} 
                    onChange={handleFormChange} 
                    disabled={modalMode === 'view'}
                  />
                </div>
                
                {modalMode !== 'view' && (
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {modalMode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={handleCloseModal}>
                      Cancelar
                    </button>
                  </div>
                )}
                
                {modalMode === 'view' && (
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={() => setModalMode('edit')}
                    >
                      Editar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={() => handleDeleteProduct(productForm.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductos;