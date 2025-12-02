import React from "react";
import { useNavigate } from "react-router-dom";
import { ChatFortune } from "../components/fortune";
import { toast } from "sonner";

const NewYearFortune2026 = () => {
  const navigate = useNavigate();

  // 메시지 시나리오 정의
  const messageScenario = [
    { text: "2026년 상반기 운세를 봐줄거래!", sender: "bot" },
    { text: "새로운 한 해니까 더욱 특별한 운세가 기다리고 있을거래!", sender: "bot" },
    { text: "바로 카드를 뽑아보고래!", sender: "bot", showCardSelect: true },
  ];

  // 캐릭터 정보
  const characterInfo = {
    name: "돌핀",
    imageSrc: "/images/characters/dollfin/dollfin.jpg",
  };

  // 2026년 신년 운세 세션 생성
  const createNewYearFortuneSession = async (selectedCardNumber, fortuneType) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
        }/api/newyear-fortune-2026`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fortuneType,
            selectedCardNumber,
            year: 2026,
            period: "상반기"
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.fortuneId;
      } else {
        throw new Error("Failed to create new year fortune session");
      }
    } catch (error) {
      console.error("Error creating new year fortune session:", error);
      throw error;
    }
  };

  // 광고 완료 후 결과 페이지로 이동
  const handleComplete = async (selectedCardNumber, fortuneType) => {
    try {
      // 2026년 신년 운세 세션 생성
      const fortuneId = await createNewYearFortuneSession(selectedCardNumber, fortuneType);

      // 결과 페이지로 이동
      navigate(`/newyear-fortune-2026-result/${fortuneId}`);
    } catch (error) {
      console.error("Error navigating to result:", error);
      toast.error("결과 페이지로 이동 중 오류가 발생했습니다.");
    }
  };

  return (
    <ChatFortune
      messageScenario={messageScenario}
      characterInfo={characterInfo}
      onComplete={handleComplete}
      fortuneType="2026년 상반기 운세"
      resultButtonText="2026년 상반기 운세 결과 보기"
      adTitle="2026년 상반기 운세 결과"
      cardNumbers={Array.from({ length: 22 }, (_, i) => i)} // 0-21번 모든 카드 사용
      cardSelectCount={3}
      cardBackImage="/images/cards/back/camp_band.jpeg"
    />
  );
};

export default NewYearFortune2026;