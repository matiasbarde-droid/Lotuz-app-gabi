import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';

const Header = () => {
  // Obtener el contexto del carrito para mostrar la cantidad de items
  const { cartItems } = useContext(CartContext) || { cartItems: [] };
  
  return (
    <header className="top-bar">
      <div className="logo-container">
        <Link to="/">
          <img src="/img/logo_lotus1.png" alt="Logo de Lotuz" />
        </Link>
      </div>
      <nav className="nav-menu">
        <ul>
          <li><NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Inicio</NavLink></li>
          <li><NavLink to="/perfil" className={({isActive}) => isActive ? "active" : ""}>Perfil</NavLink></li>
          <li>
            <NavLink to="/carrito" className={({isActive}) => isActive ? "active" : ""}>
              Carrito <span id="cartCount">{cartItems.length > 0 ? cartItems.length : ''}</span>
            </NavLink>
          </li>
          <li><NavLink to="/productos" className={({isActive}) => isActive ? "active" : ""}>Productos</NavLink></li>
          <li><NavLink to="/nosotros" className={({isActive}) => isActive ? "active" : ""}>Nosotros</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;