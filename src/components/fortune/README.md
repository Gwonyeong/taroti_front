# Fortune 공용 컴포넌트

12월 운세 기능을 재사용 가능한 컴포넌트로 분리한 패키지입니다. 새로운 운세 콘텐츠를 만들 때 이 컴포넌트들을 조합하여 빠르게 개발할 수 있습니다.

## 컴포넌트 구성

### 1. ChatFortune - 채팅 인터페이스 컴포넌트

타로카드 선택을 위한 채팅 인터페이스를 제공합니다.

```jsx
import { ChatFortune } from '../components/fortune';

<ChatFortune
  messageScenario={[
    { text: "안녕하세요! 운세를 봐드릴게요", sender: "bot" },
    { text: "카드를 선택해주세요", sender: "bot", showCardSelect: true },
  ]}
  characterInfo={{
    name: "캐릭터이름",
    imageSrc: "/images/character.jpg"
  }}
  onComplete={handleComplete}
  fortuneType="연애운"
  resultButtonText="연애운 결과 보기"
  adTitle="연애운 결과"
  cardNumbers={[0, 1, 2, 3, 4]} // 사용할 카드 번호들
  cardSelectCount={3}
  cardBackImage="/images/cardback.jpg"
/>
```

#### Props

- **messageScenario**: `Array` - 채팅 메시지 시나리오
- **characterInfo**: `Object` - 캐릭터 정보 `{name, imageSrc}`
- **onComplete**: `Function` - 광고 완료 후 콜백 `(cardNumber, fortuneType) => void`
- **fortuneType**: `String` - 운세 타입 (기본값: "기본운")
- **resultButtonText**: `String` - 결과 보기 버튼 텍스트
- **adTitle**: `String` - 광고 모달 제목
- **cardNumbers**: `Array` - 선택 가능한 카드 번호 배열
- **cardSelectCount**: `Number` - 선택할 카드 개수 (기본값: 3)
- **cardBackImage**: `String` - 카드 뒷면 이미지 경로

### 2. FortuneResult - 결과 페이지 컴포넌트

운세 결과를 보여주는 페이지입니다.

```jsx
import { FortuneResult } from '../components/fortune';
import fortuneData from '../data/myFortune.json';

<FortuneResult
  fortuneId={fortuneId}
  apiEndpoint="/api/my-fortune"
  shareEndpoint="/api/my-fortune"
  title="연애운 결과"
  subtitle="선택하신 카드의 연애운을 확인해보세요"
  fortuneDataFile={fortuneData}
  cardImagePath="/images/cards/{cardId}-{cardName}.jpg"
  fallbackImage="/images/cardback.jpg"
  sections={{
    cardMeaning: true,
    monthlyForecast: true,
    luckyActions: false, // 행운 액션 숨김
  }}
  customFields={{
    description: "meaning",
    monthlyForecast: "lovePredict",
    luckyActions: "tips",
  }}
/>
```

#### Props

- **fortuneId**: `String` - 운세 ID
- **apiEndpoint**: `String` - API 엔드포인트
- **shareEndpoint**: `String` - 공유 API 엔드포인트
- **title**: `String` - 페이지 제목
- **subtitle**: `String` - 부제목
- **fortuneDataFile**: `Object` - 운세 데이터 JSON 파일
- **cardImagePath**: `String` - 카드 이미지 경로 템플릿
- **fallbackImage**: `String` - 대체 이미지
- **sections**: `Object` - 표시할 섹션 설정
- **customFields**: `Object` - 커스텀 필드 매핑
- **onShare**: `Function` - 커스텀 공유 함수 (선택적)
- **onGoHome**: `Function` - 홈 이동 커스텀 함수 (선택적)

### 3. FortuneShare - 공유 페이지 컴포넌트

공유된 운세 결과를 보여주는 페이지입니다.

```jsx
import { FortuneShare } from '../components/fortune';
import fortuneData from '../data/myFortune.json';

<FortuneShare
  shareId={shareId}
  shareApiEndpoint="/api/share"
  fortuneDataFile={fortuneData}
  ctaButtonText="나도 연애운 보기"
  ctaRoute="/love-fortune"
  branding={{
    appName: "MyApp",
    description: "나만의 운세 앱",
    logo: "/logo.png"
  }}
/>
```

#### Props

