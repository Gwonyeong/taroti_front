import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import PasswordAuth from '../components/admin/PasswordAuth';
import BannerManager from '../components/admin/BannerManager';
import ContentManager from '../components/admin/ContentManager';
import FeaturedContentManager from '../components/admin/FeaturedContentManager';
import RecommendationManager from '../components/admin/RecommendationManager';
import InstagramManager from '../components/admin/InstagramManager';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('banners');

  useEffect(() => {
    // 세션 스토리지에서 인증 상태 확인
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('adminAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return <PasswordAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TaroTI Admin</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              메인페이지
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-white text-black hover:bg-gray-200"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('banners')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'banners'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              배너 관리
            </button>
            <button
              onClick={() => setActiveTab('contents')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'contents'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              베스트 콘텐츠 관리
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'featured'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              운세 콘텐츠
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'recommendations'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              이런 콘텐츠도 있어요!
            </button>
            <button
              onClick={() => setActiveTab('instagram')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'instagram'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              Instagram 마케팅
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'banners' && <BannerManager />}
        {activeTab === 'contents' && <ContentManager />}
        {activeTab === 'featured' && <FeaturedContentManager />}
        {activeTab === 'recommendations' && <RecommendationManager />}
        {activeTab === 'instagram' && <InstagramManager />}
      </div>
    </div>
  );
};

export default Admin;