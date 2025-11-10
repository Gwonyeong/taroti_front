import React from 'react';

const CarrotChatBubble = ({
  message,
  characterImageSrc = "/images/characters/desert_fox/desert_fox_open_mouse.png",
  characterName = "페넥",
  centered = false,
  removeMaxWidth = false
}) => {
  const containerClass = centered ? "flex justify-center" : "flex items-start space-x-3";
  const bubbleMaxWidth = removeMaxWidth ? "" : "max-w-[80%]";

  if (centered) {
    return (
      <div className={containerClass}>
        <div className="flex items-start space-x-3">
          <img
            src={characterImageSrc}
            alt={characterName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <div className={`bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 inline-block ${bubbleMaxWidth}`}>
              <p className="text-sm text-charcoal">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <img
        src={characterImageSrc}
        alt={characterName}
        className="w-10 h-10 rounded-full flex-shrink-0"
      />
      <div className="flex-1">
        <div className={`bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 inline-block ${bubbleMaxWidth}`}>
          <p className="text-sm text-charcoal">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarrotChatBubble;