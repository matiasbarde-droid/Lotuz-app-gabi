import React from 'react';

const LogoCarousel = () => {
  const brands = [
    { id: 1, name: 'Artisan', image: '/img/artisan_logo1.png' },
    { id: 2, name: 'HyperX', image: '/img/hyperx_logo.png' },
    { id: 3, name: 'Logitech', image: '/img/logitech_logo1.png' },
    { id: 4, name: 'ATK', image: '/img/atk_logo1.png' },
    { id: 5, name: 'Razer', image: '/img/Logo_Razer_2017.png' },
    { id: 6, name: 'Pulsar', image: '/img/pulsar_logo1.png' },
    { id: 7, name: 'Xraypad', image: '/img/xraypad_logo.png' }
  ];

  return (
    <section className="logo-carousel-section">
      <img src="/img/nuestras_marcas.png" alt="Nuestras Marcas" style={{ width: '250px', marginBottom: '30px' }} />
      <div className="logo-carousel-container">
        <div className="logo-carousel-track">
          {brands.map(brand => (
            <img key={brand.id} src={brand.image} alt={`${brand.name} Logo`} />
          ))}
          {/* Duplicamos las marcas para crear el efecto de carrusel infinito */}
          {brands.map(brand => (
            <img key={`dup-${brand.id}`} src={brand.image} alt={`${brand.name} Logo`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;