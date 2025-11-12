import React from "react";
import SpeechBubble from "./SpeechBubble";

const SpeechBubbleExamples = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        말풍선 컴포넌트 예제
      </h1>

      {/* 기본 말풍선 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">1. 기본 말풍선 (실선)</h2>
        <SpeechBubble
          content="안녕하세요! 기본 말풍선입니다."
          characterName="캐릭터A"
          position="top-16 left-8"
        />
      </div>

      {/* 점선 말풍선 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">2. 점선 말풍선</h2>
        <SpeechBubble
          content="점선 테두리로 된 말풍선이에요."
          borderStyle="dashed"
          borderColor="border-blue-500"
          backgroundColor="bg-blue-50"
          position="top-16 left-8"
        />
      </div>

      {/* 점점선 말풍선 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">3. 점점선 말풍선</h2>
        <SpeechBubble
          content="점점선 테두리 말풍선입니다."
          borderStyle="dotted"
          borderColor="border-green-500"
          backgroundColor="bg-green-50"
          position="top-16 left-8"
        />
      </div>

      {/* 이중선 말풍선 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">4. 이중선 말풍선</h2>
        <SpeechBubble
          content="이중선 테두리 말풍선입니다."
          borderStyle="double"
          borderColor="border-purple-500"
          backgroundColor="bg-purple-50"
          position="top-16 left-8"
        />
      </div>

      {/* 사각형 말풍선 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">5. 사각형 말풍선</h2>
        <SpeechBubble
          content="사각형 모양의 말풍선입니다."
          borderType="square"
          borderColor="border-red-500"
          backgroundColor="bg-red-50"
          position="top-16 left-8"
        />
      </div>

      {/* 원형 말풍선 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">6. 원형 말풍선</h2>
        <SpeechBubble
          content="원형 말풍선"
          borderType="circular"
          borderColor="border-yellow-500"
          backgroundColor="bg-yellow-50"
          position="top-16 left-8"
          padding="p-6"
        />
      </div>

      {/* 꼬리 없는 말풍선 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">7. 꼬리 없는 말풍선</h2>
        <SpeechBubble
          content="꼬리가 없는 말풍선입니다."
          showTail={false}
          borderColor="border-indigo-500"
          backgroundColor="bg-indigo-50"
          position="top-16 left-8"
        />
      </div>

      {/* 다양한 꼬리 위치 */}
      <div className="relative h-60 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">8. 다양한 꼬리 위치</h2>
        <SpeechBubble
          content="위쪽 꼬리"
          tailPosition="top"
          position="top-20 left-8"
          backgroundColor="bg-pink-50"
          borderColor="border-pink-500"
        />
        <SpeechBubble
          content="아래쪽 꼬리"
          tailPosition="bottom"
          position="top-20 left-48"
          backgroundColor="bg-cyan-50"
          borderColor="border-cyan-500"
        />
        <SpeechBubble
          content="왼쪽"
          tailPosition="left"
          position="top-20 left-80"
          backgroundColor="bg-orange-50"
          borderColor="border-orange-500"
        />
        <SpeechBubble
          content="오른쪽"
          tailPosition="right"
          position="top-20 left-96"
          backgroundColor="bg-teal-50"
          borderColor="border-teal-500"
        />
      </div>

      {/* 이미지 테두리 예제 (실제 이미지가 필요함) */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">
          9. 이미지 테두리 말풍선 (예제)
        </h2>
        <SpeechBubble
          content="이미지 테두리를 사용할 수 있습니다."
          position="top-16 left-8"
          customStyle={{
            background:
              "linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
            border: "3px solid #ff69b4",
            borderRadius: "20px",
          }}
          showTail={false}
        />
      </div>

      {/* 타원형 말풍선 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">10. 타원형 말풍선</h2>
        <SpeechBubble
          content="타원형 말풍선"
          position="top-16 left-8"
          borderType="oval"
          backgroundColor="bg-rose-50"
          borderColor="border-rose-400"
          borderWidth="border-2"
          textStyle="text-sm font-bold text-gray-800"
          padding="p-4"
          showTail={false}
        />
      </div>

      {/* 꼬리 없는 다양한 스타일 */}
      <div className="relative h-60 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">
          11. 꼬리 없는 다양한 스타일
        </h2>
        <SpeechBubble
          content="일반 사각형"
          position="top-20 left-8"
          borderType="square"
          backgroundColor="bg-blue-50"
          borderColor="border-blue-400"
          showTail={false}
          padding="p-4"
        />
        <SpeechBubble
          content="타원형"
          position="top-20 left-40"
          borderType="oval"
          backgroundColor="bg-green-50"
          borderColor="border-green-400"
          showTail={false}
          padding="p-4"
        />
        <SpeechBubble
          content="원형"
          position="top-20 left-72"
          borderType="circular"
          backgroundColor="bg-purple-50"
          borderColor="border-purple-400"
          showTail={false}
          padding="p-3"
        />
      </div>

      {/* 가장자리 이미지 말풍선 */}
      <div className="relative h-60 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">12. 가장자리 이미지 말풍선</h2>
        <SpeechBubble
          content="왼쪽 아래에 페넥이 있다마!"
          position="top-20 left-8"
          borderType="oval"
          backgroundColor="bg-orange-50"
          borderColor="border-orange-400"
          edgeImage="/images/characters/desert_fox/desert_fox_open_mouse.png"
          edgeImagePosition="bottom-left"
          edgeImageSize="w-12 h-12"
          showTail={false}
          padding="p-5"
        />
        <SpeechBubble
          content="오른쪽 위!"
          position="top-20 left-60"
          borderType="rounded"
          backgroundColor="bg-purple-50"
          borderColor="border-purple-400"
          edgeImage="/images/characters/desert_fox/desert_fox_open_mouse.png"
          edgeImagePosition="top-right"
          edgeImageSize="w-10 h-10"
          showTail={false}
          padding="p-4"
        />
      </div>

      {/* 커스텀 스타일 */}
      <div className="relative h-40 mb-8 bg-white border rounded-lg">
        <h2 className="p-4 text-lg font-semibold">13. 커스텀 스타일</h2>
        <SpeechBubble
          content="커스텀 스타일을 적용한 말풍선입니다."
          position="top-16 left-8"
          textStyle="text-lg font-bold text-white"
          customStyle={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
          showTail={false}
        />
      </div>
    </div>
  );
};

export default SpeechBubbleExamples;
