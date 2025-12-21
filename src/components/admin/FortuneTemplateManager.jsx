import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

// 박스 레이아웃 편집 컴포넌트
const BoxLayoutEditor = ({ layout, onLayoutChange }) => {
  console.log('📦 BoxLayoutEditor received layout:', layout);
  const [boxes, setBoxes] = useState(layout?.boxes || []);
  const [editingBox, setEditingBox] = useState(null);
  const [showAddBox, setShowAddBox] = useState(false);

  // layout이 변경될 때 boxes 상태 업데이트
  useEffect(() => {
    console.log('📦 BoxLayoutEditor layout changed:', layout);
    console.log('📦 Setting boxes to:', layout?.boxes || []);
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
    console.log('Adding box:', newBox);
    console.log('Updated boxes:', updatedBoxes);
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resultTabMode, setResultTabMode] = useState('layout'); // 'layout', 'data', 'json'

  // 폼 상태
  const [formData, setFormData] = useState({
    templateKey: '',
    title: '',
    description: '',
    category: 'special',
    imageUrl: '',
    requiredFields: ['birthDate', 'gender', 'mbti'],
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

  // 템플릿 목록 조회
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/fortune-templates?includeInactive=true`);

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

      console.log('Updating template with data:', formData);
      console.log('resultTemplateData being sent:', formData.resultTemplateData);

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
    setFormData({
      templateKey: '',
      title: '',
      description: '',
      category: 'special',
      imageUrl: '',
      requiredFields: ['birthDate', 'gender', 'mbti'],
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
  };

  // 템플릿 편집 시작
  const startEditing = (template) => {
    console.log('🔄 Starting to edit template:', template);
    console.log('🔄 Template resultTemplateData:', template.resultTemplateData);
    setSelectedTemplate(template);
    setFormData({
      templateKey: template.templateKey,
      title: template.title,
      description: template.description || '',
      category: template.category || 'special',
      imageUrl: template.imageUrl || '',
      requiredFields: template.requiredFields || ['birthDate', 'gender', 'mbti'],
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
      resultTemplateData: template.resultTemplateData || {
        layout: { boxes: [] },
        cardData: {}
      },
      theme: template.theme || {
        primaryColor: '#4F46E5',
        secondaryColor: '#7C3AED',
        backgroundColor: '#ffffff'
      },
      isPremium: template.isPremium || false,
      isActive: template.isActive !== undefined ? template.isActive : true,
      sortOrder: template.sortOrder || 0
    });
    console.log('🔄 Final resultTemplateData being set:', template.resultTemplateData || {
      layout: { boxes: [] },
      cardData: {}
    });
    setIsEditing(true);
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchTemplates();
  }, []);

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
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          새 템플릿 만들기
        </Button>
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
                    카드 개수: {template.cardConfig?.cardSelectCount || 0}개 |
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
          등록된 템플릿이 없습니다.
        </div>
      )}

      {/* 생성/편집 모달 */}
      {(showCreateForm || isEditing) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? '템플릿 편집' : '새 템플릿 만들기'}
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
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                    placeholder="valentine-2025"
                  />
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

              {/* 캐릭터 정보 */}
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">캐릭터 설정</h4>
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

              {/* 카드 설정 */}
              <div className="border p-4 rounded-md">
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
              </div>

              {/* 결과 템플릿 데이터 - 박스 시스템 */}
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
                      console.log('Layout changed:', newLayout);
                      console.log('Previous formData:', formData.resultTemplateData);
                      const newResultTemplateData = {
                        layout: newLayout,
                        cardData: formData.resultTemplateData?.cardData || {}
                      };
                      console.log('New resultTemplateData:', newResultTemplateData);
                      setFormData({
                        ...formData,
                        resultTemplateData: newResultTemplateData
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
                          // JSON 파싱 오류 시 일단 문자열로 저장
                          setFormData({ ...formData, resultTemplateData: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                      rows="15"
                      placeholder={`{
  "layout": {
    "boxes": [
      {
        "id": "card_info",
        "type": "card_description",
        "order": 1,
        "title": "카드 설명"
      },
      {
        "id": "love_fortune",
        "type": "fortune_box",
        "order": 2,
        "title": "💕 연애운",
        "backgroundColor": "#FEF3E3"
      }
    ]
  },
  "cardData": {
    "0": {
      "card_info": {
        "cardName": "THE FOOL",
        "interpretation": "새로운 시작을 의미하는 카드입니다."
      },
      "love_fortune": {
        "content": "12월의 연애운은..."
      }
    }
  }
}`}
                    />
                    {formData.resultTemplateData && typeof formData.resultTemplateData === 'string' && (
                      <p className="text-red-600 text-xs mt-1">
                        ⚠️ JSON 형식이 올바르지 않습니다. 문법을 확인해주세요.
                      </p>
                    )}
                  </div>
                )}
              </div>

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