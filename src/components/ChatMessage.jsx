import React from "react";

const ChatMessage = ({
  message,
  showTypingIndicator = false,
  characterImageSrc = "/images/characters/desert_fox/desert_fox_open_mouse.png",
  characterName = "페넥",
  showCharacterName = true,
  maxWidth = "70%",
  displayImage = null,
  imageAlt = "",
  imageClassName = "w-48 h-48 object-cover rounded-2xl",
}) => {
  // 타이핑 인디케이터 렌더링
  if (showTypingIndicator) {
    return (
      <div className="flex justify-start">
        <div className="flex flex-col items-center mr-3 ">
          <div className="w-10 h-10 bg-white border border-charcoal border-opacity-20 rounded-2xl overflow-hidden">
            <img
              src={characterImageSrc}
              alt={characterName}
              className="w-full h-full object-cover mt-[2px]"
            />
          </div>
          {showCharacterName && (
            <span className="text-xs text-charcoal mt-1">{characterName}</span>
          )}
        </div>
        <div className="bg-gray-100 text-charcoal px-4 py-3 rounded-2xl rounded-bl-none">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-gray-500 rounded-2xl animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-2xl animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-2xl animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // 일반 메시지 렌더링
  if (!message) return null;

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.sender === "bot" && (
        <div className="flex flex-col items-center mr-3 ">
          <div className="w-10 h-10 bg-white border border-charcoal border-opacity-10 rounded-2xl overflow-hidden">
            <img
              src={characterImageSrc}
              alt={characterName}
              className="w-full h-full object-cover mt-[2px]"
            />
          </div>
          {showCharacterName && (
            <span className="text-xs text-charcoal mt-1">{characterName}</span>
          )}
        </div>
      )}

      {displayImage ? (
        <div className={`max-w-[${maxWidth}]`}>
          <img src={displayImage} alt={imageAlt} className={imageClassName} />
        </div>
      ) : (
        <div
          className={`max-w-[${maxWidth}] px-4 py-3 rounded-2xl ${
            message.sender === "user"
              ? "bg-charcoal text-white rounded-br-none"
              : "bg-gray-100 text-charcoal rounded-bl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
