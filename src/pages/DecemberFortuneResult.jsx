import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import Navigation from "../components/ui/Navigation";
import { toast } from "sonner";
import decemberFortuneData from "../data/decemberFortune.json";

const DecemberFortuneResult = () => {
  const { fortuneId } = useParams();
  const navigate = useNavigate();

  const [fortuneData, setFortuneData] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카드 표시명 함수
  const getCardDisplayName = (cardNumber) => {
    const displayNames = {
      0: "THE FOOL (바보)",
      1: "THE MAGICIAN (마법사)",
      2: "THE HIGH PRIESTESS (여사제)",
      3: "THE EMPRESS (여황제)",
      4: "THE EMPEROR (황제)",
      5: "THE HIEROPHANT (교황)",
      6: "THE LOVERS (연인)",
      7: "THE CHARIOT (전차)",
      8: "STRENGTH (힘)",
      9: "THE HERMIT (은둔자)",
      10: "WHEEL OF FORTUNE (운명의 수레바퀴)",
      11: "JUSTICE (정의)",
      12: "THE HANGED MAN (매달린 사람)",
      13: "DEATH (죽음)",
      14: "TEMPERANCE (절제)",
      15: "THE DEVIL (악마)",
      16: "THE TOWER (탑)",
      17: "THE STAR (별)",
      18: "THE MOON (달)",
      19: "THE SUN (태양)",
      20: "JUDGEMENT (심판)",
      21: "THE WORLD (세계)",
    };
    return displayNames[cardNumber] || "THE FOOL (바보)";
  };

  // 카드명 매핑 함수
  const getCardName = (cardNumber) => {
    const cardNames = {
      0: "TheFool",
      1: "TheMagician",
      2: "TheHighPriestess",
      3: "TheEmpress",
      4: "TheEmperor",
      5: "TheHierophant",
      6: "TheLovers",
      7: "TheChariot",
      8: "Strength",
      9: "TheHermit",
      10: "WheelOfFortune",
      11: "Justice",
      12: "TheHangedMan",
      13: "Death",
      14: "Temperance",
      15: "TheDevil",
      16: "TheTower",
      17: "TheStar",
      18: "TheMoon",
      19: "TheSun",
      20: "Judgement",
      21: "TheWorld",
    };
    return cardNames[cardNumber] || "TheFool";
  };

  useEffect(() => {
    const fetchFortuneData = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }/api/december-fortune/${fortuneId}`
        );

        if (!response.ok) {
          throw new Error("운세 데이터를 불러올 수 없습니다.");
        }

        const data = await response.json();
        setFortuneData(data);

        // JSON 파일에서 해당 카드 정보 가져오기
        const cardNumber = data.selectedCard;
        const cardInfo = decemberFortuneData[cardNumber.toString()];

        if (cardInfo) {
          setCardInfo(cardInfo);
        } else {
          throw new Error("카드 정보를 찾을 수 없습니다.");
        }

      } catch (error) {
        console.error("Error fetching fortune data:", error);
        setError(error.message);
        toast.error("운세 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (fortuneId) {
      fetchFortuneData();
    } else {
      setError("잘못된 접근입니다.");
      setLoading(false);
    }
  }, [fortuneId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 클립보드에 복사되었습니다.");
    } catch (error) {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // 동적 메타 태그 데이터 생성
  const generateMetaTags = () => {
    if (!fortuneData || !cardInfo) return {};

    const nickname = fortuneData.nickname || "타로티 친구";
    const title = `${nickname}님의 12월 운세 결과`;
    const cardDescription = cardInfo.description || "";
    const truncatedDescription = cardDescription.length > 160
      ? cardDescription.substring(0, 157) + "..."
      : cardDescription;

    const cardImageUrl = `${window.location.origin}/documents/illustrator/${String(
      fortuneData.selectedCard
    ).padStart(2, "0")}-${getCardName(fortuneData.selectedCard)}.jpg`;

    const currentUrl = window.location.href;

    return {
      title,
      description: truncatedDescription,
      image: cardImageUrl,
      url: currentUrl,
      cardName: getCardDisplayName(fortuneData.selectedCard)
    };
  };

  const metaTags = generateMetaTags();

  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">운세 결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <div className="text-center p-6">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <Button
            onClick={handleGoHome}
            className="bg-charcoal text-white hover:bg-gray-800"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offWhite flex justify-center">
      <Helmet>
        <title>{metaTags.title || "TaroTI - 12월 운세 결과"}</title>
        <meta name="description" content={metaTags.description || "타로카드로 알아보는 12월 운세"} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaTags.url || window.location.href} />
        <meta property="og:title" content={metaTags.title || "TaroTI - 12월 운세 결과"} />
        <meta property="og:description" content={metaTags.description || "타로카드로 알아보는 12월 운세"} />
        <meta property="og:image" content={metaTags.image || `${window.location.origin}/logo192.png`} />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content="TaroTI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={metaTags.url || window.location.href} />
        <meta name="twitter:title" content={metaTags.title || "TaroTI - 12월 운세 결과"} />
        <meta name="twitter:description" content={metaTags.description || "타로카드로 알아보는 12월 운세"} />
        <meta name="twitter:image" content={metaTags.image || `${window.location.origin}/logo192.png`} />

        {/* 카카오톡 공유용 */}
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="400" />
      </Helmet>

      <Navigation fixed />
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col min-h-screen relative">
        {/* 고정 네비게이션을 위한 여백 */}
        <div className="h-16"></div>

        {/* 결과 헤더 */}
        <div className="p-6 bg-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              12월 {fortuneData?.fortuneType} 결과
            </h1>
            <p className="text-gray-600 text-sm">
              선택하신 카드의 운세를 확인해보세요
            </p>
          </div>
        </div>

        {/* 카드 이미지 및 기본 정보 */}
        <div className="p-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <img
              src={`/documents/illustrator/${String(
                fortuneData?.selectedCard
              ).padStart(2, "0")}-${getCardName(fortuneData?.selectedCard)}.jpg`}
              alt={`${getCardName(fortuneData?.selectedCard)} 카드`}
              className="w-48 h-72 object-cover rounded-lg mx-auto mb-4"
              onError={(e) => {
                e.target.src = "/images/cards/back/camp_band.jpeg";
              }}
            />
            <h2 className="text-xl font-bold text-charcoal mb-2">
              {getCardDisplayName(fortuneData?.selectedCard)}
            </h2>
            <div className="text-sm text-gray-500">
              선택된 카드: {fortuneData?.selectedCard}번
            </div>
          </div>
        </div>

        {/* 카드 설명 */}
        {cardInfo && (
          <div className="p-6 space-y-6">
            {/* 카드 의미 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-bold text-charcoal mb-4">
                카드의 의미
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {cardInfo.description?.split(/(?<=[.!?])\s+/).map((sentence, index) => (
                  <span key={index}>
                    {sentence}
                    {index < cardInfo.description.split(/(?<=[.!?])\s+/).length - 1 && '\n'}
                  </span>
                ))}
              </p>
            </div>

            {/* 12월 운세 */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-4">
                12월 {fortuneData?.fortuneType}
              </h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {cardInfo.monthlyForecast?.split(/(?<=[.!?])\s+/).map((sentence, index) => (
                  <span key={index}>
                    {sentence}
                    {index < cardInfo.monthlyForecast.split(/(?<=[.!?])\s+/).length - 1 && '\n'}
                  </span>
                ))}
              </p>
            </div>

            {/* 행운을 부르는 행동들 */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4">
                행운을 부르는 행동들
              </h3>
              <ul className="space-y-3">
                {cardInfo.luckyActions.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✨</span>
                    <span className="text-gray-800">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 하단 고정 버튼을 위한 여백 */}
        <div className="h-32"></div>

        {/* 하단 고정 액션 버튼들 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="w-full max-w-[500px] mx-auto p-4 flex gap-3">
            <Button
              onClick={handleShare}
              className="flex-1 bg-purple-600 text-white hover:bg-purple-700 py-3"
            >
              결과 공유하기
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1 border-charcoal text-charcoal hover:bg-charcoal hover:text-white py-3"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecemberFortuneResult;