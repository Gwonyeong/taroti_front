import React from "react";

const WebtoonPanel = ({
  backgroundImage,
  backgroundColor = "bg-white",
  characters = [],
  speechBubbles = [],
  soundEffects = [], // 효과음 텍스트 배열
  panelHeight = "h-64",
  className = "",
  borderStyle = "border-2 border-gray-300 rounded-lg",
  fitImage = false, // 이미지에 맞춰 높이 조정할지 여부
  allowOverflow = true, // 말풍선이 이미지 경계를 넘을 수 있는지 여부
  borderRadius = "rounded-lg", // 패널의 테두리 radius 조정
}) => {
  // 배경 이미지가 있으면 보더와 배경색 제거
  const finalBackgroundColor = backgroundImage ? "" : backgroundColor;
  const finalBorderStyle = backgroundImage ? "" : borderStyle;

  // 이미지 맞춤 모드일 때는 높이를 auto로 설정
  const finalPanelHeight = backgroundImage && fitImage ? "h-auto" : panelHeight;

  if (backgroundImage && fitImage) {
    // 이미지 맞춤 모드: 이미지 비율에 맞춘 레이아웃
    return (
      <div
        className={`relative ${
          allowOverflow ? "overflow-visible" : "overflow-hidden"
        } ${borderRadius} ${className}`}
        style={{ padding: allowOverflow ? "20px" : "0" }}
      >
        <div className={`relative flex justify-center overflow-hidden ${borderRadius}`}>
          <img
            src={backgroundImage}
            alt="Background"
            className={`w-full h-auto object-contain min-h-[400px] sm:min-h-[500px] mx-auto ${borderRadius}`}
          />

          {/* Overlay container for characters and speech bubbles */}
          <div className="absolute inset-0">
            {/* Characters */}
            {characters.map((character, index) => (
              <div
                key={index}
                className={`absolute ${
                  character.position || "bottom-0 left-0"
                }`}
                style={{
                  transform: character.transform || "",
                  zIndex: character.zIndex || 1,
                }}
              >
                <img
                  src={character.image}
                  alt={character.name || `Character ${index + 1}`}
                  className={
                    character.className || "h-32 w-auto object-contain"
                  }
                  style={character.style || {}}
                />
              </div>
            ))}

            {/* Speech Bubbles */}
            {speechBubbles.map((bubble, index) => (
              <div
                key={index}
                className={`absolute ${bubble.position || "top-4 left-4"}`}
                style={{
                  zIndex: bubble.zIndex || 10,
                  maxWidth: bubble.maxWidth || "60%",
                }}
              >
                <div
                  className={`
                    ${bubble.bubbleStyle || "bg-white border-2 border-gray-800"}
                    ${bubble.tailStyle || "relative"}
                    p-8 shadow-lg
                    rounded-full
                  `}
                  style={{
                    borderRadius: "50px",
                    ...bubble.customStyle,
                  }}
                >
                  {/* Speech bubble tail - 삼각형 tail */}
                  {bubble.showTail !== false && (
                    <div
                      className={`
                      absolute w-0 h-0
                      ${
                        bubble.tailPosition === "bottom"
                          ? "border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white bottom-[-11px] left-1/2 transform -translate-x-1/2"
                          : bubble.tailPosition === "top"
                          ? "border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white top-[-11px] left-1/2 transform -translate-x-1/2"
                          : bubble.tailPosition === "right"
                          ? "border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white right-[-9px] top-1/2 transform -translate-y-1/2"
                          : bubble.tailPosition === "left"
                          ? "border-t-[6px] border-b-[6px] border-r-[10px] border-t-transparent border-b-transparent border-r-white left-[-9px] top-1/2 transform -translate-y-1/2"
                          : "border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white top-[-11px] left-1/2 transform -translate-x-1/2"
                      }
                    `}
                    />
                  )}

                  {/* Bubble content */}
                  <div
                    className={`${
                      bubble.textStyle || "text-sm text-gray-800 font-medium"
                    } break-keep`}
                    style={{ wordBreak: 'keep-all' }}
                  >
                    {typeof bubble.content === "string" ? (
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

            {/* Sound Effects */}
            {soundEffects.map((effect, index) => (
              <div
                key={index}
                className={`absolute ${effect.position || "top-1/2 left-1/2"}`}
                style={{
                  zIndex: effect.zIndex || 15,
                  transform: `translate(-50%, -50%) rotate(${effect.rotation || 0}deg) ${effect.transform || ""}`,
                  ...effect.customStyle,
                }}
              >
                <div
                  className={
                    effect.textStyle || "text-6xl font-black text-white"
                  }
                  style={{
                    fontFamily: "'WebtoonSound', sans-serif",
                    textShadow: effect.textShadow || "2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000",
                    WebkitTextStroke: effect.stroke || "2px #000",
                    ...effect.textCustomStyle,
                  }}
                >
                  {effect.content}
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
      className={`${finalPanelHeight} ${finalBackgroundColor} ${finalBorderStyle} relative ${
        allowOverflow ? "overflow-visible" : "overflow-hidden"
      } ${className}`}
      style={{ padding: allowOverflow ? "20px" : "0" }}
    >
      {/* Background Image - 전체 채우기 */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Background"
          className={`absolute inset-0 w-full h-full object-cover ${borderRadius}`}
        />
      )}

      {/* Characters */}
      {characters.map((character, index) => (
        <div
          key={index}
          className={`absolute ${character.position || "bottom-0 left-0"}`}
          style={{
            transform: character.transform || "",
            zIndex: character.zIndex || 1,
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
          className={`absolute ${bubble.position || "top-4 left-4"}`}
          style={{
            zIndex: bubble.zIndex || 10,
            maxWidth: bubble.maxWidth || "60%",
          }}
        >
          <div
            className={`
              ${bubble.bubbleStyle || "bg-white border-2 border-gray-800"}
              ${bubble.tailStyle || "relative"}
              p-8 shadow-lg
              rounded-full
            `}
            style={{
              borderRadius: "50px",
              ...bubble.customStyle,
            }}
          >
            {/* Speech bubble tail - 삼각형 tail */}
            {bubble.showTail !== false && (
              <div
                className={`
                absolute w-0 h-0
                ${
                  bubble.tailPosition === "bottom"
                    ? "border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white bottom-[-11px] left-1/2 transform -translate-x-1/2"
                    : bubble.tailPosition === "top"
                    ? "border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white top-[-11px] left-1/2 transform -translate-x-1/2"
                    : bubble.tailPosition === "right"
                    ? "border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white right-[-9px] top-1/2 transform -translate-y-1/2"
                    : bubble.tailPosition === "left"
                    ? "border-t-[6px] border-b-[6px] border-r-[10px] border-t-transparent border-b-transparent border-r-white left-[-9px] top-1/2 transform -translate-y-1/2"
                    : "border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white top-[-11px] left-1/2 transform -translate-x-1/2"
                }
              `}
              />
            )}

            {/* Bubble content */}
            <div
              className={`${
                bubble.textStyle || "text-sm text-gray-800 font-medium"
              } break-keep`}
              style={{ wordBreak: 'keep-all' }}
            >
              {typeof bubble.content === "string" ? (
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

      {/* Sound Effects */}
      {soundEffects.map((effect, index) => (
        <div
          key={index}
          className={`absolute ${effect.position || "top-1/2 left-1/2"}`}
          style={{
            zIndex: effect.zIndex || 15,
            transform: `translate(-50%, -50%) rotate(${effect.rotation || 0}deg) ${effect.transform || ""}`,
            ...effect.customStyle,
          }}
        >
          <div
            className={
              effect.textStyle || "text-6xl font-black text-white"
            }
            style={{
              fontFamily: "'WebtoonSound', sans-serif",
              textShadow: effect.textShadow || "2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000",
              WebkitTextStroke: effect.stroke || "2px #000",
              ...effect.textCustomStyle,
            }}
          >
            {effect.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WebtoonPanel;
