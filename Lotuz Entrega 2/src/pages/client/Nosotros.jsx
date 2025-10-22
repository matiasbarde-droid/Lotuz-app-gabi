import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const Nosotros = () => {
  return (
    <div className="app-container bg-dark text-white">
      <Header />
      
      <main className="container py-4">
        <div className="hero-nosotros">
          <img src="/img/lotuz blanco.png" alt="Logo Lotuz" />
          <div className="divider"></div>
          <p className="tagline">Periféricos seleccionados por calidad real de uso.</p>
        </div>
        
        <section className="about-card bg-dark text-white border border-secondary rounded mt-4">
          <h2>¿Quiénes somos?</h2>
          <p>
            Lotuz es una tienda chilena especializada en periféricos gamer y de escritorio. Nuestro propósito es ayudarte a armar un setup cómodo, bonito y rentable, sin pagar de más. Seleccionamos productos por calidad real de uso: mouse, mousepads, teclados y audífonos.
          </p>
        </section>
        
        <section className="about-card bg-dark text-white border border-secondary rounded mt-4">
          <h2>Qué ofrecemos</h2>
          <ul className="about-list">
            <li>Catálogo curado con marcas reconocidas y modelos probados.</li>
            <li>Precios en CLP y stock actualizado.</li>
            <li>Asesoría rápida por correo para elegir tu próximo periférico.</li>
          </ul>
        </section>
        
        <section className="about-card bg-dark text-white border border-secondary rounded mt-4">
          <h2>Nuestros compromisos</h2>
          <ul className="about-list">
            <li><strong>Transparencia:</strong> Información clara de precios y características.</li>
            <li><strong>Garantía legal:</strong> 6 meses según normativa chilena vigente.</li>
            <li><strong>Despacho a todo Chile:</strong> mediante couriers nacionales.</li>
            <li><strong>Soporte postventa:</strong> te acompañamos en consultas o garantías.</li>
          </ul>
        </section>
        
        <section className="about-card bg-dark text-white border border-secondary rounded mt-4">
          <h2>Contacto</h2>
          <p>
            ¿Dudas o necesitas una recomendación? Escríbenos a <a href="mailto:info@lotuz.cl" className="text-info">info@lotuz.cl</a>.
          </p>
          <div className="text-center mt-3">
            <a href="/productos" className="btn btn-info">Ver catálogo</a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Nosotros;