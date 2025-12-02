import React from "react";
import { useParams } from "react-router-dom";
import { FortuneShare } from "../components/fortune";
import decemberFortuneData from "../data/decemberFortune.json";

const ShareFortuneResultNew = () => {
  const { shareId } = useParams();

  return (
    <FortuneShare
      shareId={shareId}
      shareApiEndpoint="/api/share"
      fortuneDataFile={decemberFortuneData}
      cardImagePath="/documents/illustrator/{cardId}-{cardName}.jpg"
      fallbackImage="/images/cards/back/camp_band.jpeg"
      ctaButtonText="나도 12월 운세 보기"
      ctaRoute="/december-fortune"
      customFields={{
        description: "description",
        monthlyForecast: "monthlyForecast",
        luckyActions: "luckyActions",
      }}
      branding={{
        appName: "TaroTI",
        description: "타로카드로 알아보는 12월 운세",
        logo: "/logo192.png",
      }}
    />
  );
};

export default ShareFortuneResultNew;