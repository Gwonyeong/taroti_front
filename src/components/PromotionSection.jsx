import React from "react";
import SpeechBubble from "./SpeechBubble";

const PromotionSection = () => {
  return (
    <div className="flex flex-col items-center w-full py-6 mt-8 space-y-6">
      {/* 첫 번째 프로모션 이미지 */}
      <div className="w-full max-w-lg relative">
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
      <div className="w-full max-w-lg">
        <img
          src="/images/promotions/2.jpg"
          alt="타로 카드 프로모션"
          className="w-full rounded-lg shadow-lg"
          onError={() => {
            console.error("프로모션 이미지 2 로드 실패");
          }}
        />
      </div>

      {/* 세 번째 프로모션 이미지 */}
      <div className="w-full max-w-lg">
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
      <div className="w-full max-w-lg flex justify-end">
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
      <div className="w-full max-w-lg relative">
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
          <div className="text-white text-left space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-2">
                0. 애인은 나를 어떻게 생각할까?
              </h3>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">
                1. 애인과 나의 궁합 보기
              </h3>
              <p className="text-sm ml-4 mb-1">
                1-1. 내가 만나는 애인.. 운명의 상대일까?
              </p>
              <p className="text-sm ml-4">1-2. 애인과의 미래는 어떻게 될까?</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">
                2. 애인과의 위기, 미리 극복하기
              </h3>
              <p className="text-sm ml-4 mb-1">
                2-1. 우리는 어떤 위기를 만나게 될까?
              </p>
              <p className="text-sm ml-4">
                2-2. 각자의 성격 유형에 따라 효과적인 극복 방안 제시
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">
                3. 이 관계가 나를 성장시켜줄까?
              </h3>
              <p className="text-sm ml-4 mb-1">
                3-1. 나의 성격 유형은 어떤 연애를 하면 좋을까?
              </p>
              <p className="text-sm ml-4">3-2. 내 연애 성향은 뭘까?</p>
            </div>
          </div>
        </div>
      </div>

      {/* 여섯 번째 프로모션 이미지 */}
      <div className="w-full max-w-lg relative">
        <img
          src="/images/promotions/6.jpg"
          alt="타로 카드 프로모션"
          className="w-full rounded-lg shadow-lg"
          onError={() => {
            console.error("프로모션 이미지 6 로드 실패");
          }}
        />
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
    </div>
  );
};

export default PromotionSection;
