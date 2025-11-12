import React from 'react';

const WebtoonPanel = ({
  backgroundImage,
  backgroundColor = "bg-white",
  characters = [],
  speechBubbles = [],
  panelHeight = "h-64",
  className = "",
  borderStyle = "border-2 border-gray-300 rounded-lg",
  fitImage = false, // 이미지에 맞춰 높이 조정할지 여부
  allowOverflow = true // 말풍선이 이미지 경계를 넘을 수 있는지 여부
}) => {
  // 배경 이미지가 있으면 보더와 배경색 제거
  const finalBackgroundColor = backgroundImage ? "" : backgroundColor;
  const finalBorderStyle = backgroundImage ? "" : borderStyle;

  // 이미지 맞춤 모드일 때는 높이를 auto로 설정
  const finalPanelHeight = backgroundImage && fitImage ? "h-auto" : panelHeight;

  if (backgroundImage && fitImage) {
    // 이미지 맞춤 모드: 이미지 비율에 맞춘 레이아웃
    return (
      <div className={`relative ${allowOverflow ? 'overflow-visible' : 'overflow-hidden'} ${className}`} style={{ padding: allowOverflow ? '20px' : '0' }}>
        <div className="relative flex justify-center">
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-auto object-contain min-h-[400px] sm:min-h-[500px] mx-auto"
          />

          {/* Overlay container for characters and speech bubbles */}
          <div className="absolute inset-0">
            {/* Characters */}
            {characters.map((character, index) => (
              <div
                key={index}
                className={`absolute ${character.position || 'bottom-0 left-0'}`}
                style={{
                  transform: character.transform || '',
                  zIndex: character.zIndex || 1
                }}
              >
                <img
                  src={character.image}
                  alt={character.name || `Character ${index + 1}`}
                  className={character.className || "h-32 w-auto object-contain"}
                  style={character.style || {}}
                />
              </div>
            ))}

            {/* Speech Bubbles */}
            {speechBubbles.map((bubble, index) => (
              <div
                key={index}
                className={`absolute ${bubble.position || 'top-4 left-4'}`}
                style={{
                  zIndex: bubble.zIndex || 10,
                  maxWidth: bubble.maxWidth || '60%'
                }}
              >
                <div
                  className={`
                    ${bubble.bubbleStyle || 'bg-white border-2 border-gray-800'}
                    ${bubble.tailStyle || 'relative'}
                    px-4 py-3 shadow-lg
                    rounded-full
                  `}
                  style={{
                    borderRadius: '50px',
                    ...bubble.customStyle
                  }}
                >
                  {/* Speech bubble tail */}
                  {bubble.showTail !== false && (
                    <div className={`
                      absolute w-0 h-0
                      ${bubble.tailPosition === 'bottom'
                        ? 'border-l-[10px] border-r-[10px] border-t-[15px] border-l-transparent border-r-transparent border-t-white bottom-[-13px] left-6'
                        : bubble.tailPosition === 'right'
                        ? 'border-t-[10px] border-b-[10px] border-l-[15px] border-t-transparent border-b-transparent border-l-white right-[-13px] top-4'
                        : bubble.tailPosition === 'left'
                        ? 'border-t-[10px] border-b-[10px] border-r-[15px] border-t-transparent border-b-transparent border-r-white left-[-13px] top-4'
                        : 'border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-white top-[-13px] left-6'
                      }
                    `} />
                  )}

                  {/* Bubble content */}
                  <div className={bubble.textStyle || "text-sm text-gray-800 font-medium"}>
                    {typeof bubble.content === 'string' ? (
                      <p className="whitespace-pre-line">{bubble.content}</p>
                    ) : (
                      bubble.content
                    )}
                  </div>

                  {/* Character name */}
                  {bubble.characterName && (
                    <div className="text-xs text-gray-500 mt-1 font-bold">
                      - {bubble.characterName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 기본 모드: 고정 높이 레이아웃
  return (
    <div
      className={`${finalPanelHeight} ${finalBackgroundColor} ${finalBorderStyle} relative ${allowOverflow ? 'overflow-visible' : 'overflow-hidden'} ${className}`}
      style={{ padding: allowOverflow ? '20px' : '0' }}
    >
      {/* Background Image - 전체 채우기 */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Characters */}
      {characters.map((character, index) => (
        <div
          key={index}
          className={`absolute ${character.position || 'bottom-0 left-0'}`}
          style={{
            transform: character.transform || '',
            zIndex: character.zIndex || 1
          }}
        >
          <img
            src={character.image}
            alt={character.name || `Character ${index + 1}`}
            className={character.className || "h-32 w-auto object-contain"}
            style={character.style || {}}
          />
        </div>
      ))}

      {/* Speech Bubbles */}
      {speechBubbles.map((bubble, index) => (
        <div
          key={index}
          className={`absolute ${bubble.position || 'top-4 left-4'}`}
          style={{
            zIndex: bubble.zIndex || 10,
            maxWidth: bubble.maxWidth || '60%'
          }}
        >
          <div
            className={`
              ${bubble.bubbleStyle || 'bg-white border-2 border-gray-800'}
              ${bubble.tailStyle || 'relative'}
              px-4 py-3 shadow-lg
              rounded-full
            `}
            style={{
              borderRadius: '50px',
              ...bubble.customStyle
            }}
          >
            {/* Speech bubble tail */}
            {bubble.showTail !== false && (
              <div className={`
                absolute w-0 h-0
                ${bubble.tailPosition === 'bottom'
                  ? 'border-l-[10px] border-r-[10px] border-t-[15px] border-l-transparent border-r-transparent border-t-white bottom-[-13px] left-6'
                  : bubble.tailPosition === 'right'
                  ? 'border-t-[10px] border-b-[10px] border-l-[15px] border-t-transparent border-b-transparent border-l-white right-[-13px] top-4'
                  : bubble.tailPosition === 'left'
                  ? 'border-t-[10px] border-b-[10px] border-r-[15px] border-t-transparent border-b-transparent border-r-white left-[-13px] top-4'
                  : 'border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-white top-[-13px] left-6'
                }
              `} />
            )}

            {/* Bubble content */}
            <div className={bubble.textStyle || "text-sm text-gray-800 font-medium"}>
              {typeof bubble.content === 'string' ? (
                <p className="whitespace-pre-line">{bubble.content}</p>
              ) : (
                bubble.content
              )}
            </div>

            {/* Character name */}
            {bubble.characterName && (
              <div className="text-xs text-gray-500 mt-1 font-bold">
                - {bubble.characterName}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Additional overlays or effects */}
      {/* You can add sound effects, motion lines, etc. here */}
    </div>
  );
};

export default WebtoonPanel;