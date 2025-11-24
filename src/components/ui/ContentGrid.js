import React, { useState, useEffect } from 'react';
import { getContents } from '../../lib/api';

const ContentGrid = () => {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // DB에서 콘텐츠 데이터 가져오기
  const fetchContents = async () => {
    try {
      setLoading(true);
      const contents = await getContents(true); // 활성화된 콘텐츠만 가져오기

      if (contents && contents.length > 0) {
        const formattedContents = contents.map(content => ({
          id: content.id,
          image: content.image_url,
          title: content.title,
          description: content.description,
          link: content.link_url || '#'
        }));
        setContentItems(formattedContents);
      } else {
        // 기본 콘텐츠 데이터 (fallback)
        setContentItems([
          {
            id: 1,
            image: '/images/characters/webtoon/desert_fox_card_on_hands.jpeg',
            title: '타로 연애 운세',
            description: '타로카드와 MBTI를 결합한 개인 맞춤형 연애 운세',
            link: '/service/love-tarot'
          },
          {
            id: 2,
            image: '/images/characters/webtoon/desert_fox_taro.png',
            title: 'MBTI 궁합 분석',
            description: 'MBTI 기반 커플 궁합 분석 및 관계 발전 가이드',
            link: '/service/mbti-compatibility'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error);
      // 에러 시 기본 콘텐츠 사용
      setContentItems([
        {
          id: 1,
          image: '/images/characters/webtoon/desert_fox_card_on_hands.jpeg',
          title: '타로 연애 운세',
          description: '타로카드와 MBTI를 결합한 개인 맞춤형 연애 운세',
          link: '/service/love-tarot'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 콘텐츠 데이터 가져오기
  useEffect(() => {
    fetchContents();
  }, []);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-8 lg:py-12">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">콘텐츠를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  if (contentItems.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-8 lg:py-12">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">표시할 콘텐츠가 없습니다</div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-8 lg:py-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {contentItems.map((item) => (
          <article
            key={item.id}
            className=""
          >
            <a href={item.link} className="block">
              <div className="relative w-full" style={{ paddingBottom: '158.33%' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/images/characters/webtoon/desert_fox_card_on_hands.jpeg';
                  }}
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed truncate">
                  {item.description}
                </p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </main>
  );
};

export default ContentGrid;