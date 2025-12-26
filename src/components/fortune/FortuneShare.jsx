import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../ui/button";
import { toast } from "sonner";

/**
 * 재사용 가능한 운세 공유 페이지 컴포넌트
 *
 * @param {Object} props
 * @param {String} props.shareId - 공유 ID
 * @param {String} props.shareApiEndpoint - 공유 API 엔드포인트 (예: "/api/share")
 * @param {Object} props.fortuneDataFile - 운세 데이터 JSON 파일 import
 * @param {String} props.cardImagePath - 카드 이미지 경로 템플릿
 * @param {String} props.fallbackImage - 이미지 로딩 실패 시 대체 이미지
 * @param {String} props.ctaButtonText - CTA 버튼 텍스트
 * @param {String} props.ctaRoute - CTA 버튼 클릭 시 이동 경로
 * @param {Object} props.customFields - 커스텀 필드 매핑
 * @param {Function} props.onCTAClick - CTA 버튼 커스텀 핸들러
 * @param {Object} props.branding - 브랜딩 설정
 */
const FortuneShare = ({
  shareId,
  shareApiEndpoint = "/api/share",
  fortuneDataFile,
  cardImagePath = "/documents/illustrator/{cardId}-{cardName}.jpg",
  fallbackImage = "/images/cards/back/camp_band.jpeg",
  ctaButtonText = "나도 운세 보기",
  ctaRoute = "/december-fortune",
  customFields = {
    description: "description",
    monthlyForecast: "monthlyForecast",
    luckyActions: "luckyActions",
  },
  onCTAClick,
  branding = {
    appName: "TaroTI",
    description: "타로카드로 알아보는 운세",
    logo: "/logo192.png",
  },
}) => {
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

  // 카드 이미지 URL 생성
  const getCardImageUrl = (cardNumber) => {
    const cardId = String(cardNumber).padStart(2, "0");
    const cardName = getCardName(cardNumber);
    return cardImagePath
      .replace("{cardId}", cardId)
      .replace("{cardName}", cardName);
  };

  useEffect(() => {
    const fetchShareData = async () => {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5002";

      try {
        // API에서 공유 데이터 가져오기
        const response = await fetch(`${apiBaseUrl}${shareApiEndpoint}/${shareId}`);

        if (response.ok) {
          const data = await response.json();
          setShareData(data);

          // JSON 파일에서 카드 정보 가져오기
          if (data.selectedCard !== undefined && fortuneDataFile) {
            const cardInfo = fortuneDataFile[data.selectedCard.toString()];
            if (cardInfo) {
              setCardInfo(cardInfo);
            }
          }
        } else {
          throw new Error("공유된 운세 결과를 찾을 수 없습니다.");
        }
      } catch (error) {
        setError("공유된 운세 결과를 불러올 수 없습니다.");
        toast.error("공유된 운세 결과를 불러오는 중 오류가 발생했습니다.");
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
  }, [shareId, shareApiEndpoint, fortuneDataFile]);

  const handleCTA = () => {
    if (onCTAClick) {
      return onCTAClick();
    }
    navigate(ctaRoute);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // 동적 메타 태그 데이터 생성
  const generateMetaTags = () => {
    if (!shareData) return {};

    const nickname = shareData.nickname || "타로티 친구";
    const cardName = shareData.cardName || getCardDisplayName(shareData.selectedCard);
    const fortuneType = shareData.fortuneType || "운세";

    const title = shareData.title || `${nickname}님의 ${fortuneType} 결과 - ${cardName}`;
    const description = shareData.description || `${nickname}님이 선택한 ${cardName} 카드의 ${fortuneType} 결과를 확인해보세요.`;

    let imageUrl = shareData.image;
    if (!imageUrl && shareData.selectedCard !== undefined) {
      imageUrl = `${window.location.origin}${getCardImageUrl(shareData.selectedCard)}`;
    }

    return {
      title,
      description,
      image: imageUrl || `${window.location.origin}${branding.logo}`,
      url: window.location.href,
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
          <div className="space-y-3">
            <Button
              onClick={handleCTA}
              className="bg-purple-600 text-white hover:bg-purple-700 block w-full"
            >
              {ctaButtonText}
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white block w-full"
            >
              홈으로 가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offWhite flex justify-center relative">
      <Helmet>
        <title>{metaTags.title || `${branding.appName} - 공유된 운세 결과`}</title>
        <meta name="description" content={metaTags.description || branding.description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaTags.url || window.location.href} />
        <meta property="og:title" content={metaTags.title || `${branding.appName} - 공유된 운세 결과`} />
        <meta property="og:description" content={metaTags.description || branding.description} />
        <meta property="og:image" content={metaTags.image} />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content={branding.appName} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={metaTags.url || window.location.href} />
        <meta name="twitter:title" content={metaTags.title || `${branding.appName} - 공유된 운세 결과`} />
        <meta name="twitter:description" content={metaTags.description || branding.description} />
        <meta name="twitter:image" content={metaTags.image} />

        {/* 카카오톡 공유용 */}
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="400" />
      </Helmet>

      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col min-h-screen relative z-10">
        {/* 헤더 */}
        <div className="p-6 bg-white border-b">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              {shareData?.nickname || "타로티 친구"}님의 운세 결과
            </h1>
            <p className="text-gray-600 text-sm">
              친구가 공유한 타로카드 운세를 확인해보세요
            </p>
          </div>
        </div>

        {/* 카드 이미지 및 정보 */}
        <div className="p-6 text-center flex-1">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            {shareData?.selectedCard !== undefined && (
              <>
                <img
                  src={getCardImageUrl(shareData.selectedCard)}
                  alt={`${getCardName(shareData.selectedCard)} 카드`}
                  className="w-48 h-72 object-cover rounded-lg mx-auto mb-4"
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />
                <h2 className="text-xl font-bold text-charcoal mb-2">
                  {shareData?.cardName || getCardDisplayName(shareData.selectedCard)}
                </h2>
                <div className="text-sm text-gray-500">
                  {shareData?.fortuneType || "운세"} • {shareData?.selectedCard}번 카드
                </div>
              </>
            )}
          </div>

          {/* 운세 미리보기 */}
          {shareData?.description && (
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
              <h3 className="text-lg font-bold text-purple-800 mb-4">
                운세 미리보기
              </h3>
              <p className="text-gray-800 leading-relaxed">
                {shareData.description}
              </p>
            </div>
          )}

          {/* 카드 의미 미리보기 (일부만) */}
          {cardInfo && cardInfo[customFields.description] && (
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <h3 className="text-lg font-bold text-charcoal mb-4">
                카드의 의미
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {cardInfo[customFields.description].length > 150
                  ? cardInfo[customFields.description].substring(0, 147) + "..."
                  : cardInfo[customFields.description]}
              </p>
            </div>
          )}

          {/* CTA 섹션 */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg border">
            <div className="text-center">
              <h3 className="text-lg font-bold text-purple-800 mb-2">
                🔮 나도 운세 확인하기
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                같은 타로카드로 나만의 운세를 확인해보세요
              </p>
              <Button
                onClick={handleCTA}
                className="bg-purple-600 text-white hover:bg-purple-700 w-full py-3 text-lg font-medium"
              >
                {ctaButtonText}
              </Button>
            </div>
          </div>
        </div>

        {/* 하단 홈 버튼 */}
        <div className="p-4 bg-white border-t">
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
          >
            {branding.appName} 홈으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FortuneShare;