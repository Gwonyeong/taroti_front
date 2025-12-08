import React, { useState, useEffect } from 'react';
import { getFeaturedContents, updateFeaturedContentClick } from '../../lib/api';

const FeaturedContentGrid = ({ title = "운세 콘텐츠", category = null, limit = 8 }) => {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedContents = async () => {
    try {
      setLoading(true);
      const contents = await getFeaturedContents(true, category);

      if (contents && contents.length > 0) {
        // limit이 있으면 제한
        const limitedContents = limit ? contents.slice(0, limit) : contents;

        const formattedContents = limitedContents.map(content => ({
          id: content.id,
          image: content.imageUrl,
          title: content.title,
          description: content.description,
          link: content.linkUrl || '#',
          category: content.category,
          viewCount: content.viewCount,
          clickCount: content.clickCount
        }));
        setContentItems(formattedContents);
      } else {
        setContentItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch featured contents:', error);
      setContentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = async (contentId, linkUrl) => {
    try {
      // 클릭 수 증가
      await updateFeaturedContentClick(contentId);

      // 내부 페이지로 이동
      if (linkUrl && linkUrl !== '#') {
        // 내부 링크인 경우 React Router의 navigate 사용 또는 window.location 사용
        if (linkUrl.startsWith('/')) {
          window.location.href = linkUrl;
        } else {
          // 외부 링크인 경우 새 탭에서 열기
          window.open(linkUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Failed to update click count:', error);
      // 에러가 발생해도 링크는 열어줌
      if (linkUrl && linkUrl !== '#') {
        if (linkUrl.startsWith('/')) {
          window.location.href = linkUrl;
        } else {
          window.open(linkUrl, '_blank');
        }
      }
    }
  };

  useEffect(() => {
    fetchFeaturedContents();
  }, [category, limit]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-8 lg:py-12">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">콘텐츠를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  if (contentItems.length === 0) {
    return null; // 콘텐츠가 없으면 섹션 자체를 숨김
  }

  return (
    <section className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-8 lg:py-12">
      <h2 className="text-2xl font-bold text-black mb-6 text-left">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {contentItems.map((item) => (
          <article
            key={item.id}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleContentClick(item.id, item.link)}
          >
            <div className="relative w-full" style={{ paddingBottom: '158.33%' }}>
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/characters/webtoon/desert_fox_card_on_hands.jpeg';
                }}
              />
              {item.category && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {item.category}
                </div>
              )}
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-black mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description.length > 50
                  ? `${item.description.substring(0, 50)}...`
                  : item.description}
              </p>
              {(item.viewCount > 0 || item.clickCount > 0) && (
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  {item.viewCount > 0 && <span>조회 {item.viewCount.toLocaleString()}</span>}
                  {item.clickCount > 0 && <span>클릭 {item.clickCount.toLocaleString()}</span>}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedContentGrid;