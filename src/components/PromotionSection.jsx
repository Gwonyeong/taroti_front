import React, { useState, useEffect, useRef } from "react";
import SpeechBubble from "./SpeechBubble";
import WebtoonPanel from "./WebtoonPanel";

const PromotionSection = () => {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const promotionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (promotionRef.current) {
        const rect = promotionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // 프로모션 섹션이 화면에 조금이라도 보이면 배경을 어둡게
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        setIsDarkBackground(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 상태 체크

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-700 ease-in-out pointer-events-none ${
          isDarkBackground ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 9999 }}
      />

      <div
        ref={promotionRef}
        className="flex flex-col items-center w-full py-6 mt-8 space-y-16 relative"
        style={{ zIndex: 10000 }}
      >
        {/* 첫 번째 프로모션 이미지 */}
        <div className="w-full max-w-lg relative mb-12">
          <img
            src="/images/promotions/1.jpg"
            alt="프로모션"
            className="w-full rounded-lg shadow-lg"
            onError={() => {
              console.error("프로모션 이미지 로드 실패");
            }}
          />
          {/* 이미지 하단에 오버레이 텍스트 */}
          <div className="absolute bottom-2 left-0 right-0 text-white text-center py-3">
            <p className="text-xl font-bold">
              당신의 타로 여정, 왜 TaroTI 일까요?
            </p>
          </div>
        </div>

        {/* 두 번째 프로모션 이미지 */}
        <div className="w-full max-w-lg   mb-12 ">
          <img
            src="/images/promotions/2.jpg"
            alt="타로 카드 프로모션"
            className="w-full rounded-lg shadow-lg "
            onError={() => {
              console.error("프로모션 이미지 2 로드 실패");
            }}
          />
        </div>

        {/* 세 번째 프로모션 이미지 */}
        <div className="w-full max-w-lg mb-12">
          <img
            src="/images/promotions/3.jpg"
            alt="타로 카드 프로모션"
            className="w-full rounded-lg shadow-lg"
            onError={() => {
              console.error("프로모션 이미지 3 로드 실패");
            }}
          />
        </div>

        {/* 네 번째 프로모션 이미지 - 오른쪽 정렬 */}
        <div className="w-full max-w-lg flex justify-end mb-12">
          <div className="w-4/5">
            <img
              src="/images/promotions/4.jpg"
              alt="타로 카드 프로모션"
              className="w-full rounded-lg shadow-lg"
              onError={() => {
                console.error("프로모션 이미지 4 로드 실패");
              }}
            />
          </div>
        </div>

        {/* 다섯 번째 프로모션 이미지 */}
        <div className="w-full max-w-lg relative mb-16">
          <img
            src="/images/promotions/5.jpg"
            alt="타로 카드 프로모션"
            className="w-full rounded-lg shadow-lg"
            onError={() => {
              console.error("프로모션 이미지 5 로드 실패");
            }}
          />
          {/* 이미지 위에 오버레이 텍스트 */}
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center p-6">
            <div className="text-white text-left space-y-3">
              <div>
                <h2 className="text-lg font-bold mb-1">목차</h2>
              </div>
              <div>
                <h3 className="text-base font-bold mb-1">
                  0. 애인은 나를 어떻게 생각할까?
                </h3>
              </div>

              <div>
                <h3 className="text-base font-bold mb-1">
                  1. 애인과 나의 궁합 보기
                </h3>
                <p className="text-xs ml-3 mb-1">
                  1-1. 내가 만나는 애인.. 운명의 상대일까?
                </p>
                <p className="text-xs ml-3">
                  1-2. 애인과의 미래는 어떻게 될까?
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold mb-1">
                  2. 애인과의 위기, 미리 극복하기
                </h3>
                <p className="text-xs ml-3 mb-1">
                  2-1. 우리는 어떤 위기를 만나게 될까?
                </p>
                <p className="text-xs ml-3">
                  2-2. 각자의 성격 유형에 따라 효과적인 극복 방안 제시
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold mb-1">
                  3. 이 관계가 나를 성장시켜줄까?
                </h3>
                <p className="text-xs ml-3 mb-1">
                  3-1. 나의 성격 유형은 어떤 연애를 하면 좋을까?
                </p>
                <p className="text-xs ml-3">3-2. 내 연애 성향은 뭘까?</p>
              </div>
            </div>
          </div>
        </div>

        {/* 여섯 번째 프로모션 이미지 */}
        <div className="w-full max-w-lg relative mb-20">
          <div className="w-full rounded-lg shadow-lg overflow-hidden">
            <img
              src="/images/promotions/6.jpg"
              alt="타로 카드 프로모션"
              className="w-full h-full object-cover object-top"
              onError={() => {
                console.error("프로모션 이미지 6 로드 실패");
              }}
            />
          </div>
          {/* 이미지 상단에 오버레이 텍스트 */}
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-4 rounded-t-lg">
            <p className="text-xl font-bold opacity-80">
              타로 결과, 그럴 듯한 이야기만..
            </p>
          </div>

          {/* 지그재그 박스들 */}
          <div className="absolute inset-0 flex flex-col justify-center space-y-8 overflow-hidden">
            {/* 첫 번째 줄 - 좌측으로 치우침 */}
            <div className="flex translate-x-[-10%] w-[150%] space-x-4">
              <div className="w-56 h-20 bg-gray-600 bg-opacity-40 rounded-lg flex items-center justify-center">
                <span className="text-sm text-white font-medium px-3 py-2 blur-sm">
                  애인의 마음을 알아보세요
                </span>
              </div>
              <div className="w-[300px] h-20 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-base text-white font-medium px-4 py-2">
                  미래에 원하는 애인을 만나게 될거야.
                </span>
              </div>
              <div className="w-56 h-20 bg-gray-600 bg-opacity-40 rounded-lg flex items-center justify-center">
                <span className="text-sm text-white font-medium px-3 py-2 blur-sm">
                  운명의 상대를 찾아보세요
                </span>
              </div>
            </div>

            {/* 두 번째 줄 - 우측으로 치우침 */}
            <div className="flex translate-x-[-20%] w-[150%] space-x-4">
              <div className="w-56 h-20 bg-gray-600 bg-opacity-40 rounded-lg flex items-center justify-center">
                <span className="text-sm text-white font-medium px-3 py-2 blur-sm">
                  연애의 비밀을 알려드려요
                </span>
              </div>
              <div className="w-[300px] h-20 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-base text-white font-medium px-4 py-2">
                  예상치 못한 변화가 있어요.
                </span>
              </div>
              <div className="w-56 h-20 bg-gray-600 bg-opacity-40 rounded-lg flex items-center justify-center">
                <span className="text-sm text-white font-medium px-3 py-2 blur-sm">
                  당신만의 타로 이야기
                </span>
              </div>
            </div>
            {/* 세 번째 줄 - 좌측으로 치우침 */}
            <div className="flex translate-x-[-5%] w-[150%] space-x-4">
              <div className="w-56 h-20 bg-gray-600 bg-opacity-40 rounded-lg flex items-center justify-center">
                <span className="text-sm text-white font-medium px-3 py-2 blur-sm">
                  진실한 사랑을 위한 조언
                </span>
              </div>
              <div className="w-[300px] h-20 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-base text-white font-medium px-4 py-2">
                  평소 하지 않던 행동을 하세요.
                </span>
              </div>
              <div className="w-56 h-20 bg-gray-600 bg-opacity-40 rounded-lg flex items-center justify-center">
                <span className="text-sm text-white font-medium px-3 py-2 blur-sm">
                  관계의 미래를 예측해요
                </span>
              </div>
            </div>
          </div>

          {/* 하단에 페넥 캐릭터와 말풍선 */}
          <div className="absolute bottom-4 right-4">
            <img
              src="/images/characters/desert_fox/desert_fox_non_bg_watch_card.jpeg"
              alt="페넥 캐릭터"
              className="w-16 h-16 rounded-full"
            />
            <SpeechBubble
              content="이런 이야기는 누구나 할 수 있다마!"
              position="top-[-70px] right-[-20px] "
              borderStyle="solid"
              borderType="oval"
              backgroundColor="bg-white"
              borderColor="border-black"
              borderWidth="border-2"
              textStyle="text-xs font-bold text-black"
              padding="p-4"
              maxWidth="220px"
              zIndex={30}
              showTail={true}
              tailPosition="bottom"
              customStyle={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
        </div>

        {/* 일곱 번째 프로모션 이미지 - 성격유형 강조 (연결된 컴포넌트) */}
        <div className="w-full max-w-lg mb-20">
          <div
            className="relative rounded-lg overflow-hidden shadow-2xl"
            style={{
              boxShadow:
                "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 15px 30px -7px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* 이미지 섹션 */}
            <div className="relative">
              <img
                src="/images/promotions/7.jpg"
                alt="성격유형 타로 프로모션"
                className="w-full"
                onError={() => {
                  console.error("프로모션 이미지 7 로드 실패");
                }}
              />
              {/* 이미지 위 어두운 그라디언트 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black flex flex-col justify-end p-8">
                <div className="text-white space-y-3">
                  <h2 className="text-2xl font-bold leading-tight">
                    TaroTI는 성격유형을 이용해 더 정교하게 당신을 이해해요
                  </h2>
                  <p className="text-sm opacity-90">
                    당신을 위한 더 정교한 조언
                  </p>
                </div>
              </div>
            </div>

            {/* 하단 검정 박스 - 이미지와 자연스럽게 연결 */}
            <div className="bg-black -mt-1">
              <div className="p-8 text-white space-y-4">
                <p className="text-sm opacity-90 leading-relaxed">
                  10만건 이상의 타로 데이터 + 확실한 타로카드 전문가, 당신의
                  미래 이야기를 평생 소장할 수 있는 보고서로 작성해드려요.
                </p>
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <div></div>
                  </div>
                </div>
              </div>

              {/* 7-1 이미지 추가 */}
              <div className="relative">
                <img
                  src="/images/promotions/7-1.jpg"
                  alt="성격유형 상세 설명"
                  className="w-full"
                  onError={() => {
                    console.error("프로모션 이미지 7-1 로드 실패");
                  }}
                />
                {/* 이미지 하단 진한 오버레이와 텍스트 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end p-8">
                  <div className="text-center w-full pb-4">
                    <h3 className="text-white text-xl font-bold leading-relaxed drop-shadow-lg">
                      지금 나의 성격유형을 이용해 작성한{" "}
                      <span className="text-blue-200">나만의 타로 보고서</span>
                      를 확인해보세요!
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 지금 구매해야 하는 이유 섹션 */}
        <div className="w-full max-w-lg mt-16 mb-20 space-y-8">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            지금 구매해야 하는 이유
          </h2>

          {/* 포인트 1 - 웹툰형 해설 */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                귀여운 타마들의 지루할 틈 없는 웹툰형 해설
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                타마들이 해설해주는 당신의 이야기! 웹툰을 보다보면 어느새 내
                미래를 확인할 수 있어요!
              </p>
              <div className="relative rounded-lg overflow-hidden shadow-md">
                <img
                  src="/images/promotions/8.jpg"
                  alt="웹툰형 해설 예시"
                  className="w-full"
                  onError={() => {
                    console.error("프로모션 이미지 8 로드 실패");
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-xs font-medium">
                    지루한 텍스트가 아닌, 캐릭터와 함께하는 즐거운 타로 리딩
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 포인트 2 - 성격유형 맞춤 조언 */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border-2 border-purple-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                그럴듯한 조언이 아닌 '나의 성격유형'을 이용한 나에게 맞는
                구체적인 조언
              </h3>
              <div className="bg-white/70 p-4 rounded-lg space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600">✓</span>
                  <p className="text-sm text-gray-700">
                    카드의 특징과 나의 성격 유형을 고려한 구체적인 조언
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600">✓</span>
                  <p className="text-sm text-gray-700">
                    '나'를 구체적으로 파악
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600">✓</span>
                  <p className="text-sm text-gray-700">실용적인 행동 가이드</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-100 rounded-lg text-left">
                <p className="text-xs text-purple-800">
                  💡 예시: "THE FOOL(바보) 카드가 나타내는 '새로운 시작'의
                  의미와 INFP인 당신의 성격을 결합해보면, 당신은 새로운 운명의
                  상대를 꿈꾸고, 시작할 준비가 되었음을 의미해요. 당신의
                  순수하게 사람 자체를 보는 눈은 상대방에게 매력적으로
                  다가올거에요."
                </p>
              </div>
            </div>
          </div>

          {/* 포인트 3 - 상세한 카드 해석 */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                상세한 카드 의미 해석
              </h3>
              <div className="bg-white/70 p-4 rounded-lg space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <p className="text-sm text-gray-700">
                    카드 일러스트 상세 분석으로 누구나 이해하기 쉽게
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <p className="text-sm text-gray-700">
                    한 곳에서 완성되는 올인원 타로 해석
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <p className="text-sm text-gray-700">
                    개인별 연애 상황에 최적화된 카드 의미 제공
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-white/70 p-2 rounded text-center">
                  <p className="text-xs font-semibold text-blue-700">
                    카드 설명
                  </p>
                  <p className="text-xs text-gray-600 mt-1">그림 해석</p>
                </div>
                <div className="bg-white/70 p-2 rounded text-center">
                  <p className="text-xs font-semibold text-blue-700">
                    긍정/부정
                  </p>
                  <p className="text-xs text-gray-600 mt-1">키워드 분석</p>
                </div>
                <div className="bg-white/70 p-2 rounded text-center">
                  <p className="text-xs font-semibold text-blue-700">
                    연애 조언
                  </p>
                  <p className="text-xs text-gray-600 mt-1">맞춤 해석</p>
                </div>
              </div>
            </div>
          </div>

          {/* 웹툰 패널 - 페넥이 카드를 보고 있는 장면 */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-lg">
              <WebtoonPanel
                backgroundImage="/images/characters/webtoon/desert_fox_watching_card.jpeg"
                fitImage={true}
                allowOverflow={false}
                className=""
                borderRadius="rounded-lg"
                speechBubbles={[
                  {
                    content: "이 모든 것들이 하나의 보고서로 완성된다마!",
                    position: "top-4 left-4",
                    bubbleStyle:
                      "bg-white bg-opacity-95 border-3 border-amber-400",
                    tailPosition: "bottom",
                    maxWidth: "60%",
                    textStyle:
                      "text-sm text-gray-800 font-bold leading-relaxed",
                    zIndex: 20,
                  },
                ]}
              />
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="text-center mt-8 pb-8">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 p-1 rounded-xl shadow-lg">
              <div className="bg-white px-8 py-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  지금 바로 시작하세요!
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  당신만의 타로 스토리
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="w-full max-w-lg mt-16 mb-20 space-y-6">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            조언을 듣고간 사람들의 이야기
          </h2>

          {/* 후기 박스 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  KM
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900">김OO님</span>
                  <span className="text-sm text-gray-500">28</span>
                </div>
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full mb-3">
                  조언이 도움이 되었어요
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  가격도 좋고 조언도 너무 도움돼요!
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  연애 고민이 많았는데 제 성격유형에 맞춰서 조언해주니까 너무
                  와닿았어요. 특히 INFP인 제가 연인과 소통할 때 주의해야 할
                  점들을 구체적으로 알려주셔서 실제로 관계가 많이 개선됐어요. 이
                  가격에 이런 퀄리티라니 정말 대박이에요!
                </p>
              </div>
            </div>
          </div>

          {/* 후기 박스 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  LS
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900">이OO님</span>
                  <span className="text-sm text-gray-500">32</span>
                </div>
                <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full mb-3">
                  정확한 분석이었어요
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  제 성격 유형에 맞춰 조언해주니 너무 좋았어요
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  처음엔 반신반의했는데 결과 보고 깜짝 놀랐어요. ENTJ인 저의
                  성격과 연애 스타일을 정확히 짚어주시더라구요. 애인이 저를
                  어떻게 생각하는지도 신기할 정도로 맞았고, 앞으로 어떻게 관계를
                  발전시켜야 할지 명확한 가이드를 받은 느낌이에요.
                </p>
              </div>
            </div>
          </div>

          {/* 후기 박스 3 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold">
                  PJ
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900">박OO님</span>
                  <span className="text-sm text-gray-500">25</span>
                </div>
                <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full mb-3">
                  관계가 개선되었어요
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  여자친구가 날 어떻게 생각하는지 알게 됐어요!
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  큰 싸움 후에 어떻게 해야 할지 막막했는데, '애인이 나를 어떻게
                  생각하는지' 섹션이 정말 큰 도움이 됐어요. 제가 몰랐던
                  여자친구의 진짜 마음을 이해하게 되었고, 왜 그런 반응을
                  보였는지 알게 되니까 대화의 실마리가 풀렸어요. 이제는 서로를
                  더 잘 이해하게 됐습니다. 진짜 강추해요!
                </p>
              </div>
            </div>
          </div>

          {/* 후기 박스 4 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">
                  CY
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900">최OO님</span>
                  <span className="text-sm text-gray-500">30</span>
                </div>
                <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full mb-3">
                  위기를 예측했어요
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  애인과의 위기를 정확히 맞춰서 놀랐어요!
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  타로가 예측한 위기 상황이 정말로 일어나서 깜짝 놀랐어요.
                  다행히 미리 조언받은 대로 대처하니까 큰 싸움 없이 넘어갈 수
                  있었어요. 특히 '애인과의 위기, 미리 극복하기' 섹션에서 알려준
                  대처법이 정말 유용했고, 실제로 그 상황이 왔을 때 침착하게
                  해결할 수 있었습니다. 너무 신기해요!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 마지막 프로모션 이미지 - 1번 이미지 (연결된 컴포넌트) */}
        <div className="w-full max-w-lg mt-16 mb-20">
          <div
            className="relative rounded-lg overflow-hidden shadow-2xl"
            style={{
              boxShadow:
                "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 15px 30px -7px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* 이미지 섹션 */}
            <div className="relative">
              <img
                src="/images/promotions/1.jpg"
                alt="타로 프로모션"
                className="w-full"
                onError={() => {
                  console.error("프로모션 이미지 1 로드 실패");
                }}
              />
              {/* 이미지 하단 그라디언트 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
            </div>

            {/* 하단 검정 박스 - 이미지와 자연스럽게 연결 */}
            <div className="bg-black -mt-1 p-8">
              <div className="bg-gray-900 rounded-lg p-6 border-2 border-amber-400/20">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  이런 분들에게 추천합니다!
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-amber-400 text-lg">✓</span>
                    <p className="text-sm text-white">
                      연인의 마음을 정확히 알고 싶은 분
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-amber-400 text-lg">✓</span>
                    <p className="text-sm text-white">
                      나만의 성격에 맞는 조언을 원하는 분
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-amber-400 text-lg">✓</span>
                    <p className="text-sm text-white">
                      재미있는 타로 해석을 찾는 분
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-amber-400 text-lg">✓</span>
                    <p className="text-sm text-white">
                      연애 위기를 미리 예방하고 싶은 분
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-amber-400 text-lg">✓</span>
                    <p className="text-sm text-white">
                      정확한 타로 결과를 원하시는 분
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 페넥의 편지 - 마지막 섹션 */}
        <div className="w-full max-w-lg mt-16 mb-20">
          <div
            className="relative rounded-lg overflow-hidden shadow-2xl"
            style={{
              boxShadow:
                "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 15px 30px -7px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* 이미지 섹션 */}
            <div className="relative">
              <img
                src="/images/characters/desert_fox/desert_fox_sit_desk.jpeg"
                alt="페넥의 편지"
                className="w-full"
                onError={() => {
                  console.error("페넥 편지 이미지 로드 실패");
                }}
              />
              {/* 이미지 하단 그라디언트 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
              {/* 이미지 위 제목 텍스트 */}
              <div className="absolute top-4 left-4 right-4">
                <h2 className="text-white text-xl font-bold text-center drop-shadow-lg">
                  페넥의 편지
                </h2>
              </div>
            </div>

            {/* 하단 검정 박스 - 이미지와 자연스럽게 연결 */}
            <div className="bg-black -mt-1 p-8">
              <div className="text-white space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm text-amber-400 italic">
                    친애하는 당신에게
                  </p>
                </div>

                <div className="space-y-3 text-sm leading-relaxed">
                  <p>안녕하다마! 타로 마법사 페넥이다마.</p>
                  <p>
                    너는 혹시 타로를 본 적이 있냐마? 타로를 볼 때마다 결과가
                    다르다고 느낀 적은 없냐마?
                  </p>
                  <p>
                    같은 주제로 찾아가도 모든 사람에게 해당될 것 같은 뻔한
                    이야기만 들었을 것이다마. 나도 그런 것들이 참 아쉬웠다마.
                  </p>
                  <p>
                    그래서 나의 목표는 하나다마! 바로 당신에게 제대로 된 타로
                    결과를 재미있게 해설해주는 것이다마.
                  </p>
                  <p>
                    사람, 재물, 학업... 많은 것에 걱정하고 고민하는 여러분에게
                    꼭 들려주고 싶은 이야기가 있다마.
                  </p>
                  <p>
                    우주를 여행하고, 많은 것을 경험하는 '0번 바보카드' 타로
                    이야기처럼 당신에게도 뜻깊은 이야기를 선사하겠다마!
                  </p>
                  <p className="pt-4 border-t border-gray-700 italic">
                    당신만의 특별한 타로 여정이 시작되기를 바란다마. ✨
                  </p>
                </div>

                <div className="text-right mt-6">
                  <p className="text-amber-400 font-bold">페넥 🦊</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionSection;
