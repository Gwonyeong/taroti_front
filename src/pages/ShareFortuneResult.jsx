import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import decemberFortuneData from "../data/decemberFortune.json";

const ShareFortuneResult = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();

  const [shareData, setShareData] = useState(null);
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
    const fetchShareData = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }/api/share/${shareId}`
        );

        if (!response.ok) {
          throw new Error("공유된 운세 데이터를 불러올 수 없습니다.");
        }

        const data = await response.json();
        setShareData(data);

        // JSON 파일에서 해당 카드 정보 가져오기
        const cardNumber = data.fortuneData.selectedCard;
        const cardInfo = decemberFortuneData[cardNumber.toString()];

        if (cardInfo) {
          setCardInfo(cardInfo);
        } else {
          throw new Error("카드 정보를 찾을 수 없습니다.");
        }

        // 3초 후 원본 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = `/december-fortune-result/${data.originalFortuneId}`;
        }, 3000);

      } catch (error) {
        console.error("Error fetching share data:", error);
        setError(error.message);
        toast.error("공유된 운세 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchShareData();
    } else {
      setError("잘못된 공유 링크입니다.");
      setLoading(false);
    }
  }, [shareId]);

  const handleRedirectNow = () => {
    if (shareData) {
      window.location.href = `/december-fortune-result/${shareData.originalFortuneId}`;
    }
  };

  // 동적 메타 태그 데이터 생성
  const generateMetaTags = () => {
    if (!shareData || !cardInfo) return {};

    const fortuneData = shareData.fortuneData;
    const nickname = fortuneData.user?.nickname || "타로티 친구";
    const cardDisplayName = getCardDisplayName(fortuneData.selectedCard);
    const fortuneType = fortuneData.fortuneType || "운세";

    const title = `${nickname}님의 12월 ${fortuneType} 결과 - ${cardDisplayName}`;

    // 카드 설명과 월간 운세를 조합하여 더 풍부한 설명 생성
    const cardDescription = cardInfo.description || "";
    const monthlyForecast = cardInfo.monthlyForecast || "";

    let description = "";
    if (monthlyForecast) {
      description = `${cardDisplayName} 카드가 선택되었습니다. ${monthlyForecast.length > 100
        ? monthlyForecast.substring(0, 97) + "..."
        : monthlyForecast}`;
    } else if (cardDescription) {
      description = `${cardDisplayName} - ${cardDescription.length > 120
        ? cardDescription.substring(0, 117) + "..."
        : cardDescription}`;
    } else {
      description = `${nickname}님이 선택한 ${cardDisplayName} 카드의 12월 ${fortuneType} 결과를 확인해보세요.`;
    }

    const cardImageUrl = `${window.location.origin}/documents/illustrator/${String(
      fortuneData.selectedCard
    ).padStart(2, "0")}-${getCardName(fortuneData.selectedCard)}.jpg`;

    const originalUrl = `${window.location.origin}/december-fortune-result/${shareData.originalFortuneId}`;

    return {
      title,
      description: description.trim(),
      image: cardImageUrl,
      url: originalUrl, // 원본 URL을 메타 태그에 설정
      cardName: cardDisplayName,
      nickname,
      fortuneType
    };
  };

  const metaTags = generateMetaTags();

  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">공유된 운세 결과를 불러오는 중...</div>
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
            onClick={() => navigate("/")}
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

        {/* 자동 리다이렉트 메타 태그 (3초 후) */}
        <meta httpEquiv="refresh" content={`3;url=/december-fortune-result/${shareData?.originalFortuneId}`} />
      </Helmet>

      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col min-h-screen relative">
        {/* 공유 페이지 헤더 */}
        <div className="p-6 bg-white text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              {metaTags.nickname}님의 12월 운세 결과
            </h1>
            <p className="text-gray-600 text-sm">
              선택된 카드: {metaTags.cardName}
            </p>
          </div>

          {/* 카드 이미지 */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <img
              src={metaTags.image}
              alt={`${metaTags.cardName} 카드`}
              className="w-48 h-72 object-cover rounded-lg mx-auto mb-4"
              onError={(e) => {
                e.target.src = "/images/cards/back/camp_band.jpeg";
              }}
            />
            <h2 className="text-xl font-bold text-charcoal mb-2">
              {metaTags.cardName}
            </h2>
          </div>

          {/* 리다이렉트 안내 */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
            <div className="text-purple-800 font-semibold mb-2">
              잠시 후 전체 운세 결과 페이지로 이동합니다...
            </div>
            <div className="text-sm text-purple-600 mb-4">
              자동 이동까지 3초
            </div>
            <Button
              onClick={handleRedirectNow}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              지금 바로 보기
            </Button>
          </div>

          {/* TaroTI 브랜딩 */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">
              🔮 TaroTI에서 제공하는 타로 운세
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
            >
              나도 운세 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareFortuneResult;