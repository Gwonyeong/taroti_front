import React from 'react';

const ContentGrid = () => {
  const contentItems = [
    {
      id: 1,
      image: '/images/characters/webtoon/desert_fox_card_on_hands.jpeg',
      title: '타로 연애 운세',
      description: '당신의 연애 운세를 타로카드로 알아보세요. MBTI와 결합한 개인 맞춤형 해석을 제공합니다.',
      link: '/service/love-tarot'
    },
    {
      id: 2,
      image: '/images/characters/webtoon/desert_fox_taro.png',
      title: 'MBTI 궁합 분석',
      description: 'MBTI 기반으로 당신과 상대방의 궁합을 분석하고, 관계 발전 방향을 제시해드립니다.',
      link: '/service/mbti-compatibility'
    },
    {
      id: 3,
      image: '/images/characters/webtoon/desert_fox_watching_card.jpeg',
      title: '일일 타로 운세',
      description: '매일 새로운 타로카드 해석으로 오늘의 운세와 조언을 받아보세요.',
      link: '/service/daily-tarot'
    },
    {
      id: 4,
      image: '/images/cards/0_THE_FOOL.png',
      title: '성격 유형 분석',
      description: 'MBTI와 타로가 결합된 깊이 있는 성격 분석으로 자신을 더 잘 이해해보세요.',
      link: '/service/personality-analysis'
    },
    {
      id: 5,
      image: '/images/characters/webtoon/desert_fox_light_hands.jpeg',
      title: '연애 조언 상담',
      description: '전문가의 타로와 MBTI 기반 연애 상담으로 관계의 고민을 해결하세요.',
      link: '/service/love-consultation'
    },
    {
      id: 6,
      image: '/images/characters/webtoon/rabbit_watching_desert_fox.png',
      title: '미래 연인 예측',
      description: '타로카드가 알려주는 당신의 미래 연인은 어떤 사람일까요? 지금 확인해보세요.',
      link: '/service/future-love'
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-8">
        {contentItems.map((item) => (
          <article
            key={item.id}
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
            <a href={item.link} className="block">
              <div className="relative w-full" style={{ paddingBottom: '158.33%' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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