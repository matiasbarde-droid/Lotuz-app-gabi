import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Clave para localStorage (misma que usan los archivos JS tradicionales)
  const CART_KEY = 'lotuz:cart';
  const ORDERS_KEY = 'lotuz:orders';

  const saveOrderToStorage = (order) => {
    try {
      const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      existing.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Error al guardar la orden en localStorage:', error);
    }
  };

  // Función para obtener el carrito desde localStorage (compatible con JS tradicional)
  const getCartFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch (error) {
      console.error('Error al cargar el carrito desde localStorage:', error);
      return [];
    }
  };

  // Función para guardar el carrito en localStorage (compatible con JS tradicional)
  const saveCartToStorage = (items) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items || []));
  };

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = getCartFromStorage();
    setCartItems(storedCart);
    setLoading(false);
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!loading) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, loading]);

  // Utilidad para obtener una clave única del producto
  const getProductKey = (product) => {
    return product?.sku ?? product?.id ?? product?.nombre ?? Math.random().toString(36).slice(2);
  };

  // Añadir producto al carrito
  const addToCart = (product, quantity = 1) => {
    console.log("Añadiendo producto al carrito:", product);
    const key = getProductKey(product);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.sku === key);
      
      if (existingItem) {
        // Si el producto ya está en el carrito, actualizar cantidad
        return prevItems.map(item => 
          item.sku === key 
            ? { ...item, cantidad: item.cantidad + quantity } 
            : item
        );
      } else {
        // Si es un producto nuevo, añadirlo al carrito
        const newItem = { 
          sku: key, 
          nombre: product.nombre,
          precio: product.precio,
          imagen: product.fotoUrl || product.imagen || '/img/placeholder.png',
          cantidad: quantity 
        };
        console.log("Nuevo item añadido:", newItem);
        return [...prevItems, newItem];
      }
    });
  };

  // Alias para compatibilidad con componentes que usan addItem
  const addItem = addToCart;

  // Remover producto del carrito
  const removeFromCart = (sku) => {
    setCartItems(prevItems => prevItems.filter(item => item.sku !== sku));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.sku === sku ? { ...item, cantidad: quantity } : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total del carrito
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Obtener cantidad total de items
  const getCartItemsCount = () => {
    // Asegurarse de que cada item tenga una cantidad válida
    return cartItems.reduce((count, item) => count + (parseInt(item.cantidad) || 0), 0);
  };

  // Procesar checkout
  const checkout = async (userData) => {
    try {
      // Preparar datos para el API
      const checkoutData = {
        usuarioId: userData?.id || null,
        emailInvitado: userData?.id ? null : userData.email,
        items: cartItems.map(item => ({
          sku: item.sku,
          cantidad: item.cantidad
        }))
      };

      // Enviar solicitud al API
      const response = await apiClient.post('/checkout', checkoutData);
      // Limpiar carrito después de checkout exitoso
      clearCart();
      return response.data;
    } catch (error) {
      console.warn('Fallo API checkout, simulando compra local como invitado/usuario:', error);
      // Simulación de orden local si el backend no responde
      const simulatedOrder = {
        id: 'local-' + Date.now(),
        emailCliente: userData?.id ? null : (userData?.email || checkoutData.emailInvitado || ''),
        usuarioId: userData?.id || null,
        modo: userData?.id ? 'REGISTRADO' : 'INVITADO',
        total: getCartTotal(),
        items: cartItems.map(item => ({
          productoSku: item.sku,
          nombreProducto: item.nombre,
          precioUnitario: item.precio,
          cantidad: item.cantidad
        })),
        createdAt: new Date().toISOString(),
        estado: 'SIMULADA'
      };
      saveOrderToStorage(simulatedOrder);
      clearCart();
      return { success: true, simulated: true, order: simulatedOrder };
    }
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    addItem, // compatibilidad
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    checkout,
    // Exponemos las funciones de localStorage para compatibilidad
    getCartFromStorage,
    saveCartToStorage
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;