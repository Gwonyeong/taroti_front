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
        className={`${constrained ? 'absolute' : 'fixed'} ${constrained ? 'top-0 left-0 right-0 bottom-0' : 'inset-0'} bg-black/50 backdrop-blur-sm ${constrained ? 'z-[95]' : 'z-40'} transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      {/* 메뉴 패널 - 슬라이드 */}
      <nav className={`${constrained ? 'absolute' : 'fixed'} ${constrained ? 'top-0' : 'top-0'} right-0 w-64 max-w-[65vw] ${constrained ? 'h-full' : 'h-screen'} ${constrained ? 'z-[96]' : 'z-50'} bg-white shadow-2xl ${constrained ? 'rounded-l-lg' : 'rounded-l-2xl'} transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
      }`}>
        <div className="p-6 pointer-events-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl text-black hover:text-gray-600 transition-colors duration-200"
            aria-label="메뉴 닫기"
          >
            ×
          </button>

          <nav className="mt-16">
            <ul className="space-y-6">
              {/* 로그인 정보 및 프로필 설정 */}
              <li>
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-6">
                      {user?.profileImageUrl && (
                        <img
                          src={user.profileImageUrl}
                          alt="프로필"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <span className="text-lg text-gray-800 font-medium">{user?.nickname}님</span>
                    </div>

                    {/* 마이페이지 메뉴 */}
                    <Link
                      to="/mypage"
                      className="flex items-center space-x-3 w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      onClick={onClose}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>마이페이지</span>
                    </Link>

                    {/* 프로필 설정 메뉴 */}
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      onClick={onClose}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>프로필 설정</span>
                    </Link>

                    {/* 구분선 */}
                    <hr className="border-gray-200 my-4" />

                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="flex items-center space-x-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>{isLoading ? '로그아웃 중...' : '로그아웃'}</span>
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

              {/* 구분선 */}
              <li>
                <hr className="border-gray-200 my-4" />
              </li>

              {/* 소셜 미디어 링크 */}
              <li>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-600 px-3">소셜 미디어</h3>

                  {/* 카카오톡 링크 */}
                  <a
                    href="http://pf.kakao.com/_sskYn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 w-full p-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors duration-200 group"
                  >
                    <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center group-hover:bg-yellow-500 transition-colors duration-200">
                      <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184-1.061 0-2.078-.121-3.033-.347L3.5 21.5l2.418-4.345C4.533 16.294 3.5 14.39 3.5 12.185 3.5 7.664 8.201 4 14 4h-2zm0 1.5c-4.963 0-9 2.686-9 6.685 0 1.9.8 3.686 2.186 5.071l-.636 2.314 2.636-.814c1.035.4 2.199.614 3.414.614 4.963 0 9-2.686 9-6.685S16.963 5.5 12 5.5z"/>
                      </svg>
                    </div>
                    <span>카카오톡 채널</span>
                    <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  {/* 인스타그램 링크 */}
                  <a
                    href="https://www.instagram.com/taroti_official/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 w-full p-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors duration-200 group"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded flex items-center justify-center group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-500 transition-all duration-200">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span>인스타그램</span>
                    <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </nav>
    </>
  );
};

export default SideMenu;