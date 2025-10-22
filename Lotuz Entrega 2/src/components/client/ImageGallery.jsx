import React from 'react';
import { Link } from 'react-router-dom';

const ImageGallery = () => {
  const categories = [
    { id: 1, name: 'Mousepad', image: '/img/mousepad_main.png', link: '/productos?categoria=mousepad' },
    { id: 2, name: 'Mouse', image: '/img/mouse_main.png', link: '/productos?categoria=mouse' },
    { id: 3, name: 'Audífonos', image: '/img/audifonos_main.png', link: '/productos?categoria=audifonos' },
    { id: 4, name: 'Teclados', image: '/img/teclado_main.png', link: '/productos?categoria=teclados' }
  ];

  return (
    <div className="image-gallery">
      {categories.map(category => (
        <div key={category.id} className="card">
          <Link to={category.link} className="no-link">
            <img src={category.image} alt={category.name} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;