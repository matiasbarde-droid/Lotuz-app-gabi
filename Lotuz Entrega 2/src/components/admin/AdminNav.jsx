import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';

const AdminNav = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/admin">
          <img 
            src="/img/lotuz blanco.png" 
            alt="Lotuz Admin" 
            height="30" 
            className="d-inline-block align-top me-2" 
          />
          Panel de Administración
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/admin" 
              active={location.pathname === '/admin'}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/productos" 
              active={location.pathname === '/admin/productos'}
            >
              Productos
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/ordenes" 
              active={location.pathname === '/admin/ordenes'}
            >
              Órdenes
            </Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNav;