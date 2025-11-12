import React from 'react';
import WebtoonPanel from './WebtoonPanel';

const WebtoonStory = ({
  story = [],
  className = "space-y-4"
}) => {
  return (
    <div className={className}>
      {story.map((panel, index) => (
        <WebtoonPanel
          key={index}
          {...panel}
        />
      ))}
    </div>
  );
};

// 사용 예시를 위한 샘플 스토리 컴포넌트
export const SampleWebtoonStory = () => {
  const sampleStory = [
    {
      panelHeight: "h-48",
      backgroundColor: "bg-blue-50",
      characters: [
        {
          image: "/images/characters/carot.png",
          position: "bottom-4 right-8",
          className: "h-24 w-auto object-contain",
          name: "캐럿"
        }
      ],
      speechBubbles: [
        {
          content: "안녕하세요! 타로 결과를\n알려드릴게요!",
          position: "top-4 left-4",
          characterName: "캐럿",
          bubbleStyle: "bg-yellow-100 border-2 border-orange-400",
          tailPosition: "bottom"
        }
      ]
    },
    {
      panelHeight: "h-56",
      backgroundColor: "bg-purple-50",
      characters: [
        {
          image: "/images/characters/carot.png",
          position: "bottom-4 left-8",
          className: "h-28 w-auto object-contain",
          name: "캐럿"
        }
      ],
      speechBubbles: [
        {
          content: "당신의 성격 유형은\n정말 특별해요!",
          position: "top-4 right-4",
          bubbleStyle: "bg-white border-2 border-purple-400",
          tailPosition: "left",
          maxWidth: "50%"
        }
      ]
    }
  ];

  return <WebtoonStory story={sampleStory} />;
};

export default WebtoonStory;