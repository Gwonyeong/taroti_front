import React, { useEffect, useRef } from 'react';

const CoupangAdModal = ({ isOpen, onClose, onAdComplete }) => {
  const adContainerRef = useRef(null);
  const adLoadedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !adLoadedRef.current && adContainerRef.current) {
      // 쿠팡 파트너스 광고 스크립트 실행
      if (window.PartnersCoupang) {
        try {
          new window.PartnersCoupang.G({
            id: 945731,
            template: "carousel",
            trackingCode: "AF4808659",
            width: "400",
            height: "600",
            tsource: "",
            container: adContainerRef.current
          });
          adLoadedRef.current = true;
        } catch (error) {
          console.error("Error loading Coupang Partners ad:", error);
        }
      }

      // 5초 후 자동으로 광고 완료 처리 (선택적)
      const timer = setTimeout(() => {
        if (onAdComplete) {
          onAdComplete();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onAdComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 max-w-[90vw] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-charcoal">특별 혜택</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            잠시만 기다려주세요! 특별한 혜택을 확인해보세요.
          </p>
        </div>

        {/* 쿠팡 파트너스 광고 컨테이너 */}
        <div
          ref={adContainerRef}
          className="flex justify-center items-center min-h-[600px]"
        >
          {/* 광고가 여기에 렌더링됩니다 */}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              onClose();
              if (onAdComplete) {
                onAdComplete();
              }
            }}
            className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoupangAdModal;