import React from 'react';
import { Link } from 'react-router-dom';

const SideMenu = ({ isOpen, onClose }) => {
  return (
    <nav className={`fixed top-0 right-0 w-full h-screen z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div
        className="absolute w-full h-full bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="absolute right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl text-black hover:text-gray-600 transition-colors duration-200"
            aria-label="메뉴 닫기"
          >
            ×
          </button>

          <nav className="mt-16">
            <ul className="space-y-6">
              <li>
                <Link
                  to="/home"
                  className="block text-lg text-black hover:text-gray-600 transition-colors duration-200"
                  onClick={onClose}
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block text-lg text-black hover:text-gray-600 transition-colors duration-200"
                  onClick={onClose}
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="block text-lg text-black hover:text-gray-600 transition-colors duration-200"
                  onClick={onClose}
                >
                  서비스
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block text-lg text-black hover:text-gray-600 transition-colors duration-200"
                  onClick={onClose}
                >
                  문의
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default SideMenu;