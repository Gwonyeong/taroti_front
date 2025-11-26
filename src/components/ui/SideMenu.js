import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const SideMenu = ({ isOpen, onClose, constrained = false }) => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  // constrained 모드에서 메뉴가 닫혀있으면 렌더링하지 않음
  if (constrained && !isOpen) {
    return null;
  }

  const handleLogin = async () => {
    try {
      await login();
      toast.success('카카오 로그인이 완료되었습니다.');
      onClose();
    } catch (error) {
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃이 완료되었습니다.');
      onClose();
    } catch (error) {
      toast.error('로그아웃에 실패했습니다.');
    }
  };
  return (
    <>
      {/* 딤드 오버레이 */}
      <div
        className={`${constrained ? 'absolute' : 'fixed'} ${constrained ? 'top-0 left-0 right-0 bottom-0' : 'inset-0'} bg-black/50 backdrop-blur-sm ${constrained ? 'z-[110]' : 'z-40'} transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 메뉴 패널 - 슬라이드 */}
      <nav className={`${constrained ? 'absolute' : 'fixed'} ${constrained ? 'top-0' : 'top-0'} right-0 w-64 max-w-[65vw] ${constrained ? 'h-full' : 'h-screen'} ${constrained ? 'z-[120]' : 'z-50'} bg-white shadow-2xl ${constrained ? 'rounded-l-lg' : 'rounded-l-2xl'} transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
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

              {/* 구분선 */}
              <li className="border-t border-gray-200 pt-6">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      {user?.profileImageUrl && (
                        <img
                          src={user.profileImageUrl}
                          alt="프로필"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm text-gray-600">{user?.nickname}님</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="block w-full text-left text-lg text-red-500 hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
                    >
                      {isLoading ? '로그아웃 중...' : '로그아웃'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="flex items-center space-x-2 w-full p-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.5c5.25 0 9.5 4.25 9.5 9.5s-4.25 9.5-9.5 9.5S2.5 17.25 2.5 12 6.75 2.5 12 2.5zm0 1.5c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1.5 6c.83 0 1.5-.67 1.5-1.5S11.33 8.5 10.5 8.5 9 9.17 9 10s.67 1.5 1.5 1.5zm3 0c.83 0 1.5-.67 1.5-1.5S14.33 8.5 13.5 8.5 12 9.17 12 10s.67 1.5 1.5 1.5zm-1.5 6c3 0 5-2 5-5h-10c0 3 2 5 5 5z"/>
                    </svg>
                    <span>{isLoading ? '로그인 중...' : '카카오 로그인'}</span>
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </nav>
    </>
  );
};

export default SideMenu;