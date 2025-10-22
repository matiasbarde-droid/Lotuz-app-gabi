import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ImageGallery from '../../components/client/ImageGallery';
import LogoCarousel from '../../components/client/LogoCarousel';

const Home = () => {
  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <ImageGallery />
        <LogoCarousel />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;