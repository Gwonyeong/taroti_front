import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import WebtoonPanel from "../components/WebtoonPanel";
import { Button } from "../components/ui/button";

const Feedback = () => {
  const { landingUserId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isV2, setIsV2] = useState(false);

  useEffect(() => {
    // 버전 확인
    const version = searchParams.get("version");
    setIsV2(version === "2");
  }, [searchParams]);

  // 이메일 및 피드백 저장
  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (landingUserId && landingUserId !== "temp") {
        // 이메일 저장 (구매 API 활용)
        const purchaseApiUrl = isV2
          ? `/api/landing-user-v2/${landingUserId}/purchase`
          : `/api/landing-user/${landingUserId}/purchase`;

        await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }${purchaseApiUrl}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        // V2인 경우 피드백도 저장
        if (isV2 && (feedbackScore > 0 || feedbackText.trim())) {
          const feedbackData = {
            feedback: {
              score: feedbackScore,
              text: feedbackText,
              email: email,
              timestamp: new Date().toISOString(),
            },
          };

          await fetch(
            `${
              process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
            }/api/landing-user-v2/${landingUserId}/feedback`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(feedbackData),
            }
          );
        }
      }

      alert(
        "등록이 완료되었습니다! TaroTI 정식 출시 시 가장 먼저 연락드리겠습니다."
      );
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 다시하기 (처음부터)
  const handleRestart = async () => {
    if (isV2 && landingUserId && landingUserId !== "temp") {
      try {
        // 다시하기 상태 업데이트
        await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }/api/landing-user-v2/${landingUserId}/restart`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error updating restart status:", error);
      }
    }

    // 로컬 스토리지 초기화하고 랜딩 페이지로 이동
    localStorage.removeItem("taroTI_landingUserIdV2");
    localStorage.removeItem("taroTI_landingUserId");
    localStorage.removeItem("taroTI_selectedCardNumber");
    navigate("/");
  };

  // 결과 페이지로 돌아가기
  const handleGoBack = () => {
    const cardNumber = searchParams.get("cardNumber");
    const versionParam = isV2 ? "&version=2" : "&version=1";
    navigate(`/result/${landingUserId}?cardNumber=${cardNumber}${versionParam}`);
  };

  return (
    <div className="min-h-screen bg-offWhite flex justify-center">
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white text-black p-4 shadow-md">
          <h1 className="text-xl font-bold text-left">TaroTI</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 페넥 메시지 */}
          <div className="mb-6">
            <WebtoonPanel
              backgroundImage="/images/characters/desert_fox/desert_fox_sit_desk.jpeg"
              fitImage={true}
              allowOverflow={true}
              className=""
              borderRadius="rounded-lg"
              speechBubbles={[
                {
                  content:
                    "사실 타로티아이(TaroTI)는 아직 개발중이다마.\n관심을 가져줘서 정말 고맙다마!\n\n이메일을 입력하면 정식 출시되었을 때\n선물을 받을 수 있다마!",
                  position: "top-4 right-4",
                  bubbleStyle:
                    "bg-yellow-50 bg-opacity-95 border-3 border-amber-400",
                  tailPosition: "bottom",
                  maxWidth: "75%",
                  textStyle: "text-sm text-gray-800 font-bold leading-relaxed",
                  zIndex: 20,
                },
              ]}
            />
          </div>

          {/* 이메일 입력 */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-bold text-charcoal mb-4">
              출시 알림 받기
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  이메일 주소 *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 피드백 입력 (V2만) */}
          {isV2 && (
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-bold text-charcoal mb-4">
                서비스 피드백
              </h3>
              <div className="space-y-4">
                {/* 별점 평가 */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    서비스는 어떠셨나요?
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackScore(star)}
                        className={`text-3xl ${
                          star <= feedbackScore
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {feedbackScore > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {feedbackScore === 5 && "최고예요!"}
                      {feedbackScore === 4 && "좋아요!"}
                      {feedbackScore === 3 && "괜찮아요"}
                      {feedbackScore === 2 && "아쉬워요"}
                      {feedbackScore === 1 && "별로예요"}
                    </p>
                  )}
                </div>

                {/* 텍스트 피드백 */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    의견을 들려주세요 (선택)
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="서비스 개선을 위한 의견을 자유롭게 남겨주세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={!email.trim() || isSubmitting}
              className="w-full bg-charcoal hover:bg-gray-800 text-white py-3"
            >
              {isSubmitting ? "등록 중..." : "알림 신청하기"}
            </Button>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="p-4 bg-white border-t border-gray-200 space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            결과 페이지로 돌아가기
          </button>
          <button
            onClick={handleRestart}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            처음부터 다시하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;