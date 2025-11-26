import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import SideMenu from './SideMenu';

const Navigation = ({ fixed = false, className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

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

  // 스크롤 방향에 따른 네비게이션 표시/숨김 (fixed일 때만)
  useEffect(() => {
    if (!fixed) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // 메뉴가 열려있을 때는 네비게이션 숨기지 않음
          if (isMenuOpen) {
            setIsNavVisible(true);
          }
          // 스크롤을 아래로 내릴 때 (스크롤 값이 증가)
          else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsNavVisible(false);
          }
          // 스크롤을 위로 올릴 때 (스크롤 값이 감소)
          else if (currentScrollY < lastScrollY.current) {
            setIsNavVisible(true);
          }
          // 맨 위에 있을 때는 항상 표시
          else if (currentScrollY <= 50) {
            setIsNavVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fixed, isMenuOpen]);

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

  // Fixed 네비게이션의 경우 다른 스타일 적용
  const headerProps = fixed ? {
    onMenuClick: toggleMenu,
    className: `fixed top-0 z-[100] bg-white shadow-sm transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-50' : 'opacity-100'}`,
    style: {
      left: '50%',
      transform: `translateX(-50%) translateY(${isNavVisible ? '0' : '-100%'})`,
      width: '100%',
      minWidth: '320px',
      maxWidth: '500px'
    }
  } : {
    onMenuClick: toggleMenu
  };

  return (
    <>
      <div className={className}>
        <Header {...headerProps} />
        {fixed && (
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full min-w-[320px] max-w-[500px] h-screen z-[105] pointer-events-none">
            <div className="relative w-full h-full">
              <SideMenu isOpen={isMenuOpen} onClose={closeMenu} constrained={true} />
            </div>
          </div>
        )}
        {!fixed && (
          <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
        )}
      </div>
    </>
  );
};

export default Navigation;