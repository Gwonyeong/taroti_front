import React from 'react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <img
            src="/logo.png"
            alt="TaroTI"
            className="h-10 w-auto"
          />

          <button
            onClick={onMenuClick}
            className="flex flex-col gap-1 p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
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