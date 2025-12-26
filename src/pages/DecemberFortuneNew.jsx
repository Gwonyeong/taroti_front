import React from "react";
import { useNavigate } from "react-router-dom";
import { ChatFortune } from "../components/fortune";
import { toast } from "sonner";

const DecemberFortuneNew = () => {
  const navigate = useNavigate();

  // 메시지 시나리오 정의
  const messageScenario = [
    { text: "12월의 운세를 봐줄거래!", sender: "bot" },
    { text: "바로 카드를 뽑아보고래!", sender: "bot", showCardSelect: true },
  ];

  // 캐릭터 정보
  const characterInfo = {
    name: "돌핀",
    imageSrc: "/images/characters/dollfin/dollfin.jpg",
  };

  // December Fortune 세션 생성
  const createDecemberFortuneSession = async (selectedCardNumber, fortuneType) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
        }/api/december-fortune`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fortuneType,
            selectedCardNumber,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.fortuneId;
      } else {
        throw new Error("Failed to create December fortune session");
      }
    } catch (error) {
      
      throw error;
    }
  };

  // 광고 완료 후 결과 페이지로 이동
  const handleComplete = async (selectedCardNumber, fortuneType) => {
    try {
      // December Fortune 세션 생성
      const fortuneId = await createDecemberFortuneSession(selectedCardNumber, fortuneType);

      // 결과 페이지로 이동
      navigate(`/december-fortune-result/${fortuneId}`);
    } catch (error) {
      
      toast.error("결과 페이지로 이동 중 오류가 발생했습니다.");
    }
  };

  return (
    <ChatFortune
      messageScenario={messageScenario}
      characterInfo={characterInfo}
      onComplete={handleComplete}
      fortuneType="기본운"
      resultButtonText="12월 운세 결과 보기"
      adTitle="12월 운세 결과"
      cardNumbers={Array.from({ length: 22 }, (_, i) => i)} // 0-21
      cardSelectCount={3}
      cardBackImage="/images/cards/back/camp_band.jpeg"
    />
  );
};

export default DecemberFortuneNew;