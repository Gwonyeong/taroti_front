import React from "react";

const CardBack = ({
  centerImage = "/images/characters/card_back.png",
  alt = "카드",
  className = "",
  onClick,
  cardNumber,
  isFlipped = false,
  customBackImage,
  ...props
}) => {
  // 카드 앞면 이미지 경로 생성
  const getFrontImage = (number) => {
    if (number === undefined || number === null) return null;

    // 카드 번호를 2자리 문자열로 변환 (0 → "00", 1 → "01")
    const paddedNumber = number.toString().padStart(2, '0');

    // 카드 이름 매핑
    const cardNames = {
      '00': 'TheFool',
      '01': 'TheMagician',
      '02': 'TheHighPriestess',
      '03': 'TheEmpress',
      '04': 'TheEmperor',
      '05': 'TheHierophant',
      '06': 'TheLovers',
      '07': 'TheChariot',
      '08': 'Strength',
      '09': 'TheHermit',
      '10': 'WheelOfFortune',
      '11': 'Justice',
      '12': 'TheHangedMan',
      '13': 'Death',
      '14': 'Temperance',
      '15': 'TheDevil',
      '16': 'TheTower',
      '17': 'TheStar',
      '18': 'TheMoon',
      '19': 'TheSun',
      '20': 'Judgement',
      '21': 'TheWorld'
    };

    const cardName = cardNames[paddedNumber];
    if (!cardName) return null;

    return `/images/cards/${paddedNumber}-${cardName}.jpg`;
  };

  // 표시할 이미지 결정
  const displayImage = isFlipped && cardNumber !== undefined
    ? getFrontImage(cardNumber)
    : (customBackImage || centerImage);
  return (
    <div
      className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* 외곽 흰색 테두리 */}
      <div className="w-32 h-48 bg-white rounded-lg shadow-md p-1">
        {/* 내부 흰색 테두리 */}
        <div className="w-full h-full bg-white rounded-md p-1">
          {/* 중앙 이미지 영역 */}
          <div className="w-full h-full rounded-sm overflow-hidden relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt={alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  // 이미지 로드 실패 시 기본 이미지로 대체
                  e.target.src = customBackImage || centerImage;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">이미지 없음</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBack;