import React, { useState, useEffect } from 'react';
import Header from '../components/ui/Header';
import SideMenu from '../components/ui/SideMenu';
import BannerSlider from '../components/ui/BannerSlider';
import ContentGrid from '../components/ui/ContentGrid';
import FeaturedContentGrid from '../components/ui/FeaturedContentGrid';
import Footer from '../components/ui/Footer';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-[1920px] mx-auto">
        <Header onMenuClick={toggleMenu} />
        <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
        <BannerSlider />
        <ContentGrid />
        <FeaturedContentGrid title="운세 콘텐츠" limit={8} />
        <Footer />
      </div>
    </div>
  );
};

export default Home;