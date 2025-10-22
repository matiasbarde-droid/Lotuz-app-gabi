import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaHandshake, FaLaptop, FaHeadset } from 'react-icons/fa';

const About = () => {
  return (
    <Container className="py-5">
      {/* Sección de Misión */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Nuestra Misión</h2>
          <div className="p-4 bg-light rounded">
            <p className="lead text-center">
              En Lotuz Gaming, nos dedicamos a proporcionar a los gamers productos de alta calidad que mejoren su experiencia de juego.
              Creemos en la importancia de ofrecer periféricos que no solo sean funcionales, sino que también sean duraderos y estéticamente atractivos.
            </p>
            <p className="text-center">
              Nuestro objetivo es convertirnos en el referente nacional en la distribución de periféricos gaming, ofreciendo siempre las últimas novedades
              y las marcas más reconocidas del mercado a precios competitivos.
            </p>
          </div>
        </Col>
      </Row>

      {/* Sección de Valores */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Valores</h2>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <div className="mb-3">
                    <FaUsers size={40} className="text-primary" />
                  </div>
                  <Card.Title>Comunidad</Card.Title>
                  <Card.Text>
                    Construimos una comunidad sólida de gamers que comparten nuestra pasión por los videojuegos y la tecnología.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <div className="mb-3">
                    <FaHandshake size={40} className="text-primary" />
                  </div>
                  <Card.Title>Confianza</Card.Title>
                  <Card.Text>
                    Generamos relaciones de confianza con nuestros clientes, ofreciendo productos de calidad y un servicio excepcional.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <div className="mb-3">
                    <FaLaptop size={40} className="text-primary" />
                  </div>
                  <Card.Title>Innovación</Card.Title>
                  <Card.Text>
                    Nos mantenemos a la vanguardia de las últimas tendencias y tecnologías en el mundo gaming.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <div className="mb-3">
                    <FaHeadset size={40} className="text-primary" />
                  </div>
                  <Card.Title>Servicio</Card.Title>
                  <Card.Text>
                    Brindamos una atención personalizada y un soporte técnico de calidad para resolver cualquier duda o problema.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Sección de Ubicación */}
      <Row>
        <Col>
          <h2 className="text-center mb-4">Dónde Encontrarnos</h2>
          <Row>
            <Col md={6} className="mb-4">
              <div className="p-4 bg-light rounded h-100">
                <h4>Tienda Física</h4>
                <p>
                  <strong>Dirección:</strong> Av. Providencia 1234, Santiago<br />
                  <strong>Horario:</strong> Lunes a Viernes de 10:00 a 19:00 hrs<br />
                  <strong>Teléfono:</strong> +56 9 1234 5678<br />
                  <strong>Email:</strong> contacto@lotuzgaming.cl
                </p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="p-4 bg-light rounded h-100">
                <h4>Redes Sociales</h4>
                <p>
                  Síguenos en nuestras redes sociales para estar al tanto de nuestras novedades, promociones y eventos especiales.
                </p>
                <div className="d-flex justify-content-around">
                  <a href="https://instagram.com/lotuzgaming" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    <i className="bi bi-instagram fs-3"></i>
                  </a>
                  <a href="https://facebook.com/lotuzgaming" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    <i className="bi bi-facebook fs-3"></i>
                  </a>
                  <a href="https://twitter.com/lotuzgaming" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    <i className="bi bi-twitter fs-3"></i>
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default About;