import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import Navigation from "../components/ui/Navigation";
import { toast } from "sonner";
import newYearFortune2026Data from "../data/newYearFortune2026.json";
import { getCardInfo, getCardName, getCardDescription } from "../data/tarotCards";

const NewYearFortuneResult2026 = () => {
  const { fortuneId } = useParams();
  const navigate = useNavigate();

  const [fortuneData, setFortuneData] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [tarotCardInfo, setTarotCardInfo] = useState(null);
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
          }/api/newyear-fortune-2026/${fortuneId}`
        );

        if (!response.ok) {
          throw new Error("운세 데이터를 불러올 수 없습니다.");
        }

        const data = await response.json();
        setFortuneData(data);

        // JSON 파일에서 해당 카드 정보 가져오기
        const cardNumber = data.selectedCard;
        const cardInfo = newYearFortune2026Data[cardNumber.toString()];
        const tarotCardInfo = getCardInfo(cardNumber);

        if (cardInfo) {
          setCardInfo(cardInfo);
          setTarotCardInfo(tarotCardInfo);
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
    const backendDomain =
      process.env.REACT_APP_API_BASE_URL ||
      (window.location.hostname === "localhost"
        ? "http://localhost:5002"
        : "https://tarotiback.vercel.app");

    try {
      const metaData = generateMetaTags();
      const apiUrl = `${backendDomain}/api/newyear-fortune-2026/${fortuneId}/share`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: metaData.title,
          description: metaData.description,
          image: metaData.image,
          cardName: metaData.cardName,
          nickname: metaData.nickname,
          fortuneType: metaData.fortuneType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const shareUrl = `${backendDomain}/share-newyear-2026/${data.shareId}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success(
          "공유 링크가 클립보드에 복사되었습니다! 🔗\nSNS나 메신저에 붙여넣어 공유해보세요."
        );
        return;
      }
    } catch (apiError) {
      console.error("Share API error:", apiError);
    }

    // 폴백 공유 로직
    try {
      const clientShareId = btoa(`newyear-fortune-2026-${fortuneId}`)
        .replace(/[+/=]/g, "")
        .slice(0, 12);
      const fallbackUrl = `${backendDomain}/share-newyear-2026/${clientShareId}`;
      await navigator.clipboard.writeText(fallbackUrl);
      toast.success(
        "공유 링크가 클립보드에 복사되었습니다! 🔗\nSNS나 메신저에 붙여넣어 공유해보세요."
      );
    } catch (fallbackError) {
      console.error("Fallback share error:", fallbackError);
      toast.error("공유 링크 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // 동적 메타 태그 데이터 생성
  const generateMetaTags = () => {
    if (!fortuneData || !cardInfo) return {};

    const nickname = fortuneData.user?.nickname || "타로티 친구";
    const cardDisplayName = cardInfo.cardName || getCardDisplayName(fortuneData.selectedCard);
    const fortuneType = "2026년 상반기 운세";

    const title = `${nickname}님의 ${fortuneType} 결과 - ${cardDisplayName}`;
    const description = `${cardDisplayName} 카드가 선택되었습니다. ${
      cardInfo.firstHalfFortune
        ? cardInfo.firstHalfFortune.length > 100
          ? cardInfo.firstHalfFortune.substring(0, 97) + "..."
          : cardInfo.firstHalfFortune
        : `${nickname}님이 선택한 ${cardDisplayName} 카드의 ${fortuneType} 결과를 확인해보세요.`
    }`;

    const cardImageUrl = `${window.location.origin}/documents/illustrator/${String(
      fortuneData.selectedCard
    ).padStart(2, "0")}-${getCardName(fortuneData.selectedCard)}.jpg`;

    return {
      title,
      description: description.trim(),
      image: cardImageUrl,
      url: window.location.href,
      cardName: cardDisplayName,
      nickname,
      fortuneType,
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
    <div className="min-h-screen bg-offWhite flex justify-center relative">
      <Helmet>
        <title>{metaTags.title || "TaroTI - 2026년 상반기 운세 결과"}</title>
        <meta
          name="description"
          content={metaTags.description || "타로카드로 알아보는 2026년 상반기 운세"}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={metaTags.url || window.location.href}
        />
        <meta
          property="og:title"
          content={metaTags.title || "TaroTI - 2026년 상반기 운세 결과"}
        />
        <meta
          property="og:description"
          content={metaTags.description || "타로카드로 알아보는 2026년 상반기 운세"}
        />
        <meta
          property="og:image"
          content={
            metaTags.image || `${window.location.origin}/logo192.png`
          }
        />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content="TaroTI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={metaTags.url || window.location.href}
        />
        <meta
          name="twitter:title"
          content={metaTags.title || "TaroTI - 2026년 상반기 운세 결과"}
        />
        <meta
          name="twitter:description"
          content={metaTags.description || "타로카드로 알아보는 2026년 상반기 운세"}
        />
        <meta
          name="twitter:image"
          content={
            metaTags.image || `${window.location.origin}/logo192.png`
          }
        />

        {/* 카카오톡 공유용 */}
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="400" />
      </Helmet>

      <Navigation fixed />
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col min-h-screen relative z-10">
        {/* 고정 네비게이션을 위한 여백 */}
        <div className="h-16"></div>

        {/* 결과 헤더 */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              🎊 2026년 상반기 운세 결과
            </h1>
            <p className="text-gray-600 text-sm">
              새로운 한 해, 선택하신 카드의 운세를 확인해보세요
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
              {cardInfo?.cardName || getCardDisplayName(fortuneData?.selectedCard)}
            </h2>
            <div className="text-sm text-gray-500">
              선택된 카드: {fortuneData?.selectedCard}번
            </div>
          </div>
        </div>

        {/* 카드 의미 섹션 */}
        {tarotCardInfo && (
          <div className="p-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
                🔮 선택하신 카드의 의미
              </h3>
              <div className="space-y-4">
                <p className="text-gray-800 leading-relaxed">
                  {tarotCardInfo.description}
                </p>
                {tarotCardInfo.keywords && tarotCardInfo.keywords.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-indigo-700">핵심 키워드</div>
                    <div className="flex flex-wrap gap-2">
                      {tarotCardInfo.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 rounded-full text-xs font-medium text-indigo-700"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 카드 정보 섹션들 */}
        {cardInfo && (
          <div className="p-6 pt-0 space-y-6">
            {/* 상반기 종합 운세 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                🌟 2026년 상반기 종합 운세
              </h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {cardInfo.firstHalfFortune}
              </p>
            </div>

            {/* 학업/성장운 */}
            {cardInfo.studyFortune && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  📚 학업/성장운
                </h3>
                <p className="text-gray-800 leading-relaxed">
                  {cardInfo.studyFortune}
                </p>
              </div>
            )}

            {/* 재물/재정운 */}
            {cardInfo.wealthFortune && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  💰 재물/재정운
                </h3>
                <p className="text-gray-800 leading-relaxed">
                  {cardInfo.wealthFortune}
                </p>
              </div>
            )}

            {/* 인간관계운 */}
            {cardInfo.relationshipFortune && (
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-200">
                <h3 className="text-lg font-bold text-rose-800 mb-4 flex items-center gap-2">
                  💕 인간관계운
                </h3>
                <p className="text-gray-800 leading-relaxed">
                  {cardInfo.relationshipFortune}
                </p>
              </div>
            )}

            {/* 행운을 부르는 행동들 */}
            {cardInfo.luckyActions && Array.isArray(cardInfo.luckyActions) && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                  ✨ 행운을 부르는 행동들
                </h3>
                <ul className="space-y-3">
                  {cardInfo.luckyActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">🍀</span>
                      <span className="text-gray-800">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 행운의 색상 */}
            {cardInfo.luckyColors && Array.isArray(cardInfo.luckyColors) && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
                <h3 className="text-lg font-bold text-pink-800 mb-4 flex items-center gap-2">
                  🎨 행운의 색상
                </h3>
                <div className="flex flex-wrap gap-3">
                  {cardInfo.luckyColors.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-white rounded-full text-sm font-medium text-pink-700 border border-pink-200 shadow-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 핵심 키워드 */}
            {cardInfo.keywords && Array.isArray(cardInfo.keywords) && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  🌟 핵심 키워드
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cardInfo.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-200 rounded-full text-sm font-medium text-yellow-800"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 하단 고정 버튼을 위한 여백 */}
        <div className="h-32"></div>

        {/* 하단 고정 액션 버튼들 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="w-full max-w-[500px] mx-auto p-4 flex gap-3">
            <Button
              onClick={handleShare}
              className="flex-1 bg-purple-600 text-white hover:bg-purple-700 py-3 flex items-center justify-center gap-2"
            >
              <span className="text-lg">📤</span>
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

export default NewYearFortuneResult2026;