import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import CardBack from "../components/CardBack";

const ShareFortuneResult = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [shareData, setShareData] = useState(null);
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

  useEffect(() => {
    const fetchShareData = async () => {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5002";

      try {
        // API에서 공유 데이터 가져오기
        const response = await fetch(`${apiBaseUrl}/api/share-fortune/${shareId}`);

        if (response.ok) {
          const data = await response.json();
          setShareData(data);
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
  }, [shareId]);

  const handleCTA = () => {
    // 템플릿 키에 따라 다른 경로로 이동
    if (shareData?.templateKey) {
      navigate(`/fortune/${shareData.templateKey}`);
    } else {
      navigate("/");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // 동적 메타 태그 데이터 생성
  const generateMetaTags = () => {
    if (!shareData) return {};

    const title = shareData.title || `${shareData.nickname}님의 ${shareData.fortuneType} 결과`;
    const description = shareData.description || `${shareData.nickname}님이 선택한 ${shareData.cardName} 카드의 운세 결과를 확인해보세요.`;

    return {
      title,
      description,
      image: shareData.image || `${window.location.origin}/logo192.png`,
      url: window.location.href,
    };
  };

  const metaTags = generateMetaTags();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">공유된 운세 결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center p-6">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <div className="space-y-3">
            <Button
              onClick={handleCTA}
              className="bg-purple-600 text-white hover:bg-purple-700 block w-full"
            >
              운세 보러가기
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 block w-full"
            >
              홈으로 가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex justify-center relative">
      <Helmet>
        <title>{metaTags.title || "TaroTI - 공유된 운세 결과"}</title>
        <meta name="description" content={metaTags.description || "타로카드로 알아보는 운세"} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaTags.url || window.location.href} />
        <meta property="og:title" content={metaTags.title || "TaroTI - 공유된 운세 결과"} />
        <meta property="og:description" content={metaTags.description || "타로카드로 알아보는 운세"} />
        <meta property="og:image" content={metaTags.image} />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content="TaroTI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={metaTags.url || window.location.href} />
        <meta name="twitter:title" content={metaTags.title || "TaroTI - 공유된 운세 결과"} />
        <meta name="twitter:description" content={metaTags.description || "타로카드로 알아보는 운세"} />
        <meta name="twitter:image" content={metaTags.image} />

        {/* 카카오톡 공유용 */}
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="400" />
      </Helmet>

      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col min-h-screen relative z-10">
        {/* 헤더 */}
        <div className="p-6 bg-white border-b">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
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
                <div className="flex justify-center mb-4">
                  <CardBack
                    cardNumber={shareData.selectedCard}
                    isFlipped={true}
                    customBackImage=""
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
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
                나도 {shareData?.fortuneType || "운세"} 보기
              </Button>
            </div>
          </div>
        </div>

        {/* 하단 홈 버튼 */}
        <div className="p-4 bg-white border-t">
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            TaroTI 홈으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareFortuneResult;