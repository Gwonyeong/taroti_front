import React, { useState, useEffect } from 'react';

const ContentRecommendations = ({ pageType = "general", limit = 6 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [pageType, limit]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page_type: pageType,
        limit: limit.toString(),
        active: 'true'
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002'}/api/content-recommendations?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } else {
        throw new Error('추천 콘텐츠를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (recommendation) => {
    try {
      // 클릭 카운트 증가 - recommendationId 또는 id 사용
      const trackingId = recommendation.recommendationId || recommendation.id;
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002'}/api/content-recommendations/${trackingId}/click`,
        { method: 'POST' }
      );
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    // 링크 열기
    if (recommendation.linkUrl.startsWith('/')) {
      // 내부 링크
      window.location.href = recommendation.linkUrl;
    } else {
      // 외부 링크
      window.open(recommendation.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleItemView = async (recommendation) => {
    try {
      // 조회수 증가 (화면에 보일 때) - recommendationId 또는 id 사용
      const trackingId = recommendation.recommendationId || recommendation.id;
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002'}/api/content-recommendations/${trackingId}/view`,
        { method: 'POST' }
      );
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">추천 콘텐츠를 불러오는 중...</div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null; // 에러가 있거나 추천할 콘텐츠가 없으면 섹션을 표시하지 않음
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">
          ✨ 이런 콘텐츠도 있어요!
        </h3>
        <p className="text-gray-600 text-sm mb-4">더 많은 재미있는 콘텐츠를 확인해보세요</p>

        {/* 소셜 미디어 링크 */}
        <div className="flex justify-center items-center space-x-4">
          {/* 카카오톡 채널 */}
          <a
            href="http://pf.kakao.com/_sskYn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184-1.061 0-2.078-.121-3.033-.347L3.5 21.5l2.418-4.345C4.533 16.294 3.5 14.39 3.5 12.185 3.5 7.664 8.201 4 14 4h-2zm0 1.5c-4.963 0-9 2.686-9 6.685 0 1.9.8 3.686 2.186 5.071l-.636 2.314 2.636-.814c1.035.4 2.199.614 3.414.614 4.963 0 9-2.686 9-6.685S16.963 5.5 12 5.5z"/>
              </svg>
            </div>
            <span>카카오톡 채널</span>
          </a>

          {/* 인스타그램 */}
          <a
            href="https://www.instagram.com/taroti_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span>인스타그램</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {recommendations.map((recommendation) => (
          <article
            key={recommendation.id}
            className=""
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(recommendation);
              }}
              onMouseEnter={() => handleItemView(recommendation)}
              className="block group"
            >
              <div className="relative w-full" style={{ paddingBottom: '158.33%' }}>
                <img
                  src={recommendation.imageUrl}
                  alt={recommendation.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src = '/images/characters/webtoon/desert_fox_card_on_hands.jpeg';
                  }}
                />
                {recommendation.category && recommendation.category !== 'general' && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
                    {recommendation.category}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <h4 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors duration-200">
                  {recommendation.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed truncate">
                  {recommendation.description || '흥미로운 콘텐츠를 확인해보세요'}
                </p>
              </div>
            </a>
          </article>
        ))}
      </div>

    </div>
  );
};

export default ContentRecommendations;