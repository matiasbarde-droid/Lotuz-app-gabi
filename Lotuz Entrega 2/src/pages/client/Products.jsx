import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const Products = () => {
  // Datos de ejemplo para los productos
  const mockProducts = [
    {
      id: 1,
      nombre: 'Artisan Rojo',
      precio: 74990,
      imagen: '/img/productos/artisan_rojo1.png',
      categoria: 'Mousepads',
      descripcion: 'Mousepad con superficie control y base antideslizante.'
    },
    {
      id: 2,
      nombre: 'X-Raypad Azul',
      precio: 39990,
      imagen: '/img/productos/raypad_azul1.png',
      categoria: 'Mousepads',
      descripcion: 'Mousepad speed azul, bordes cosidos premium.'
    },
    {
      id: 3,
      nombre: 'X-Raypad Rosado',
      precio: 49990,
      imagen: '/img/productos/raypad_rosado1.png',
      categoria: 'Mousepads',
      descripcion: 'Mousepad speed rosado, base de goma de alta densidad.'
    },
    {
      id: 4,
      nombre: 'Logitech Superlight',
      precio: 115990,
      imagen: '/img/productos/mouse_logi_rosa1.png',
      categoria: 'Mouse',
      descripcion: 'Edición rosa, ligero y ergonómico.'
    },
    {
      id: 5,
      nombre: 'Mouse Pulsar Mitsuri',
      precio: 132990,
      imagen: '/img/productos/mouse_mitsuri.png',
      categoria: 'Mouse',
      descripcion: 'Precisión y estabilidad.'
    },
    {
      id: 6,
      nombre: 'Razer Deathadder v3',
      precio: 145990,
      imagen: '/img/productos/razer_mouse1.png',
      categoria: 'Mouse',
      descripcion: 'Switches ópticos.'
    },
    {
      id: 7,
      nombre: 'Audífonos Logitech Aurora',
      precio: 215990,
      imagen: '/img/productos/audifonos_logi1.png',
      categoria: 'Audífonos',
      descripcion: 'Sonido envolvente.'
    },
    {
      id: 8,
      nombre: 'HyperX Cloud Flight',
      precio: 105990,
      imagen: '/img/productos/hyperx_cloud1.png',
      categoria: 'Audífonos',
      descripcion: 'Comodidad legendaria.'
    },
    {
      id: 9,
      nombre: 'Razer Kitty Negros',
      precio: 99990,
      imagen: '/img/productos/razer_kittynegros.png',
      categoria: 'Audífonos',
      descripcion: 'Orejas luminosas.'
    },
    {
      id: 10,
      nombre: 'Teclado Logitech Pro',
      precio: 179990,
      imagen: '/img/productos/logitech_teclado_rosa.png',
      categoria: 'Teclados',
      descripcion: 'Compacto, RGB.'
    },
    {
      id: 11,
      nombre: 'Teclado Aurora',
      precio: 189990,
      imagen: '/img/productos/teclado_aurora.png',
      categoria: 'Teclados',
      descripcion: 'TKL y keycaps premium.'
    },
    {
      id: 12,
      nombre: 'Teclado ATK Rosado',
      precio: 75990,
      imagen: '/img/productos/tecladoatk_rosado1.png',
      categoria: 'Teclados',
      descripcion: 'Layout cómodo.'
    }
  ];

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    sort: 'default'
  });
  
  const { addToCart } = useCart();

  // Cargar productos al montar el componente
  useEffect(() => {
    // Simulamos la carga de datos
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      
      // Extraer categorías únicas
      const uniqueCategories = [...new Set(mockProducts.map(product => product.categoria))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    }, 500);
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Aplicar filtros a los productos
  const applyFilters = () => {
    let result = [...products];
    
    // Filtrar por búsqueda
    if (filters.q) {
      const searchTerm = filters.q.toLowerCase();
      result = result.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm) || 
        product.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por categoría
    if (filters.category) {
      result = result.filter(product => product.categoria === filters.category);
    }
    
    // Ordenar productos
    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.precio - b.precio);
        break;
      case 'price_desc':
        result.sort((a, b) => b.precio - a.precio);
        break;
      case 'name_asc':
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name_desc':
        result.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        // Mantener orden por defecto
        break;
    }
    
    setFilteredProducts(result);
  };

  // Manejar agregar al carrito
  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      cantidad: 1
    });
    toast.success(`${product.nombre} agregado al carrito`);
  };

  // Formatear precio en formato moneda
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).replace('CLP', '').trim();
  };

  // Agrupar productos por categoría
  const productsByCategory = {};
  if (filteredProducts.length > 0) {
    filteredProducts.forEach(product => {
      if (!productsByCategory[product.categoria]) {
        productsByCategory[product.categoria] = [];
      }
      productsByCategory[product.categoria].push(product);
    });
  }

  return (
    <div className="app-container bg-dark text-white">
      <Header />
      
      <main className="container py-4">
        <h1 className="titulo-seccion">Productos</h1>
        
        <div className="filtros-container mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Buscar producto"
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="col-md-3">
              <select
                className="form-select bg-dark text-white border-secondary"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3">
              <select
                className="form-select bg-dark text-white border-secondary"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="default">Ordenar por relevancia</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="name_asc">Nombre: A-Z</option>
                <option value="name_desc">Nombre: Z-A</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No se encontraron productos con los filtros seleccionados.
          </div>
        ) : (
          Object.entries(productsByCategory).map(([category, products]) => (
            <div key={category} className="mb-5">
              <h2 className="categoria-titulo mb-4">{category} <span className="badge bg-secondary">{products.length}</span></h2>
              
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {products.map(product => (
                  <div key={product.id} className="col">
                    <div className="card h-100 bg-dark border-secondary">
                      <Link to={`/productos/${product.id}`} className="text-decoration-none">
                        <div className="product-img-container">
                          <img 
                            src={product.imagen || '/img/producto-placeholder.jpg'} 
                            className="card-img-top product-img" 
                            alt={product.nombre} 
                          />
                        </div>
                      </Link>
                      
                      <div className="card-body">
                        <h5 className="card-title text-white">{product.nombre}</h5>
                        <p className="card-text text-info fw-bold">${formatCurrency(product.precio)}</p>
                        <p className="card-text text-secondary small">{product.descripcion}</p>
                      </div>
                      
                      <div className="card-footer bg-dark border-secondary">
                        <button 
                          className="btn btn-info w-100" 
                          onClick={() => handleAddToCart(product)}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
      
      <Footer />
    </div>
  );
};
 
export default Products;