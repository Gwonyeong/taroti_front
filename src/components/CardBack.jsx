import React from "react";

const CardBack = ({
  centerImage = "/images/characters/card_back.png",
  alt = "카드",
  className = "",
  onClick,
  ...props
}) => {
  return (
    <div
      className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* 외곽 흰색 테두리 */}
      <div className="w-20 h-32 bg-white rounded-lg shadow-md p-1">
        {/* 내부 흰색 테두리 */}
        <div className="w-full h-full bg-white rounded-md p-1">
          {/* 중앙 이미지 영역 */}
          <div className="w-full h-full rounded-sm overflow-hidden relative">
            {centerImage ? (
              <img
                src={centerImage}
                alt={alt}
                className="w-full h-full object-cover"
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