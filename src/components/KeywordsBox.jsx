import React from "react";

const KeywordsBox = ({
  title,
  keywords,
  backgroundColor = "bg-gray-50",
  titleColor = "text-gray-800",
  borderColor = "border-gray-200",
  textColor = "text-gray-700"
}) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <div className={`${backgroundColor} p-4 rounded-lg border ${borderColor}`}>
      <h5 className={`font-semibold ${titleColor} mb-3 text-center`}>
        {title}
      </h5>
      <ul className="space-y-2">
        {keywords.map((keyword, index) => (
          <li key={index} className="flex items-start">
            <span className="text-amber-600 mr-2 font-bold">•</span>
            <span className={`text-sm ${textColor} leading-relaxed`}>
              {keyword}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeywordsBox;