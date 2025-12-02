import React from "react";
import { useParams } from "react-router-dom";
import { FortuneResult } from "../components/fortune";
import decemberFortuneData from "../data/decemberFortune.json";

const DecemberFortuneResultNew = () => {
  const { fortuneId } = useParams();

  return (
    <FortuneResult
      fortuneId={fortuneId}
      apiEndpoint="/api/december-fortune"
      shareEndpoint="/api/december-fortune"
      title="12월 기본운 결과"
      subtitle="선택하신 카드의 운세를 확인해보세요"
      fortuneDataFile={decemberFortuneData}
      cardImagePath="/documents/illustrator/{cardId}-{cardName}.jpg"
      fallbackImage="/images/cards/back/camp_band.jpeg"
      sections={{
        cardMeaning: true,
        monthlyForecast: true,
        luckyActions: true,
      }}
      customFields={{
        description: "description",
        monthlyForecast: "monthlyForecast",
        luckyActions: "luckyActions",
      }}
    />
  );
};

export default DecemberFortuneResultNew;