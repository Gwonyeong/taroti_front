import React from "react";
import { useParams } from "react-router-dom";
import { FortuneShare } from "../components/fortune";
import newYearFortune2026Data from "../data/newYearFortune2026.json";

const ShareNewYearResult2026 = () => {
  const { shareId } = useParams();

  return (
    <FortuneShare
      shareId={shareId}
      shareApiEndpoint="/api/share-newyear-2026"
      fortuneDataFile={newYearFortune2026Data}
      cardImagePath="/documents/illustrator/{cardId}-{cardName}.jpg"
      fallbackImage="/images/cards/back/camp_band.jpeg"
      ctaButtonText="나도 2026년 상반기 운세 보기"
      ctaRoute="/newyear-fortune-2026"
      customFields={{
        description: "description",
        monthlyForecast: "firstHalfFortune",
        luckyActions: "luckyActions",
      }}
      branding={{
        appName: "TaroTI",
        description: "타로카드로 알아보는 2026년 상반기 운세",
        logo: "/logo192.png",
      }}
    />
  );
};

export default ShareNewYearResult2026;