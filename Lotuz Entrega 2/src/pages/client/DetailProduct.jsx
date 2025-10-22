import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import apiClient from '../../api/apiClient';

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/productos/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('No se pudo cargar la información del producto. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.nombre} agregado al carrito`);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-primary" onClick={() => navigate('/productos')}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Producto no encontrado</Alert>
        <Button variant="outline-primary" onClick={() => navigate('/productos')}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={6} className="mb-4">
          <div className="product-image-container">
            <img 
              src={product.imagen ? `/img/productos/${product.imagen}` : '/img/productos/default.jpg'} 
              alt={product.nombre} 
              className="img-fluid rounded"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        </Col>
        <Col md={6}>
          <h2 className="mb-3">{product.nombre}</h2>
          
          <div className="mb-3">
            <span className="fs-4 fw-bold text-primary">${product.precio.toLocaleString('es-CL')}</span>
            {product.descuento > 0 && (
              <span className="ms-3 text-decoration-line-through text-muted">
                ${(product.precio / (1 - product.descuento / 100)).toLocaleString('es-CL')}
              </span>
            )}
          </div>
          
          <div className="mb-3">
            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stock > 0 ? 'En Stock' : 'Agotado'}
            </span>
            {product.stock > 0 && (
              <span className="ms-2 text-muted">
                ({product.stock} unidades disponibles)
              </span>
            )}
          </div>
          
          <div className="mb-4">
            <h5>Descripción:</h5>
            <p>{product.descripcion}</p>
          </div>
          
          {product.stock > 0 && (
            <>
              <div className="d-flex align-items-center mb-4">
                <span className="me-3">Cantidad:</span>
                <div className="input-group" style={{ maxWidth: '150px' }}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-100"
              >
                Agregar al Carrito
              </Button>
            </>
          )}
          
          <div className="mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/productos')}
              className="me-2"
            >
              Volver al Catálogo
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailProduct;