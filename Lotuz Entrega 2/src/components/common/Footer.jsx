import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <p>© {currentYear} Lotuz. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;