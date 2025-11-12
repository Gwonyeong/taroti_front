import React from "react";

const SpeechBubble = ({
  content,
  characterName,
  position = "top-4 left-4",
  borderStyle = "solid",
  borderType = "rounded",
  backgroundColor = "bg-white",
  borderColor = "border-gray-800",
  borderWidth = "border-2",
  textStyle = "text-sm text-gray-800 font-medium",
  padding = "p-8",
  shadow = "shadow-lg",
  maxWidth = "60%",
  zIndex = 10,
  showTail = false,
  tailShow = false,
  tailPosition = "bottom",
  customStyle = {},
  borderImage = null,
  borderImagePath,
  borderImageSize = "20px",
  edgeImage = null,
  edgeImagePosition = "top-left",
  edgeImageSize = "w-12 h-12",
  edgeImageOffset = "4px",
  className = "",
}) => {
  const getBorderClass = () => {
    if (borderImage || borderImagePath) {
      return "";
    }

    const baseClasses = [backgroundColor, shadow];

    switch (borderStyle) {
      case "dashed":
        baseClasses.push(`border-dashed ${borderWidth} ${borderColor}`);
        break;
      case "dotted":
        baseClasses.push(`border-dotted ${borderWidth} ${borderColor}`);
        break;
      case "double":
        baseClasses.push(`border-double border-4 ${borderColor}`);
        break;
      case "solid":
      default:
        baseClasses.push(`${borderWidth} ${borderColor}`);
        break;
    }

    return baseClasses.join(" ");
  };

  const getBorderRadius = () => {
    switch (borderType) {
      case "square":
        return "rounded-none";
      case "rounded":
        return "rounded-xl";
      case "circular":
        return "rounded-full";
      case "oval":
        return "rounded-full";
      default:
        return "rounded-xl";
    }
  };

  const getShapeStyle = () => {
    if (borderType === "oval") {
      return {
        borderRadius: "50%",
        aspectRatio: "2/1",
        minWidth: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    }
    return {};
  };

  const getEdgeImageClasses = () => {
    const baseClasses = "absolute";

    switch (edgeImagePosition) {
      case "top-left":
        return `${baseClasses} -top-2 -left-2`;
      case "top-right":
        return `${baseClasses} -top-2 -right-2`;
      case "bottom-left":
        return `${baseClasses} -bottom-2 -left-2`;
      case "bottom-right":
        return `${baseClasses} -bottom-2 -right-2`;
      case "top-center":
        return `${baseClasses} -top-2 left-1/2 transform -translate-x-1/2`;
      case "bottom-center":
        return `${baseClasses} -bottom-2 left-1/2 transform -translate-x-1/2`;
      case "left-center":
        return `${baseClasses} -left-2 top-1/2 transform -translate-y-1/2`;
      case "right-center":
        return `${baseClasses} -right-2 top-1/2 transform -translate-y-1/2`;
      default:
        return `${baseClasses} -top-2 -left-2`;
    }
  };

  const getTailClasses = () => {
    if (!showTail && !tailShow) return "";

    const tailColor = backgroundColor === "bg-white" ? "border-t-white" : `border-t-${backgroundColor.split('-')[1]}-${backgroundColor.split('-')[2]}`;

    switch (tailPosition) {
      case "bottom":
        return `border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent ${tailColor} bottom-[-11px] left-1/2 transform -translate-x-1/2`;
      case "top":
        return `border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white top-[-11px] left-1/2 transform -translate-x-1/2`;
      case "right":
        return `border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white right-[-9px] top-1/2 transform -translate-y-1/2`;
      case "left":
        return `border-t-[6px] border-b-[6px] border-r-[10px] border-t-transparent border-b-transparent border-r-white left-[-9px] top-1/2 transform -translate-y-1/2`;
      default:
        return `border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent ${tailColor} bottom-[-11px] left-1/2 transform -translate-x-1/2`;
    }
  };

  const bubbleStyle = borderImage || borderImagePath
    ? {
        borderImageSource: `url(${borderImage || borderImagePath})`,
        borderImageSlice: "20 fill",
        borderImageWidth: borderImageSize,
        borderImageRepeat: "stretch",
        borderStyle: "solid",
        borderWidth: borderImageSize,
        ...getShapeStyle(),
        ...customStyle,
      }
    : {
        ...getShapeStyle(),
        ...customStyle,
      };

  return (
    <div
      className={`absolute ${position} ${className}`}
      style={{
        zIndex: zIndex,
        maxWidth: maxWidth,
      }}
    >
      <div
        className={`
          ${getBorderClass()}
          ${getBorderRadius()}
          ${padding}
          relative
        `}
        style={bubbleStyle}
      >
        {/* Speech bubble tail */}
        {(showTail || tailShow) && !borderImage && !borderImagePath && (
          <div
            className={`absolute w-0 h-0 ${getTailClasses()}`}
          />
        )}

        {/* Bubble content */}
        <div className={`${textStyle} break-keep`} style={{ wordBreak: 'keep-all' }}>
          {typeof content === "string" ? (
            <p className="whitespace-pre-line">{content}</p>
          ) : (
            content
          )}
        </div>

        {/* Character name */}
        {characterName && (
          <div className="text-xs text-gray-500 mt-1 font-bold">
            - {characterName}
          </div>
        )}

        {/* Edge Image */}
        {edgeImage && (
          <div className={`${getEdgeImageClasses()} z-10`}>
            <img
              src={edgeImage}
              alt="Edge character"
              className={`${edgeImageSize} object-contain rounded-full border-2 border-white shadow-lg`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechBubble;