import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../ui/Navigation';
import CardBack from '../CardBack';
import { toast } from 'sonner';

// 고정 카드 이름 매핑
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
    9: "THE HERMIT (은둑자)",
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

/**
 * 동적 운세 결과 페이지 컴포넌트 - 템플릿 데이터 기반으로 동작
 */
const DynamicFortuneResult = () => {
  const { templateKey, sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // URL에서 sessionId를 가져오거나 localStorage에서 가져오기
        const currentSessionId = sessionId || localStorage.getItem(`fortune_session_${templateKey}`);

        if (!currentSessionId) {
          throw new Error('세션을 찾을 수 없습니다.');
        }

        // 세션 데이터 조회
        const sessionResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/fortune-sessions/${currentSessionId}`
        );
        const sessionData = await sessionResponse.json();

        if (!sessionData.success) {
          throw new Error('세션 데이터를 불러올 수 없습니다.');
        }

        setSession(sessionData.session);
        setTemplate(sessionData.session.template);

      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err.message);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (templateKey) {
      fetchData();
    }
  }, [templateKey, sessionId]);

  // 카드 해석 데이터 가져오기
  const getCardInterpretation = (cardNumber) => {
    // 새로운 박스 시스템
    if (template.resultTemplateData?.cardData) {
      return template.resultTemplateData.cardData[cardNumber.toString()];
    }
    // 기존 시스템 호환성
    if (!template.resultTemplateData?.cards) return null;
    return template.resultTemplateData.cards.find(
      card => card.cardNumber === cardNumber
    );
  };

  // 박스 렌더링
  const renderBox = (box, cardData) => {
    if (!cardData || !cardData[box.id]) return null;

    if (box.type === 'card_description') {
      const boxData = cardData[box.id];
      return (
        <div key={box.id} className="mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CardBack
                cardNumber={session.selectedCard}
                isFlipped={true}
                customBackImage={template.cardConfig?.cardBackImage}
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {getCardDisplayName(session.selectedCard)}
            </h2>
            {boxData?.interpretation && (
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                <p className="text-gray-700 leading-relaxed">{boxData.interpretation}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (box.type === 'fortune_box') {
      const boxData = cardData[box.id];
      const backgroundColor = box.backgroundColor || '#F9FAFB';

      return (
        <div key={box.id} className="mb-6">
          <div
            className="rounded-lg p-6 border"
            style={{ backgroundColor }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {box.title}
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {boxData.content}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  // 섹션별 해석 렌더링 (기존 호환성)
  const renderInterpretationSection = (sectionKey, title, cardData) => {
    if (!cardData || !cardData[sectionKey]) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">{cardData[sectionKey]}</p>
        </div>
      </div>
    );
  };

  // 다시하기 처리
  const handleRestart = () => {
    localStorage.removeItem(`fortune_session_${templateKey}`);
    window.location.href = `/fortune/${templateKey}`;
  };

  // 다른 운세 보기
  const handleOtherFortune = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !session || !template) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-6">{error || '데이터를 찾을 수 없습니다.'}</p>
            <button
              onClick={handleOtherFortune}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cardData = getCardInterpretation(session.selectedCard);
  const layout = template.resultTemplateData?.layout || {};
  const hasNewBoxSystem = layout.boxes && Array.isArray(layout.boxes);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="flex-1 max-w-md mx-auto w-full p-6">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {template.title} 결과
          </h1>
          {session.userProfile?.birthDate && (
            <p className="text-gray-600">
              {new Date(session.userProfile.birthDate).toLocaleDateString('ko-KR')} 생 •
              {session.userProfile.gender} •
              {session.userProfile.mbti}
            </p>
          )}
        </div>

        {/* 새로운 박스 시스템 */}
        {hasNewBoxSystem ? (
          <div>
            {layout.boxes
              .sort((a, b) => a.order - b.order)
              .map(box => renderBox(box, cardData))}
          </div>
        ) : (
          // 기존 시스템 호환성
          <>
            {/* 선택한 카드 표시 */}
            {layout.showCardImage !== false && (
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <CardBack
                    cardNumber={session.selectedCard}
                    isFlipped={true}
                    customBackImage={template.cardConfig?.cardBackImage}
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {getCardDisplayName(session.selectedCard)}
                </h2>
              </div>
            )}

            {/* 기본 해석 */}
            {layout.showInterpretation !== false && cardData?.interpretation && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">카드의 의미</h3>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                  <p className="text-gray-700 leading-relaxed">{cardData.interpretation}</p>
                </div>
              </div>
            )}

            {/* 섹션별 해석 */}
            {layout.sections?.map(section => {
              const titles = {
                love: '💕 연애운',
                career: '💼 직업운',
                money: '💰 재물운',
                health: '🌿 건강운',
                study: '📚 학업운'
              };

              return renderInterpretationSection(
                section,
                titles[section] || section,
                cardData
              );
            })}
          </>
        )}

        {/* 액션 버튼들 */}
        <div className="mt-12 space-y-4">
          <button
            onClick={handleRestart}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
          >
            다시 해보기
          </button>

          <button
            onClick={handleOtherFortune}
            className="w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            다른 운세 보기
          </button>
        </div>

        {/* 공유 섹션 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            친구들에게 {template.title}을 추천해보세요!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${template.title} 결과`,
                    text: `나의 ${template.title} 결과를 확인해보세요!`,
                    url: window.location.origin + `/fortune/${templateKey}`
                  });
                } else {
                  navigator.clipboard.writeText(window.location.origin + `/fortune/${templateKey}`);
                  toast.success('링크가 복사되었습니다!');
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              링크 공유
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFortuneResult;