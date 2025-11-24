import React from 'react';

const ContentGrid = () => {
  const contentItems = [
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
    },
    {
      id: 3,
      image: '/images/characters/webtoon/desert_fox_watching_card.jpeg',
      title: '일일 타로 운세',
      description: '매일 새로운 타로카드로 확인하는 오늘의 운세',
      link: '/service/daily-tarot'
    },
    {
      id: 4,
      image: '/images/cards/0_THE_FOOL.png',
      title: '성격 유형 분석',
      description: 'MBTI와 타로의 융합으로 발견하는 나의 숨은 성격',
      link: '/service/personality-analysis'
    },
    {
      id: 5,
      image: '/images/characters/webtoon/desert_fox_light_hands.jpeg',
      title: '연애 조언 상담',
      description: '전문가의 타로와 MBTI 기반 맞춤형 연애 상담',
      link: '/service/love-consultation'
    },
    {
      id: 6,
      image: '/images/characters/webtoon/rabbit_watching_desert_fox.png',
      title: '미래 연인 예측',
      description: '타로카드가 예측하는 당신의 운명적인 미래 연인',
      link: '/service/future-love'
    }
  ];

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