- **shareId**: `String` - 공유 ID
- **shareApiEndpoint**: `String` - 공유 API 엔드포인트
- **fortuneDataFile**: `Object` - 운세 데이터 JSON 파일
- **ctaButtonText**: `String` - CTA 버튼 텍스트
- **ctaRoute**: `String` - CTA 클릭 시 이동 경로
- **onCTAClick**: `Function` - CTA 버튼 커스텀 핸들러
- **branding**: `Object` - 브랜딩 설정

## 사용 예제

### 새로운 "연애운" 콘텐츠 만들기

1. **연애운 데이터 파일 생성** (`src/data/loveFortune.json`)

```json
{
  "0": {
    "description": "연애에서 새로운 시작을 의미합니다.",
    "lovePredict": "12월에는 새로운 만남이 기다리고 있습니다...",
    "tips": ["적극적으로 행동하기", "자신감 갖기"]
  }
}
```

2. **연애운 채팅 페이지** (`src/pages/LoveFortune.jsx`)

```jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChatFortune } from "../components/fortune";

const LoveFortune = () => {
  const navigate = useNavigate();

  const messageScenario = [
    { text: "연애운을 확인해드릴게요! 💕", sender: "bot" },
    { text: "마음에 드는 카드를 골라보세요", sender: "bot", showCardSelect: true },
  ];

  const characterInfo = {
    name: "큐피드",
    imageSrc: "/images/cupid.jpg",
  };

  const handleComplete = async (cardNumber, fortuneType) => {
    // API 호출로 세션 생성
    const response = await fetch('/api/love-fortune', {
      method: 'POST',
      body: JSON.stringify({ cardNumber, fortuneType })
    });
    const { fortuneId } = await response.json();
    navigate(`/love-fortune-result/${fortuneId}`);
  };

  return (
    <ChatFortune
      messageScenario={messageScenario}
      characterInfo={characterInfo}
      onComplete={handleComplete}
      fortuneType="연애운"
      resultButtonText="연애운 결과 보기"
      adTitle="연애운 결과"
      cardNumbers={[6, 2, 19]} // 연인, 여사제, 태양 카드만 사용
      cardSelectCount={3}
    />
  );
};

export default LoveFortune;
```

3. **연애운 결과 페이지** (`src/pages/LoveFortuneResult.jsx`)

```jsx
import React from "react";
import { useParams } from "react-router-dom";
import { FortuneResult } from "../components/fortune";
import loveFortuneData from "../data/loveFortune.json";

const LoveFortuneResult = () => {
  const { fortuneId } = useParams();

  return (
    <FortuneResult
      fortuneId={fortuneId}
      apiEndpoint="/api/love-fortune"
      shareEndpoint="/api/love-fortune"
      title="12월 연애운 결과"
      subtitle="선택하신 카드의 연애운을 확인해보세요"
      fortuneDataFile={loveFortuneData}
      sections={{
        cardMeaning: true,
        monthlyForecast: true,
        luckyActions: true,
      }}
      customFields={{
        description: "description",
        monthlyForecast: "lovePredict",
        luckyActions: "tips",
      }}
    />
  );
};

export default LoveFortuneResult;
```

4. **라우터에 등록** (`src/App.js`)

```jsx
<Route path="/love-fortune" element={<LoveFortune />} />
<Route path="/love-fortune-result/:fortuneId" element={<LoveFortuneResult />} />
```

## 컴포넌트 확장 가이드

### 새로운 섹션 추가

FortuneResult 컴포넌트에 새로운 섹션을 추가하려면:

1. `sections` prop에 새 섹션 추가
2. `customFields`에 해당 필드 매핑 추가
3. 컴포넌트 내부에 렌더링 로직 추가

### 다른 캐릭터/테마 적용

- `characterInfo`에 다른 캐릭터 정보 전달
- `cardBackImage`로 테마에 맞는 카드 뒷면 이미지 사용
- CSS 클래스나 테마 변수를 통해 색상/스타일 변경

### 카드 세트 커스터마이징

- `cardNumbers`로 사용할 카드 번호 지정
- 특정 운세에 맞는 카드들만 선별하여 사용 가능

이 컴포넌트들을 활용하면 새로운 운세 콘텐츠를 빠르고 일관성 있게 개발할 수 있습니다.