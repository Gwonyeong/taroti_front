import React, { useEffect, useRef, useState } from "react";
import { Progress } from "./ui/progress";
import { useAuth } from "../context/AuthContext";

const AdBanner = ({
  isOpen,
  onClose,
  onComplete,
  title = "특별 혜택",

  adConfig = {
    id: 945731,
    template: "carousel",
    trackingCode: "AF4808659",
    width: "400",
    height: "600",
  },
}) => {
  const adContainerRef = useRef(null);
  const adLoadedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && !adLoadedRef.current && adContainerRef.current) {
      // 쿠팡 파트너스 광고 스크립트 실행
      if (window.PartnersCoupang) {
        try {
          new window.PartnersCoupang.G({
            ...adConfig,
            tsource: "",
            container: adContainerRef.current,
          });
          adLoadedRef.current = true;
        } catch (error) {
          console.error("Error loading Coupang Partners ad:", error);
        }
      }
    }
  }, [isOpen, adConfig]);

  // 프로그래스 바 애니메이션
  useEffect(() => {
    if (isOpen && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2; // 5초 동안 100%가 되도록 (100/5초 = 20/초, 50ms마다 2%)
          if (newProgress >= 100) {
            setCanContinue(true);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isOpen, progress]);

  // 모달이 열릴 때 프로그래스 리셋
  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setCanContinue(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (canContinue) {
      onClose();
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 max-w-[90vw] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-charcoal">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 진행 프로그래스 바와 계속하기 버튼 (광고 위로 이동) */}
        <div className="mb-4 space-y-3">
          <div className="space-y-3">
            <p className="text-sm text-center text-gray-600">
              {canContinue
                ? "완료! 지금 확인해보세요!"
                : `${user?.nickname || "사용자"}님을 위해 결과를 생성하고있어요!`}
            </p>
            <Progress value={progress} className="w-full" />
          </div>
          {canContinue && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleContinue}
                className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all animate-fadeIn"
              >
                계속하기
              </button>
            </div>
          )}
        </div>

        {/* 쿠팡 파트너스 광고 컨테이너 */}
        <div
          ref={adContainerRef}
          className="flex justify-center items-center min-h-[600px]"
        >
          {/* 광고가 여기에 렌더링됩니다 */}
        </div>

        {/* 쿠팡 파트너스 안내 문구 */}
        <p className="text-xs text-gray-500 text-center mt-3">
          쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
          제공받습니다.
        </p>
      </div>
    </div>
  );
};

export default AdBanner;
