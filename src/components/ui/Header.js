import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick, className = "absolute top-0 left-0 right-0 z-50", style = {} }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className={className} style={style}>
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <img
            src="/logo.png"
            alt="TaroTI"
            className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleLogoClick}
          />

          <button
            onClick={onMenuClick}
            className="flex flex-col gap-1 p-2 rounded-md transition-colors duration-200"
            aria-label="메뉴 열기"
          >
            <span className="w-6 h-0.5 bg-black transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-black transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-black transition-all duration-300"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;