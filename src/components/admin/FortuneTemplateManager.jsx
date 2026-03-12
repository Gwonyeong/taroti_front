import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

// 박스 레이아웃 편집 컴포넌트
const BoxLayoutEditor = ({ layout, onLayoutChange }) => {
  const [boxes, setBoxes] = useState(layout?.boxes || []);
  const [editingBox, setEditingBox] = useState(null);
  const [showAddBox, setShowAddBox] = useState(false);

  // layout이 변경될 때 boxes 상태 업데이트
  useEffect(() => {
    setBoxes(layout?.boxes || []);
  }, [layout]);

  const addBox = () => {
    const newBox = {
      id: `box_${Date.now()}`,
      type: 'fortune_box',
      order: boxes.length + 1,
      title: '새 운세 박스',
      backgroundColor: '#F9FAFB'
    };
    const updatedBoxes = [...boxes, newBox];
    setBoxes(updatedBoxes);
    onLayoutChange({ boxes: updatedBoxes });
    setShowAddBox(false);
  };

  const updateBox = (boxId, updates) => {
    const updatedBoxes = boxes.map(box =>
      box.id === boxId ? { ...box, ...updates } : box
    );
    setBoxes(updatedBoxes);
    onLayoutChange({ boxes: updatedBoxes });
  };

  const deleteBox = (boxId) => {
    const updatedBoxes = boxes.filter(box => box.id !== boxId);
    // 순서 재정렬
    updatedBoxes.forEach((box, index) => {
      box.order = index + 1;
    });
    setBoxes(updatedBoxes);
    onLayoutChange({ boxes: updatedBoxes });
  };

  const moveBox = (boxId, direction) => {
    const index = boxes.findIndex(box => box.id === boxId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === boxes.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedBoxes = [...boxes];
    [updatedBoxes[index], updatedBoxes[newIndex]] = [updatedBoxes[newIndex], updatedBoxes[index]];

    // 순서 업데이트
    updatedBoxes.forEach((box, i) => {
      box.order = i + 1;
    });

    setBoxes(updatedBoxes);
    onLayoutChange({ boxes: updatedBoxes });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-sm font-medium">박스 레이아웃 설정</h5>
        <button
          type="button"
          onClick={() => setShowAddBox(true)}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          박스 추가
        </button>
      </div>

      {/* 박스 목록 */}
      <div className="space-y-2">
        {boxes.map((box, index) => (
          <div key={box.id} className="border rounded p-3 bg-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {index + 1}번째
                  </span>
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                    {box.type === 'card_description' ? '카드 설명' : '운세 박스'}
                  </span>
                </div>

                {editingBox === box.id ? (
                  <div className="space-y-2 mt-2">
                    <input
                      type="text"
                      value={box.title || ''}
                      onChange={(e) => updateBox(box.id, { title: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="박스 제목"
                    />
                    {box.type === 'fortune_box' && (
                      <input
                        type="color"
                        value={box.backgroundColor || '#FFFFFF'}
                        onChange={(e) => updateBox(box.id, { backgroundColor: e.target.value })}
                        className="w-full h-8"
                        title="배경색"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingBox(null)}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                    >
                      완료
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{box.title}</span>
                    {box.type === 'fortune_box' && box.backgroundColor && (
                      <span
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: box.backgroundColor }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveBox(box.id, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  title="위로"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBox(box.id, 'down')}
                  disabled={index === boxes.length - 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  title="아래로"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBox(box.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="편집"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={() => deleteBox(box.id)}
                  className="p-1 hover:bg-red-100 rounded text-red-500"
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 박스 추가 모달 */}
      {showAddBox && (
        <div className="border-2 border-dashed border-blue-300 rounded p-4 bg-blue-50">
          <h6 className="text-sm font-medium mb-2">새 박스 추가</h6>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                const newBox = {
                  id: `box_${Date.now()}`,
                  type: 'card_description',
                  order: boxes.length + 1,
                  title: '카드 설명'
                };
                setBoxes([...boxes, newBox]);
                onLayoutChange({ boxes: [...boxes, newBox] });
                setShowAddBox(false);
              }}
              className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
            >
              카드 설명 박스 추가
            </button>
            <button
              type="button"
              onClick={addBox}
              className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              운세 박스 추가
            </button>
            <button
              type="button"
              onClick={() => setShowAddBox(false)}
              className="w-full px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 카드별 데이터 입력 컴포넌트
const CardDataEditor = ({ cardData, layout, onCardDataChange }) => {
  const [selectedBox, setSelectedBox] = useState('');
  const [boxDataJson, setBoxDataJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [currentCardData, setCurrentCardData] = useState(cardData || {});

  // 박스 선택 시 해당 박스의 데이터를 JSON으로 표시
  useEffect(() => {
    if (selectedBox && currentCardData) {
      // 모든 카드의 해당 박스 데이터 추출
      const boxData = {};
      for (let i = 0; i < 22; i++) {
        const cardKey = i.toString();
        if (currentCardData[cardKey] && currentCardData[cardKey][selectedBox]) {
          boxData[cardKey] = currentCardData[cardKey][selectedBox];
        }
      }
      setBoxDataJson(JSON.stringify(boxData, null, 2));
    }
  }, [selectedBox, currentCardData]);

  const updateBoxData = () => {
    try {
      const parsed = JSON.parse(boxDataJson);
      const updatedData = { ...currentCardData };

      // 각 카드별로 박스 데이터 업데이트
      Object.keys(parsed).forEach(cardKey => {
        if (!updatedData[cardKey]) {
          updatedData[cardKey] = {};
        }
        updatedData[cardKey][selectedBox] = parsed[cardKey];
      });

      setCurrentCardData(updatedData);
      onCardDataChange(updatedData);
      setJsonError('');
      toast.success('데이터가 저장되었습니다.');
    } catch (err) {
      setJsonError('JSON 형식이 올바르지 않습니다: ' + err.message);
    }
  };

  // 선택된 박스의 예시 JSON 생성
  const getExampleJson = (box) => {
    if (!box) return '{}';

    if (box.type === 'card_description') {
      return `{
  "0": {
    "interpretation": "새로운 시작과 순수한 마음을 상징하는 카드입니다. 용기를 가지고 첫 걸음을 내디딘 때입니다."
  },
  "1": {
    "interpretation": "의지와 창조력을 나타내는 카드입니다. 목표를 이루기 위한 능력과 자원을 모두 갖추고 있습니다."
  },
  "2": {
    "interpretation": "직관과 내면의 지혜를 상징하는 카드입니다. 마음의 목소리에 귀 기울일 때입니다."
  }
  // ... 21번 카드까지
}`;
    } else {
      return `{
  "0": {
    "content": "12월의 ${box.title || '운세'}는 새로운 시작의 에너지가 가득합니다..."
  },
  "1": {
    "content": "12월의 ${box.title || '운세'}는 당신의 능력이 빛을 발하는 시기입니다..."
  },
  "2": {
    "content": "12월의 ${box.title || '운세'}는 내면의 지혜에 의지할 때입니다..."
  }
  // ... 21번 카드까지
}`;
    }
  };

  if (!layout?.boxes?.length) {
    return (
      <div className="text-sm text-gray-500">
        먼저 박스 레이아웃을 설정해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">박스 선택:</label>
        <select
          value={selectedBox}
          onChange={(e) => setSelectedBox(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">박스를 선택하세요</option>
          {layout.boxes.map(box => (
            <option key={box.id} value={box.id}>
              {box.title} ({box.type === 'card_description' ? '카드 설명' : '운세 박스'})
            </option>
          ))}
        </select>
      </div>

      {selectedBox && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">카드별 데이터 (JSON):</label>
              <button
                type="button"
                onClick={updateBoxData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                데이터 저장
              </button>
            </div>

            <div className="mb-2">
              <details className="text-xs text-gray-600">
                <summary className="cursor-pointer hover:text-gray-800">📝 입력 예시 보기</summary>
                <pre className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
                  {getExampleJson(layout.boxes.find(b => b.id === selectedBox))}
                </pre>
              </details>
            </div>

            <textarea
              value={boxDataJson}
              onChange={(e) => setBoxDataJson(e.target.value)}
              className="w-full px-3 py-2 border rounded font-mono text-sm"
              rows="20"
              placeholder="카드별 데이터를 JSON 형식으로 입력하세요"
            />

            {jsonError && (
              <p className="text-red-600 text-xs mt-1">⚠️ {jsonError}</p>
            )}
          </div>

          <div className="text-xs text-gray-500">
            <p>💡 팁:</p>
            <ul className="list-disc list-inside ml-2">
              <li>카드 번호는 0부터 21까지입니다</li>
              <li>모든 카드를 입력할 필요는 없습니다</li>
              <li>입력하지 않은 카드는 기본값이 표시됩니다</li>
            </ul>
          </div>
        </div>
      )}

      {/* AI 프롬프트 생성기 */}
      {selectedBox && (
        <AIPromptGenerator
          selectedBox={layout.boxes.find(box => box.id === selectedBox)}
          onGeneratedPrompt={(prompt) => {
            navigator.clipboard.writeText(prompt).then(() => {
              toast.success('프롬프트가 클립보드에 복사되었습니다!');
            }).catch(() => {
              toast.error('복사에 실패했습니다.');
            });
          }}
        />
      )}
    </div>
  );
};

// AI 프롬프트 생성기 컴포넌트
const AIPromptGenerator = ({ selectedBox, onGeneratedPrompt }) => {
  const [subject, setSubject] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const generatePrompt = () => {
    if (!subject.trim()) {
      toast.error('주제를 입력해주세요.');
      return;
    }

    const boxType = selectedBox?.type;
    const boxTitle = selectedBox?.title || '';

    // 카드 기본 정보
    const cardInfo = `
타로카드 정보:
- 0: 바보 (The Fool) - 새로운 시작, 순수함, 모험
- 1: 마법사 (The Magician) - 의지력, 창조력, 기술
- 2: 여사제 (The High Priestess) - 직감, 내면의 지혜, 신비
- 3: 여황제 (The Empress) - 풍요, 창조성, 모성
- 4: 황제 (The Emperor) - 권위, 안정성, 질서
- 5: 교황 (The Hierophant) - 전통, 영성, 가르침
- 6: 연인 (The Lovers) - 사랑, 선택, 조화
- 7: 전차 (The Chariot) - 의지력, 승리, 통제
- 8: 힘 (Strength) - 내적 힘, 용기, 인내
- 9: 은둔자 (The Hermit) - 내적 탐구, 지혜, 고독
- 10: 운명의 수레바퀴 (Wheel of Fortune) - 운명, 변화, 기회
- 11: 정의 (Justice) - 공정함, 균형, 결과
- 12: 매달린 사람 (The Hanged Man) - 희생, 관점 변화, 기다림
- 13: 죽음 (Death) - 변화, 끝과 시작, 재생
- 14: 절제 (Temperance) - 조화, 균형, 치유
- 15: 악마 (The Devil) - 유혹, 속박, 물질주의
- 16: 탑 (The Tower) - 급변, 깨달음, 파괴와 재건
- 17: 별 (The Star) - 희망, 영감, 치유
- 18: 달 (The Moon) - 환상, 직감, 무의식
- 19: 태양 (The Sun) - 성공, 기쁨, 활력
- 20: 심판 (Judgement) - 재생, 용서, 각성
- 21: 세계 (The World) - 완성, 성취, 통합`;

    let prompt = '';

    if (boxType === 'card_description') {
      prompt = `다음 지침에 따라 타로카드 해석 데이터를 JSON 형식으로 생성해주세요.

주제: ${subject}

${cardInfo}

요구사항:
1. 각 카드(0-21)에 대해 "${subject}" 관점에서의 해석을 작성
2. 각 해석은 2-3문장으로 구성
3. 카드의 본래 의미와 ${subject} 주제를 연결
4. 긍정적이고 희망적인 톤으로 작성
5. 구체적이고 실용적인 조언 포함

출력 형식:
\`\`\`json
{
  "0": {
    "interpretation": "바보 카드와 ${subject}에 대한 해석..."
  },
  "1": {
    "interpretation": "마법사 카드와 ${subject}에 대한 해석..."
  },
  ...
  "21": {
    "interpretation": "세계 카드와 ${subject}에 대한 해석..."
  }
}
\`\`\``;
    } else {
      prompt = `다음 지침에 따라 "${boxTitle}" 운세 데이터를 JSON 형식으로 생성해주세요.

주제: ${subject}

${cardInfo}

요구사항:
1. 각 카드(0-21)에 대해 "${subject}"와 관련된 "${boxTitle}" 운세를 작성
2. 각 운세는 3-4문장으로 구성
3. 카드의 의미를 "${subject}" 맥락에서 해석
4. 구체적인 조언과 실천 방법 포함
5. 긍정적이고 격려하는 톤으로 작성
6. 12월 또는 특정 시기와 연관지어 작성

출력 형식:
\`\`\`json
{
  "0": {
    "content": "바보 카드가 나타내는 ${subject} 관련 ${boxTitle}..."
  },
  "1": {
    "content": "마법사 카드가 나타내는 ${subject} 관련 ${boxTitle}..."
  },
  ...
  "21": {
    "content": "세계 카드가 나타내는 ${subject} 관련 ${boxTitle}..."
  }
}
\`\`\``;
    }

    setGeneratedPrompt(prompt);
  };

  const copyPrompt = () => {
    if (generatedPrompt) {
      onGeneratedPrompt(generatedPrompt);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
      <h5 className="text-sm font-semibold text-purple-800 mb-3">🤖 AI 프롬프트 생성기</h5>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            주제 입력 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="예: 연애운, 취업운, 건강운, 재물운 등"
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="text-xs text-gray-600 mt-1">
            선택한 박스: <span className="font-medium">{selectedBox?.title}</span>
            ({selectedBox?.type === 'card_description' ? '카드 설명' : '운세 박스'})
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={generatePrompt}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
          >
            프롬프트 생성
          </button>

          {generatedPrompt && (
            <button
              type="button"
              onClick={copyPrompt}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              📋 복사하기
            </button>
          )}
        </div>

        {generatedPrompt && (
          <div>
            <label className="block text-sm font-medium mb-2">생성된 프롬프트:</label>
            <textarea
              value={generatedPrompt}
              readOnly
              className="w-full h-48 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono resize-none"
            />
            <p className="text-xs text-gray-600 mt-2">
              💡 이 프롬프트를 ChatGPT나 Claude에 붙여넣어서 사용하세요.
              생성된 JSON을 위의 데이터 입력란에 붙여넣으면 됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// 사주 오행 및 변형 설정
const FIVE_ELEMENTS = ['목', '화', '토', '금', '수'];
const VARIATION_COUNT = 10; // 오행당 변형 수
const VARIATION_INDICES = Array.from({ length: VARIATION_COUNT }, (_, i) => i); // [0, 1, ..., 9]

// 하위호환: 기존 25조합 키 (dominantElement × dayElement.stem)
const SAJU_KEYS = FIVE_ELEMENTS.flatMap(dominant =>
  FIVE_ELEMENTS.map(dayStem => `${dominant}_${dayStem}`)
);

const getSajuKeyLabel = (key) => {
  const [dominant, dayStem] = key.split('_');
  return `주오행: ${dominant} / 일간: ${dayStem}`;
};

// 사주 데이터 에디터 컴포넌트 (5×10 랜덤 변형 방식)
const SajuDataEditor = ({ sajuData, layout, onSajuDataChange }) => {
  const [selectedBox, setSelectedBox] = useState('');
  const [selectedDominant, setSelectedDominant] = useState('목');
  const [currentSajuData, setCurrentSajuData] = useState(sajuData || {});
  const [editMode, setEditMode] = useState('individual'); // 'individual' | 'json'
  const [bulkJson, setBulkJson] = useState('');
  const [jsonError, setJsonError] = useState('');

  // 오행별 색상
  const elementColors = {
    '목': { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' },
    '화': { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B' },
    '토': { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E' },
    '금': { bg: '#F5F5F4', border: '#A8A29E', text: '#44403C' },
    '수': { bg: '#EFF6FF', border: '#93C5FD', text: '#1E40AF' },
  };

  // 개별 콘텐츠 업데이트 (신규 배열 구조: sajuData[오행][인덱스][boxId])
  const updateContent = (element, variationIndex, content) => {
    const updated = { ...currentSajuData };
    if (!updated[element]) updated[element] = [];
    if (!updated[element][variationIndex]) updated[element][variationIndex] = {};
    updated[element][variationIndex][selectedBox] = { content };
    setCurrentSajuData(updated);
    onSajuDataChange(updated);
  };

  // JSON 일괄 적용 (신규 구조)
  const applyBulkJson = () => {
    try {
      const parsed = JSON.parse(bulkJson);
      const updated = { ...currentSajuData };
      Object.keys(parsed).forEach(element => {
        if (!FIVE_ELEMENTS.includes(element)) return;
        if (!Array.isArray(parsed[element])) return;
        if (!updated[element]) updated[element] = [];
        parsed[element].forEach((variation, idx) => {
          if (!updated[element][idx]) updated[element][idx] = {};
          updated[element][idx][selectedBox] = variation;
        });
      });
      setCurrentSajuData(updated);
      onSajuDataChange(updated);
      setJsonError('');
      const totalCount = Object.keys(parsed).reduce((sum, el) => sum + (Array.isArray(parsed[el]) ? parsed[el].length : 0), 0);
      toast.success(`${totalCount}개 변형이 적용되었습니다.`);
    } catch (err) {
      setJsonError('JSON 형식이 올바르지 않습니다: ' + err.message);
    }
  };

  // 현재 박스의 데이터를 JSON으로 추출
  const exportCurrentBoxJson = () => {
    const boxData = {};
    FIVE_ELEMENTS.forEach(element => {
      if (currentSajuData[element]) {
        boxData[element] = VARIATION_INDICES.map(idx => {
          return currentSajuData[element]?.[idx]?.[selectedBox] || { content: '' };
        });
      }
    });
    setBulkJson(JSON.stringify(boxData, null, 2));
  };

  // 입력 현황 카운트 (오행별)
  const getFilledCount = (element) => {
    if (!selectedBox) return 0;
    return VARIATION_INDICES.filter(idx =>
      currentSajuData[element]?.[idx]?.[selectedBox]?.content
    ).length;
  };

  const getTotalFilledCount = () => {
    if (!selectedBox) return 0;
    return FIVE_ELEMENTS.reduce((sum, element) => sum + getFilledCount(element), 0);
  };

  const TOTAL_ITEMS = FIVE_ELEMENTS.length * VARIATION_COUNT; // 50

  if (!layout?.boxes?.length) {
    return (
      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded">
        먼저 "박스 레이아웃" 탭에서 박스를 추가해주세요.
      </div>
    );
  }

  const fortuneBoxes = layout.boxes.filter(b => b.type === 'fortune_box');
  if (!fortuneBoxes.length) {
    return (
      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded">
        "박스 레이아웃" 탭에서 운세 박스를 추가해주세요.
      </div>
    );
  }

  const totalFilled = getTotalFilledCount();

  return (
    <div className="space-y-4">
      {/* 안내 문구 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        주요 오행(5) × 변형(10) = 총 50개 콘텐츠를 입력합니다. 같은 사용자도 접속할 때마다 랜덤으로 다른 결과를 봅니다.
      </div>

      {/* 박스 선택 */}
      <div>
        <label className="block text-sm font-medium mb-2">결과 박스 선택:</label>
        <div className="flex gap-2 flex-wrap">
          {fortuneBoxes.map(box => (
            <button
              key={box.id}
              type="button"
              onClick={() => { setSelectedBox(box.id); setEditMode('individual'); }}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedBox === box.id
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {box.title}
              {selectedBox === box.id && (
                <span className="ml-1 text-xs">
                  ({FIVE_ELEMENTS.reduce((sum, el) => sum + VARIATION_INDICES.filter(idx => currentSajuData[el]?.[idx]?.[box.id]?.content).length, 0)}/{TOTAL_ITEMS})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedBox && (
        <>
          {/* 현황 바 */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="text-sm">
              입력 현황:{' '}
              <span className={totalFilled === TOTAL_ITEMS ? 'text-green-600 font-bold' : 'text-orange-600 font-medium'}>
                {totalFilled}/{TOTAL_ITEMS}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditMode('individual')}
                className={`px-3 py-1 text-xs rounded ${
                  editMode === 'individual' ? 'bg-blue-500 text-white' : 'bg-white border text-gray-600'
                }`}
              >
                개별 입력
              </button>
              <button
                type="button"
                onClick={() => { setEditMode('json'); exportCurrentBoxJson(); }}
                className={`px-3 py-1 text-xs rounded ${
                  editMode === 'json' ? 'bg-blue-500 text-white' : 'bg-white border text-gray-600'
                }`}
              >
                JSON 일괄
              </button>
            </div>
          </div>

          {editMode === 'individual' ? (
            <>
              {/* 주오행 탭 */}
              <div className="flex gap-1">
                {FIVE_ELEMENTS.map(el => {
                  const filled = getFilledCount(el);
                  const colors = elementColors[el];
                  return (
                    <button
                      key={el}
                      type="button"
                      onClick={() => setSelectedDominant(el)}
                      className={`flex-1 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-colors ${
                        selectedDominant === el
                          ? 'text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                      style={selectedDominant === el ? {
                        backgroundColor: colors.text,
                        borderColor: colors.text,
                      } : {}}
                    >
                      {el}({filled}/{VARIATION_COUNT})
                    </button>
                  );
                })}
              </div>

              {/* 변형별 입력 카드 */}
              <div
                className="border rounded-b-lg p-4 space-y-4"
                style={{
                  borderColor: elementColors[selectedDominant].border,
                  backgroundColor: elementColors[selectedDominant].bg,
                }}
              >
                <p className="text-xs font-medium" style={{ color: elementColors[selectedDominant].text }}>
                  주오행 "{selectedDominant}" — 랜덤 변형 콘텐츠 ({VARIATION_COUNT}개)
                </p>

                {VARIATION_INDICES.map(idx => {
                  const content = currentSajuData[selectedDominant]?.[idx]?.[selectedBox]?.content || '';

                  return (
                    <div key={`${selectedDominant}_${idx}`} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="inline-block px-2 py-0.5 text-xs font-bold rounded"
                          style={{ backgroundColor: elementColors[selectedDominant].bg, color: elementColors[selectedDominant].text, border: `1px solid ${elementColors[selectedDominant].border}` }}
                        >
                          {selectedDominant}
                        </span>
                        <span className="text-gray-600 text-sm font-medium">
                          변형 {idx + 1}
                        </span>
                        <span className="ml-auto">
                          {content && <span className="text-green-500 text-xs">입력됨</span>}
                        </span>
                      </div>
                      <textarea
                        value={content}
                        onChange={(e) => updateContent(selectedDominant, idx, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        rows="3"
                        placeholder={`주오행 ${selectedDominant} 사용자의 "${layout.boxes.find(b => b.id === selectedBox)?.title}" 변형 ${idx + 1} 내용을 입력하세요...`}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* JSON 일괄 입력 모드 */
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  5개 오행 × {VARIATION_COUNT}개 변형의 JSON을 한번에 붙여넣어 적용할 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={applyBulkJson}
                  className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  JSON 적용
                </button>
              </div>

              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                className="w-full px-3 py-2 border rounded font-mono text-sm"
                rows="18"
                placeholder={`{
  "목": [
    { "content": "변형 1 내용..." },
    { "content": "변형 2 내용..." },
    ...
    { "content": "변형 10 내용..." }
  ],
  "화": [ ... ],
  "토": [ ... ],
  "금": [ ... ],
  "수": [ ... ]
}`}
              />

              {jsonError && (
                <p className="text-red-600 text-xs">⚠️ {jsonError}</p>
              )}
            </div>
          )}

          {/* 사주 프롬프트 생성기 */}
          <SajuPromptGenerator
            selectedBox={layout.boxes.find(box => box.id === selectedBox)}
            onGeneratedPrompt={(prompt) => {
              navigator.clipboard.writeText(prompt).then(() => {
                toast.success('프롬프트가 클립보드에 복사되었습니다!');
              }).catch(() => {
                toast.error('복사에 실패했습니다.');
              });
            }}
          />
        </>
      )}
    </div>
  );
};

// 사주 AI 프롬프트 생성기 (5×10 랜덤 변형 방식)
const SajuPromptGenerator = ({ selectedBox, onGeneratedPrompt }) => {
  const [subject, setSubject] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const generatePrompt = () => {
    if (!subject.trim()) {
      toast.error('주제를 입력해주세요.');
      return;
    }

    const boxTitle = selectedBox?.title || '';

    const prompt = `다음 지침에 따라 사주 기반 "${boxTitle}" 데이터를 JSON 형식으로 생성해주세요.

주제: ${subject}

사주 오행별 성격 특성 (내부 참고용, 결과에 오행 용어를 직접 노출하지 마세요):
- 목(木) 기질: 성장 지향적, 창의적, 인자함, 새로운 시도를 좋아함
- 화(火) 기질: 열정적, 표현력이 좋음, 사교적, 에너지가 넘침
- 토(土) 기질: 안정적, 신뢰감, 포용력, 중재 능력이 뛰어남
- 금(金) 기질: 결단력, 의리, 정의감, 깔끔하고 체계적
- 수(水) 기질: 지혜롭고 유연함, 적응력, 관찰력이 뛰어남

구조:
- 키: 주요 오행 ("목", "화", "토", "금", "수")
- 주요 오행: 사주에서 가장 강한 기운 → 삶 전반의 흐름, 성격, 환경
- 각 오행마다 10개의 서로 다른 변형(variation)을 배열로 작성
- 총 50개 콘텐츠 (5개 오행 × 10개 변형)
- 같은 오행 사용자가 여러 번 접속해도 매번 다른 결과를 보여주기 위한 랜덤 변형 구조

중요 요구사항:
1. 5개 오행 각각에 대해 10개씩, 총 50개의 "${subject}" 관점의 "${boxTitle}" 내용을 작성
2. 각 내용은 4-5문장으로 구성
3. **절대로 "주오행이 X인 당신은", "상생 관계로", "목 기운이 강한" 같은 사주 용어를 사용하지 마세요**
4. 대신 해당 오행이 만들어내는 **성격, 성향, 상황**을 자연스러운 일상 언어로 풀어서 작성
5. 마치 친한 점술가가 이야기하듯 자연스럽고 따뜻한 톤으로 작성
6. 구체적이고 실용적인 조언 포함
7. 같은 오행 내 10개 변형이 서로 충분히 다르게 작성 (복붙 느낌 금지)

좋은 예: "요즘 새로운 도전을 하고 싶은 마음이 강하시죠? 그 에너지를 잘 활용하면..."
나쁜 예: "주오행이 목인 당신은 목 기운이 강하여..."

출력 형식 (반드시 이 JSON 구조를 따르세요):
\`\`\`json
{
  "목": [
    { "content": "${subject}에 대한 자연스러운 운세 내용 변형1..." },
    { "content": "${subject}에 대한 자연스러운 운세 내용 변형2..." },
    { "content": "변형3..." },
    { "content": "변형4..." },
    { "content": "변형5..." },
    { "content": "변형6..." },
    { "content": "변형7..." },
    { "content": "변형8..." },
    { "content": "변형9..." },
    { "content": "변형10..." }
  ],
  "화": [
    { "content": "..." },
    { "content": "..." },
    { "content": "..." },
    { "content": "..." },
    { "content": "..." },
    { "content": "..." },
    { "content": "..." },
    { "content": "..." },
    { "content": "..." },
    { "content": "..." }
  ],
  "토": [ "... 10개 변형" ],
  "금": [ "... 10개 변형" ],
  "수": [ "... 10개 변형" ]
}
\`\`\``;

    setGeneratedPrompt(prompt);
  };

  const copyPrompt = () => {
    if (generatedPrompt) {
      onGeneratedPrompt(generatedPrompt);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
      <h5 className="text-sm font-semibold text-purple-800 mb-3">🤖 사주 AI 프롬프트 생성기</h5>
      <p className="text-xs text-gray-600 mb-3">
        오행별 10개 변형 콘텐츠(총 50개)를 AI로 한번에 생성합니다. 생성된 프롬프트를 ChatGPT/Claude에 붙여넣으세요.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            주제 입력 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="예: 2026년 상반기 연애운, 올해 재물운, 직장 운세 등"
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="text-xs text-gray-600 mt-1">
            선택한 박스: <span className="font-medium">{selectedBox?.title}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={generatePrompt}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
          >
            프롬프트 생성
          </button>

          {generatedPrompt && (
            <button
              type="button"
              onClick={copyPrompt}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              복사하기
            </button>
          )}
        </div>

        {generatedPrompt && (
          <div>
            <label className="block text-sm font-medium mb-2">생성된 프롬프트:</label>
            <textarea
              value={generatedPrompt}
              readOnly
              className="w-full h-48 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono resize-none"
            />
            <p className="text-xs text-gray-600 mt-2">
              💡 이 프롬프트를 ChatGPT나 Claude에 붙여넣어서 사용하세요.
              생성된 JSON을 위의 데이터 입력란에 붙여넣으면 됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// 이미지 미리보기 컴포넌트
const ImagePreview = ({ imageUrl }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  if (imageError) {
    return (
      <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xs">이미지 로딩 실패</div>
          <div className="text-gray-400 text-xs">URL을 확인해주세요</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!imageLoaded && (
        <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
          <div className="text-gray-400 text-xs">로딩 중...</div>
        </div>
      )}
      <img
        src={imageUrl}
        alt="미리보기"
        className={`w-32 h-32 object-cover rounded-md border ${!imageLoaded ? 'absolute opacity-0' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageError ? 'none' : 'block' }}
      />
    </div>
  );
};

const FortuneTemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resultTabMode, setResultTabMode] = useState('layout'); // 'layout', 'data', 'json'
  const [templateType, setTemplateType] = useState('default'); // 'default' 또는 'mini'

  // 폼 상태
  const [formData, setFormData] = useState({
    templateKey: '',
    title: '',
    description: '',
    category: 'special',
    type: 'default',
    imageUrl: '',
    requiredFields: ['birthDate', 'gender', 'mbti'],
    characterId: null,
    characterInfo: {
      name: '',
      imageSrc: ''
    },
    messageScenarios: {
      withProfile: [
        { text: '12월의 운세를 봐줄거래!', sender: 'bot' },
        { text: '바로 카드를 뽑아보고래!', sender: 'bot', showCardSelect: true }
      ],
      needsProfile: [
        { text: '12월의 운세를 봐줄거래!', sender: 'bot' },
        { text: '먼저 생년월일을 알려줘~', sender: 'bot', showUserInput: 'birthDate' },
        { text: '성별도 알려줘!', sender: 'bot', showUserInput: 'gender' },
        { text: 'MBTI도 궁금해!', sender: 'bot', showUserInput: 'mbti' },
        { text: '좋아! 이제 카드를 뽑아보고래!', sender: 'bot', showCardSelect: true }
      ]
    },
    cardConfig: {
      cardNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      cardSelectCount: 3,
      cardBackImage: '/images/cards/back/camp_band.jpeg'
    },
    fortuneSettings: {
      fortuneType: '운세',
      resultButtonText: '운세 결과 보기',
      adTitle: '운세 결과'
    },
    resultTemplateData: {
      layout: { boxes: [] },
      cardData: {}
    },
    theme: {
      primaryColor: '#4F46E5',
      secondaryColor: '#7C3AED',
      backgroundColor: '#ffffff'
    },
    isPremium: false,
    isActive: true,
    sortOrder: 0
  });

  // API 기본 URL
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

  // 파일 업로드 함수
  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE}/api/fortune-templates/upload-image`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Supabase URL은 이미 완전한 URL이므로 그대로 사용
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        toast.success('이미지가 업로드되었습니다.');
        return data.imageUrl;
      } else {
        throw new Error(data.message || '업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast.error('이미지 업로드에 실패했습니다.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // 캐릭터 목록 조회
  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/characters`);
      if (response.ok) {
        const data = await response.json();
        setCharacters(data.characters);
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  // 템플릿 목록 조회
  const fetchTemplates = async (type = templateType) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/fortune-templates?includeInactive=true&type=${type}`);

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      } else {
        throw new Error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('템플릿 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 템플릿 생성
  const handleCreateTemplate = async () => {
    try {
      if (!formData.templateKey || !formData.title) {
        toast.error('템플릿 키와 제목은 필수입니다.');
        return;
      }

      // 공백 검증
      if (/\s/.test(formData.templateKey)) {
        toast.error('템플릿 키에 공백을 포함할 수 없습니다.');
        return;
      }

      const response = await fetch(`${API_BASE}/api/fortune-templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('템플릿이 생성되었습니다.');
        await fetchTemplates();
        setShowCreateForm(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.message || '템플릿 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('템플릿 생성 중 오류가 발생했습니다.');
    }
  };

  // 템플릿 수정
  const handleUpdateTemplate = async () => {
    try {
      if (!selectedTemplate) return;


      const response = await fetch(`${API_BASE}/api/fortune-templates/${selectedTemplate.templateKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('템플릿이 수정되었습니다.');
        await fetchTemplates();
        setIsEditing(false);
        setSelectedTemplate(null);
      } else {
        const error = await response.json();
        toast.error(error.message || '템플릿 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('템플릿 수정 중 오류가 발생했습니다.');
    }
  };

  // 템플릿 삭제
  const handleDeleteTemplate = async (templateKey) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/fortune-templates/${templateKey}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('템플릿이 삭제되었습니다.');
        await fetchTemplates();
      } else {
        const error = await response.json();
        toast.error(error.message || '템플릿 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('템플릿 삭제 중 오류가 발생했습니다.');
    }
  };

  // 폼 초기화
  const resetForm = () => {
    const isSaju = templateType === 'saju';
    setFormData({
      templateKey: '',
      title: '',
      description: '',
      category: 'special',
      type: templateType,
      imageUrl: '',
      requiredFields: isSaju
        ? ['birthDate', 'birthCalendarType', 'birthTime', 'gender']
        : ['birthDate', 'gender', 'mbti'],
      characterInfo: {
        name: '',
        imageSrc: ''
      },
      messageScenarios: isSaju
        ? {
            withProfile: [
              { text: '사주를 봐드릴게요!', sender: 'bot' },
              { text: '양력/음력을 확인할게요~', sender: 'bot', showUserInput: 'birthCalendarType' },
              { text: '태어난 시간도 알려주세요!', sender: 'bot', showUserInput: 'birthTime' },
              { text: '좋아요! 사주를 분석해볼게요!', sender: 'bot' }
            ],
            needsProfile: [
              { text: '사주를 봐드릴게요!', sender: 'bot' },
              { text: '먼저 생년월일을 알려주세요~', sender: 'bot', showUserInput: 'birthDate' },
              { text: '양력인가요, 음력인가요?', sender: 'bot', showUserInput: 'birthCalendarType' },
              { text: '성별도 알려주세요!', sender: 'bot', showUserInput: 'gender' },
              { text: '태어난 시간을 알려주세요!', sender: 'bot', showUserInput: 'birthTime' },
              { text: '좋아요! 사주를 분석해볼게요!', sender: 'bot' }
            ]
          }
        : {
            withProfile: [
              { text: '12월의 운세를 봐줄거래!', sender: 'bot' },
              { text: '바로 카드를 뽑아보고래!', sender: 'bot', showCardSelect: true }
            ],
            needsProfile: [
              { text: '12월의 운세를 봐줄거래!', sender: 'bot' },
              { text: '먼저 생년월일을 알려줘~', sender: 'bot', showUserInput: 'birthDate' },
              { text: '성별도 알려줘!', sender: 'bot', showUserInput: 'gender' },
              { text: 'MBTI도 궁금해!', sender: 'bot', showUserInput: 'mbti' },
              { text: '좋아! 이제 카드를 뽑아보고래!', sender: 'bot', showCardSelect: true }
            ]
          },
      cardConfig: isSaju
        ? {}
        : {
            cardNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
            cardSelectCount: 3,
            cardBackImage: '/images/cards/back/camp_band.jpeg'
          },
      fortuneSettings: {
        fortuneType: isSaju ? '사주' : '운세',
        resultButtonText: isSaju ? '사주 결과 보기' : '운세 결과 보기',
        adTitle: isSaju ? '사주 결과' : '운세 결과'
      },
      resultTemplateData: {
        layout: { boxes: [] },
        cardData: {}
      },
      theme: {
        primaryColor: '#4F46E5',
        secondaryColor: '#7C3AED',
        backgroundColor: '#ffffff'
      },
      isPremium: false,
      isActive: true,
      sortOrder: 0
    });
  };

  // 템플릿 편집 시작
  const startEditing = (template) => {
    setSelectedTemplate(template);
    setFormData({
      templateKey: template.templateKey,
      title: template.title,
      description: template.description || '',
      category: template.category || 'special',
      type: template.type || 'default',
      imageUrl: template.imageUrl || '',
      requiredFields: template.requiredFields || ['birthDate', 'gender', 'mbti'],
      characterId: template.characterId || null,
      characterInfo: template.characterInfo || { name: '', imageSrc: '' },
      messageScenarios: template.messageScenarios || {
        withProfile: [],
        needsProfile: []
      },
      cardConfig: template.cardConfig || {
        cardNumbers: [],
        cardSelectCount: 3,
        cardBackImage: '/images/cards/back/camp_band.jpeg'
      },
      fortuneSettings: template.fortuneSettings || {
        fortuneType: '운세',
        resultButtonText: '운세 결과 보기',
        adTitle: '운세 결과'
      },
      resultTemplateData: (() => {
        // 백엔드에서 파싱되어 온 객체 또는 문자열 처리
        let data = template.resultTemplateData;

        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.error('Failed to parse resultTemplateData:', e);
            data = null;
          }
        }

        return data || {
          layout: { boxes: [] },
          cardData: {}
        };
      })(),
      theme: template.theme || {
        primaryColor: '#4F46E5',
        secondaryColor: '#7C3AED',
        backgroundColor: '#ffffff'
      },
      isPremium: template.isPremium || false,
      isActive: template.isActive !== undefined ? template.isActive : true,
      sortOrder: template.sortOrder || 0
    });
    setIsEditing(true);
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchTemplates(templateType);
    fetchCharacters();
  }, [templateType]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">템플릿을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">운세 템플릿 관리</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          새 템플릿 만들기
        </Button>
      </div>

      {/* 서브 탭 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setTemplateType('default')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              templateType === 'default'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            운세 템플릿
          </button>
          <button
            onClick={() => setTemplateType('mini')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              templateType === 'mini'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            미니 운세 템플릿
          </button>
          <button
            onClick={() => setTemplateType('saju')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              templateType === 'saju'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            사주 템플릿
          </button>
        </nav>
      </div>

      {/* 템플릿 목록 */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {/* 메인페이지 이미지 미리보기 */}
                {template.imageUrl && (
                  <div className="flex-shrink-0">
                    <ImagePreview imageUrl={template.imageUrl} />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{template.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.isActive ? '활성' : '비활성'}
                    </span>
                    {template.isPremium && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        프리미엄
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    키: {template.templateKey}
                  </p>
                  {template.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {template.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    캐릭터: {template.characterInfo?.name || '설정안됨'} |
                    {template.type === 'saju' ? '사주' : `카드 개수: ${template.cardConfig?.cardSelectCount || 0}개`} |
                    정렬순서: {template.sortOrder} |
                    이미지: {template.imageUrl ? '설정됨' : '설정안됨'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => startEditing(template)}
                  size="sm"
                  className="bg-gray-600 text-white hover:bg-gray-700"
                >
                  편집
                </Button>
                <Button
                  onClick={() => handleDeleteTemplate(template.templateKey)}
                  size="sm"
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 {templateType === 'mini' ? '미니 운세 ' : ''}템플릿이 없습니다.
        </div>
      )}

      {/* 생성/편집 모달 */}
      {(showCreateForm || isEditing) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? '템플릿 편집' : `새 ${templateType === 'mini' ? '미니 운세 ' : ''}템플릿 만들기`}
            </h3>

            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">템플릿 키 *</label>
                  <input
                    type="text"
                    value={formData.templateKey}
                    onChange={(e) => setFormData({ ...formData, templateKey: e.target.value })}
                    disabled={isEditing}
                    className={`w-full px-3 py-2 border rounded-md disabled:bg-gray-100 ${
                      /\s/.test(formData.templateKey) ? 'border-red-500' : ''
                    }`}
                    placeholder="valentine-2025"
                  />
                  {/\s/.test(formData.templateKey) && (
                    <p className="text-red-500 text-xs mt-1">공백을 포함할 수 없습니다</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">제목 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="발렌타인 운세"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="2"
                  placeholder="템플릿 설명..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">메인페이지 이미지</label>
                <div className="space-y-3">
                  {/* 파일 업로드 */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-md"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <p className="text-sm text-blue-600 mt-1">업로드 중...</p>
                    )}
                  </div>

                  {/* URL 직접 입력 (옵션) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">또는 URL 직접 입력</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* 이미지 미리보기 */}
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">미리보기:</p>
                      <ImagePreview imageUrl={formData.imageUrl} />
                    </div>
                  )}
                </div>
              </div>

              {/* 캐릭터 설정 */}
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-4">캐릭터 설정</h4>

                {/* 캐릭터 선택 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">캐릭터 선택</label>
                  <select
                    value={formData.characterId || ''}
                    onChange={(e) => {
                      const selectedCharacterId = e.target.value ? parseInt(e.target.value) : null;
                      const selectedCharacter = characters.find(c => c.id === selectedCharacterId);

                      setFormData({
                        ...formData,
                        characterId: selectedCharacterId,
                        characterInfo: selectedCharacter ? {
                          name: selectedCharacter.name,
                          imageSrc: selectedCharacter.imageSrc
                        } : { name: '', imageSrc: '' },
                        messageScenarios: selectedCharacter?.defaultMessageScenarios || formData.messageScenarios
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">캐릭터를 선택하세요</option>
                    {characters.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.name} {character.description ? `- ${character.description}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 선택된 캐릭터 미리보기 */}
                {formData.characterId && characters.length > 0 && (() => {
                  const selectedCharacter = characters.find(c => c.id === formData.characterId);
                  if (selectedCharacter) {
                    return (
                      <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedCharacter.imageSrc}
                            alt={selectedCharacter.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = '/images/character/default.png';
                            }}
                          />
                          <div>
                            <h5 className="font-medium">{selectedCharacter.name}</h5>
                            {selectedCharacter.description && (
                              <p className="text-sm text-gray-600">{selectedCharacter.description}</p>
                            )}
                            {selectedCharacter.personality && (
                              <p className="text-xs text-gray-500">성격: {selectedCharacter.personality}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* 수동 입력 (캐릭터를 선택하지 않은 경우) */}
                {!formData.characterId && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500 mb-3">
                      캐릭터를 선택하지 않으면 직접 입력할 수 있습니다.
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">캐릭터 이름</label>
                        <input
                          type="text"
                          value={formData.characterInfo.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            characterInfo: { ...formData.characterInfo, name: e.target.value }
                          })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="돌핀"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">캐릭터 이미지 경로</label>
                        <input
                          type="text"
                          value={formData.characterInfo.imageSrc}
                          onChange={(e) => setFormData({
                            ...formData,
                            characterInfo: { ...formData.characterInfo, imageSrc: e.target.value }
                          })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="/images/characters/dollfin/dollfin.jpg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 메시지 시나리오 설정 */}
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-4">채팅 시나리오 설정</h4>

                {/* 프로필 있는 사용자용 시나리오 */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium mb-2">프로필이 있는 사용자용 (로그인 + 완전한 프로필)</h5>
                  <textarea
                    value={JSON.stringify(formData.messageScenarios?.withProfile || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFormData({
                          ...formData,
                          messageScenarios: {
                            ...formData.messageScenarios,
                            withProfile: parsed
                          }
                        });
                      } catch (err) {
                        // JSON 파싱 오류 시 무시 (사용자가 입력 중일 수 있음)
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                    rows="8"
                    placeholder={`[
  { "text": "안녕! 바로 시작하자!", "sender": "bot" },
  { "text": "카드를 선택해!", "sender": "bot", "showCardSelect": true }
]`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    showCardSelect: true → 카드 선택 UI 표시
                  </p>
                </div>

                {/* 프로필 정보가 필요한 사용자용 시나리오 */}
                <div>
                  <h5 className="text-sm font-medium mb-2">프로필 정보가 필요한 사용자용 (비로그인 또는 불완전한 프로필)</h5>
                  <textarea
                    value={JSON.stringify(formData.messageScenarios?.needsProfile || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFormData({
                          ...formData,
                          messageScenarios: {
                            ...formData.messageScenarios,
                            needsProfile: parsed
                          }
                        });
                      } catch (err) {
                        // JSON 파싱 오류 시 무시
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                    rows="10"
                    placeholder={`[
  { "text": "안녕! 정보가 필요해!", "sender": "bot" },
  { "text": "생년월일은?", "sender": "bot", "showUserInput": "birthDate" },
  { "text": "성별은?", "sender": "bot", "showUserInput": "gender" },
  { "text": "MBTI는?", "sender": "bot", "showUserInput": "mbti" },
  { "text": "완벽해! 카드를 선택해!", "sender": "bot", "showCardSelect": true }
]`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    showUserInput: "birthDate" | "gender" | "mbti" → 각각의 입력 UI 표시
                  </p>
                </div>
              </div>

              {/* 운세 설정 */}
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">운세 설정</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">운세 타입</label>
                    <input
                      type="text"
                      value={formData.fortuneSettings.fortuneType}
                      onChange={(e) => setFormData({
                        ...formData,
                        fortuneSettings: { ...formData.fortuneSettings, fortuneType: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="연애운"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">결과 버튼 텍스트</label>
                    <input
                      type="text"
                      value={formData.fortuneSettings.resultButtonText}
                      onChange={(e) => setFormData({
                        ...formData,
                        fortuneSettings: { ...formData.fortuneSettings, resultButtonText: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="운세 결과 보기"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">광고 제목</label>
                    <input
                      type="text"
                      value={formData.fortuneSettings.adTitle}
                      onChange={(e) => setFormData({
                        ...formData,
                        fortuneSettings: { ...formData.fortuneSettings, adTitle: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="운세 결과"
                    />
                  </div>
                </div>
              </div>

              {/* 카드 설정 (사주 타입에서는 숨김) */}
              {formData.type !== 'saju' && <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">카드 설정</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">선택할 카드 개수</label>
                    <input
                      type="number"
                      value={formData.cardConfig.cardSelectCount}
                      onChange={(e) => setFormData({
                        ...formData,
                        cardConfig: { ...formData.cardConfig, cardSelectCount: parseInt(e.target.value) || 3 }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">카드 뒷면 이미지</label>
                    <input
                      type="text"
                      value={formData.cardConfig.cardBackImage}
                      onChange={(e) => setFormData({
                        ...formData,
                        cardConfig: { ...formData.cardConfig, cardBackImage: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="/images/cards/back/camp_band.jpeg"
                    />
                  </div>
                </div>
              </div>}

              {/* 결과 템플릿 데이터 */}
              {formData.type === 'saju' ? (
                /* ===== 사주 전용 결과 페이지 구성 ===== */
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">사주 결과 페이지 구성</h4>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>사주 결과 페이지를 구성합니다. 박스를 추가한 뒤, 25가지 오행 조합별 콘텐츠를 입력하세요.</p>
                    <p className="text-xs text-gray-500">주오행(사주에서 가장 강한 오행) x 일간(일주 천간의 오행) = 5 x 5 = 25가지</p>
                  </div>

                  {/* 탭 네비게이션 */}
                  <div className="flex gap-2 mb-4 border-b">
                    <button
                      type="button"
                      onClick={() => setResultTabMode('layout')}
                      className={`px-4 py-2 text-sm font-medium ${
                        resultTabMode === 'layout'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      1. 박스 레이아웃
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultTabMode('data')}
                      className={`px-4 py-2 text-sm font-medium ${
                        resultTabMode === 'data'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      2. 사주 데이터 (25조합)
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultTabMode('json')}
                      className={`px-4 py-2 text-sm font-medium ${
                        resultTabMode === 'json'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      JSON 직접 편집
                    </button>
                  </div>

                  {/* 탭 컨텐츠 */}
                  {resultTabMode === 'layout' && (
                    <BoxLayoutEditor
                      layout={formData.resultTemplateData?.layout || { boxes: [] }}
                      onLayoutChange={(newLayout) => {
                        setFormData({
                          ...formData,
                          resultTemplateData: {
                            layout: newLayout,
                            sajuData: formData.resultTemplateData?.sajuData || {}
                          }
                        });
                      }}
                    />
                  )}

                  {resultTabMode === 'data' && (
                    <SajuDataEditor
                      sajuData={formData.resultTemplateData?.sajuData || {}}
                      layout={formData.resultTemplateData?.layout || { boxes: [] }}
                      onSajuDataChange={(newSajuData) => {
                        setFormData({
                          ...formData,
                          resultTemplateData: {
                            layout: formData.resultTemplateData?.layout || { boxes: [] },
                            sajuData: newSajuData
                          }
                        });
                      }}
                    />
                  )}

                  {resultTabMode === 'json' && (
                    <div>
                      <textarea
                        value={formData.resultTemplateData ? JSON.stringify(formData.resultTemplateData, null, 2) : ''}
                        onChange={(e) => {
                          try {
                            const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                            setFormData({ ...formData, resultTemplateData: parsed });
                          } catch (err) {
                            setFormData({ ...formData, resultTemplateData: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                        rows="15"
                        placeholder='{ "layout": { "boxes": [...] }, "sajuData": { "목_목": { "box_id": { "content": "..." } }, ... } }'
                      />
                      {formData.resultTemplateData && typeof formData.resultTemplateData === 'string' && (
                        <p className="text-red-600 text-xs mt-1">
                          ⚠️ JSON 형식이 올바르지 않습니다.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* ===== 타로 결과 페이지 구성 (기존) ===== */
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">결과 페이지 구성 (박스 시스템)</h4>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>결과 페이지를 박스 단위로 구성하고 각 카드별 내용을 설정합니다.</p>
                    <p className="font-medium">📋 사용 방법:</p>
                    <ol className="list-decimal list-inside ml-2 space-y-1">
                      <li><strong>박스 레이아웃</strong>: 페이지에 표시할 박스들을 추가하고 순서를 정합니다</li>
                      <li><strong>카드별 데이터</strong>: 각 박스에 카드별로 다른 내용을 JSON으로 입력합니다</li>
                      <li><strong>JSON 직접 편집</strong>: 전체 구조를 직접 수정할 수 있습니다</li>
                    </ol>
                  </div>

                  {/* 탭 네비게이션 */}
                  <div className="flex gap-2 mb-4 border-b">
                    <button
                      type="button"
                      onClick={() => setResultTabMode('layout')}
                      className={`px-4 py-2 text-sm font-medium ${
                        resultTabMode === 'layout'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      1. 박스 레이아웃
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultTabMode('data')}
                      className={`px-4 py-2 text-sm font-medium ${
                        resultTabMode === 'data'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      2. 카드별 데이터
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultTabMode('json')}
                      className={`px-4 py-2 text-sm font-medium ${
                        resultTabMode === 'json'
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      JSON 직접 편집
                    </button>
                  </div>

                  {/* 탭 컨텐츠 */}
                  {resultTabMode === 'layout' && (
                    <BoxLayoutEditor
                      layout={formData.resultTemplateData?.layout || { boxes: [] }}
                      onLayoutChange={(newLayout) => {
                        setFormData({
                          ...formData,
                          resultTemplateData: {
                            layout: newLayout,
                            cardData: formData.resultTemplateData?.cardData || {}
                          }
                        });
                      }}
                    />
                  )}

                  {resultTabMode === 'data' && (
                    <CardDataEditor
                      cardData={formData.resultTemplateData?.cardData || {}}
                      layout={formData.resultTemplateData?.layout || { boxes: [] }}
                      onCardDataChange={(newCardData) => {
                        setFormData({
                          ...formData,
                          resultTemplateData: {
                            layout: formData.resultTemplateData?.layout || { boxes: [] },
                            cardData: newCardData
                          }
                        });
                      }}
                    />
                  )}

                  {resultTabMode === 'json' && (
                    <div>
                      <textarea
                        value={formData.resultTemplateData ? JSON.stringify(formData.resultTemplateData, null, 2) : ''}
                        onChange={(e) => {
                          try {
                            const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                            setFormData({ ...formData, resultTemplateData: parsed });
                          } catch (err) {
                            setFormData({ ...formData, resultTemplateData: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                        rows="15"
                        placeholder='{ "layout": { "boxes": [...] }, "cardData": { "0": { ... }, "1": { ... } } }'
                      />
                      {formData.resultTemplateData && typeof formData.resultTemplateData === 'string' && (
                        <p className="text-red-600 text-xs mt-1">
                          ⚠️ JSON 형식이 올바르지 않습니다.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}


              {/* 정렬 순서 */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">정렬 순서</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              {/* 체크박스 설정 */}
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  활성화
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                    className="mr-2"
                  />
                  프리미엄
                </label>
              </div>
            </div>

            {/* 모달 버튼 */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => {
                  setShowCreateForm(false);
                  setIsEditing(false);
                  setSelectedTemplate(null);
                  resetForm();
                }}
                className="bg-gray-500 text-white hover:bg-gray-600"
              >
                취소
              </Button>
              <Button
                onClick={isEditing ? handleUpdateTemplate : handleCreateTemplate}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isEditing ? '수정' : '생성'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortuneTemplateManager;