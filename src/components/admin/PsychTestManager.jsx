import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const PsychTestManager = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // 폼 데이터
  const [formData, setFormData] = useState({
    testKey: '',
    title: '',
    description: '',
    imageUrl: '',
    questions: [],
    resultTypes: [],
    theme: null,
    isActive: true,
    sortOrder: 0
  });

  // 테스트 목록 로드
  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/psych-tests?includeInactive=true`);
      const data = await res.json();
      if (data.success) {
        setTests(data.tests);
      }
    } catch (error) {
      toast.error('테스트 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      testKey: '',
      title: '',
      description: '',
      imageUrl: '',
      questions: [],
      resultTypes: [],
      theme: null,
      isActive: true,
      sortOrder: 0
    });
    setEditingTest(null);
    setShowEditor(false);
  };

  // 새 테스트 생성 모드
  const handleNewTest = () => {
    resetForm();
    setShowEditor(true);
  };

  // 기존 테스트 편집 모드
  const handleEditTest = (test) => {
    setFormData({
      testKey: test.testKey,
      title: test.title,
      description: test.description || '',
      imageUrl: test.imageUrl || '',
      questions: test.questions || [],
      resultTypes: test.resultTypes || [],
      theme: test.theme || null,
      isActive: test.isActive,
      sortOrder: test.sortOrder
    });
    setEditingTest(test);
    setShowEditor(true);
  };

  // 저장 (생성 또는 수정)
  const handleSave = async () => {
    if (!formData.testKey || !formData.title) {
      toast.error('테스트 키와 제목은 필수입니다.');
      return;
    }

    if (/\s/.test(formData.testKey)) {
      toast.error('테스트 키에 공백을 포함할 수 없습니다.');
      return;
    }

    if (formData.resultTypes.length < 2) {
      toast.error('결과 유형은 최소 2개 이상 필요합니다.');
      return;
    }

    if (formData.questions.length === 0) {
      toast.error('질문을 최소 1개 이상 추가해주세요.');
      return;
    }

    try {
      const url = editingTest
        ? `${API_BASE}/api/psych-tests/${editingTest.testKey}`
        : `${API_BASE}/api/psych-tests`;

      const method = editingTest ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingTest ? '테스트가 수정되었습니다.' : '테스트가 생성되었습니다.');
        resetForm();
        fetchTests();
      } else {
        toast.error(data.message || '저장에 실패했습니다.');
      }
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  // 삭제
  const handleDelete = async (testKey) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/psych-tests/${testKey}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('테스트가 삭제되었습니다.');
        fetchTests();
      } else {
        toast.error(data.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  // 활성화/비활성화 토글
  const handleToggleActive = async (test) => {
    try {
      const res = await fetch(`${API_BASE}/api/psych-tests/${test.testKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !test.isActive })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(test.isActive ? '비활성화되었습니다.' : '활성화되었습니다.');
        fetchTests();
      }
    } catch (error) {
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  // 이미지 업로드
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/api/psych-tests/upload-image`, {
        method: 'POST',
        body: uploadFormData
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        toast.success('이미지가 업로드되었습니다.');
      } else {
        toast.error(data.message || '업로드에 실패했습니다.');
      }
    } catch (error) {
      toast.error('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  // === 결과 유형 관리 ===
  const addResultType = () => {
    setFormData(prev => ({
      ...prev,
      resultTypes: [...prev.resultTypes, {
        key: '',
        name: '',
        shortDescription: '',
        description: '',
        imageUrl: '',
        aiPromptTemplate: ''
      }]
    }));
  };

  const updateResultType = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.resultTypes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, resultTypes: updated };
    });
  };

  const removeResultType = (index) => {
    setFormData(prev => ({
      ...prev,
      resultTypes: prev.resultTypes.filter((_, i) => i !== index)
    }));
  };

  // === 질문 관리 ===
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        index: prev.questions.length,
        text: '',
        imageUrl: null,
        choices: [
          { index: 0, text: '', weights: {} },
          { index: 1, text: '', weights: {} }
        ]
      }]
    }));
  };

  const updateQuestion = (qIndex, field, value) => {
    setFormData(prev => {
      const updated = [...prev.questions];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const removeQuestion = (qIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions
        .filter((_, i) => i !== qIndex)
        .map((q, i) => ({ ...q, index: i }))
    }));
  };

  const moveQuestion = (qIndex, direction) => {
    setFormData(prev => {
      const updated = [...prev.questions];
      const newIndex = direction === 'up' ? qIndex - 1 : qIndex + 1;
      if (newIndex < 0 || newIndex >= updated.length) return prev;
      [updated[qIndex], updated[newIndex]] = [updated[newIndex], updated[qIndex]];
      return { ...prev, questions: updated.map((q, i) => ({ ...q, index: i })) };
    });
  };

  // === 선택지 관리 ===
  const addChoice = (qIndex) => {
    setFormData(prev => {
      const updated = [...prev.questions];
      updated[qIndex] = {
        ...updated[qIndex],
        choices: [...updated[qIndex].choices, {
          index: updated[qIndex].choices.length,
          text: '',
          weights: {}
        }]
      };
      return { ...prev, questions: updated };
    });
  };

  const updateChoice = (qIndex, cIndex, field, value) => {
    setFormData(prev => {
      const updated = [...prev.questions];
      const choices = [...updated[qIndex].choices];
      choices[cIndex] = { ...choices[cIndex], [field]: value };
      updated[qIndex] = { ...updated[qIndex], choices };
      return { ...prev, questions: updated };
    });
  };

  const removeChoice = (qIndex, cIndex) => {
    setFormData(prev => {
      const updated = [...prev.questions];
      updated[qIndex] = {
        ...updated[qIndex],
        choices: updated[qIndex].choices
          .filter((_, i) => i !== cIndex)
          .map((c, i) => ({ ...c, index: i }))
      };
      return { ...prev, questions: updated };
    });
  };

  const updateChoiceWeight = (qIndex, cIndex, resultKey, weight) => {
    setFormData(prev => {
      const updated = [...prev.questions];
      const choices = [...updated[qIndex].choices];
      const weights = { ...choices[cIndex].weights };
      if (weight === '' || weight === 0) {
        delete weights[resultKey];
      } else {
        weights[resultKey] = Number(weight);
      }
      choices[cIndex] = { ...choices[cIndex], weights };
      updated[qIndex] = { ...updated[qIndex], choices };
      return { ...prev, questions: updated };
    });
  };

  // === 렌더링 ===

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">로딩 중...</div>;
  }

  // 편집기 모드
  if (showEditor) {
    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {editingTest ? `테스트 수정: ${editingTest.title}` : '새 심리 테스트 생성'}
          </h3>
          <div className="flex gap-2">
            <Button onClick={resetForm} className="bg-gray-200 text-black hover:bg-gray-300">
              취소
            </Button>
            <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">
              저장
            </Button>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-sm border-b pb-2">기본 정보</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">테스트 키 *</label>
              <input
                type="text"
                value={formData.testKey}
                onChange={(e) => setFormData(prev => ({ ...prev, testKey: e.target.value }))}
                disabled={!!editingTest}
                placeholder="stress-type"
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">제목 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="나의 스트레스 유형은?"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="테스트 설명을 입력하세요"
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">커버 이미지</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="커버" className="w-16 h-16 object-cover rounded" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              활성화
            </label>
            <div>
              <label className="text-xs font-medium text-gray-600 mr-2">정렬 순서</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-20 border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 결과 유형 */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="font-semibold text-sm">결과 유형 ({formData.resultTypes.length}개)</h4>
            <button
              onClick={addResultType}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              유형 추가
            </button>
          </div>
          {formData.resultTypes.map((rt, idx) => (
            <div key={idx} className="border rounded p-3 space-y-2 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">결과 유형 #{idx + 1}</span>
                <button
                  onClick={() => removeResultType(idx)}
                  className="text-red-500 text-xs hover:underline"
                >
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={rt.key}
                  onChange={(e) => updateResultType(idx, 'key', e.target.value)}
                  placeholder="key (영문)"
                  className="border rounded px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={rt.name}
                  onChange={(e) => updateResultType(idx, 'name', e.target.value)}
                  placeholder="유형 이름"
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <input
                type="text"
                value={rt.shortDescription}
                onChange={(e) => updateResultType(idx, 'shortDescription', e.target.value)}
                placeholder="짧은 설명 (한 줄)"
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <textarea
                value={rt.description}
                onChange={(e) => updateResultType(idx, 'description', e.target.value)}
                placeholder="상세 설명"
                rows={2}
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <textarea
                value={rt.aiPromptTemplate}
                onChange={(e) => updateResultType(idx, 'aiPromptTemplate', e.target.value)}
                placeholder="AI 프롬프트 템플릿 (선택)"
                rows={2}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>

        {/* 질문 편집기 */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="font-semibold text-sm">질문 ({formData.questions.length}개)</h4>
            <button
              onClick={addQuestion}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
            >
              질문 추가
            </button>
          </div>
          {formData.questions.map((q, qIdx) => (
            <div key={qIdx} className="border rounded p-3 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-green-100 px-2 py-1 rounded">Q{qIdx + 1}</span>
                  <button onClick={() => moveQuestion(qIdx, 'up')} disabled={qIdx === 0}
                    className="text-xs px-1 disabled:opacity-30">
                    ▲
                  </button>
                  <button onClick={() => moveQuestion(qIdx, 'down')} disabled={qIdx === formData.questions.length - 1}
                    className="text-xs px-1 disabled:opacity-30">
                    ▼
                  </button>
                </div>
                <button onClick={() => removeQuestion(qIdx)} className="text-red-500 text-xs hover:underline">
                  삭제
                </button>
              </div>
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                placeholder="질문 내용을 입력하세요"
                className="w-full border rounded px-2 py-1 text-sm"
              />

              {/* 선택지 목록 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">선택지</span>
                  <button
                    onClick={() => addChoice(qIdx)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    + 선택지 추가
                  </button>
                </div>
                {q.choices.map((c, cIdx) => (
                  <div key={cIdx} className="border rounded p-2 bg-white space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-6">{cIdx + 1}.</span>
                      <input
                        type="text"
                        value={c.text}
                        onChange={(e) => updateChoice(qIdx, cIdx, 'text', e.target.value)}
                        placeholder="선택지 텍스트"
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      />
                      {q.choices.length > 2 && (
                        <button onClick={() => removeChoice(qIdx, cIdx)} className="text-red-400 text-xs">
                          ✕
                        </button>
                      )}
                    </div>
                    {/* 가중치 매트릭스 */}
                    {formData.resultTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2 pl-6">
                        {formData.resultTypes.map((rt, rtIdx) => (
                          <div key={rtIdx} className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{rt.name || rt.key || `유형${rtIdx + 1}`}:</span>
                            <input
                              type="number"
                              value={c.weights[rt.key] || ''}
                              onChange={(e) => updateChoiceWeight(qIdx, cIdx, rt.key, e.target.value)}
                              placeholder="0"
                              className="w-12 border rounded px-1 py-0.5 text-xs text-center"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 목록 모드
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">심리 테스트 관리</h3>
        <Button onClick={handleNewTest} className="bg-black text-white hover:bg-gray-800">
          새 테스트 만들기
        </Button>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>등록된 심리 테스트가 없습니다.</p>
          <p className="text-sm mt-1">새 테스트를 만들어보세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="border rounded-lg p-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                {test.imageUrl ? (
                  <img src={test.imageUrl} alt={test.title} className="w-14 h-14 object-cover rounded-lg" />
                ) : (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{test.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${test.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {test.isActive ? '활성' : '비활성'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Key: {test.testKey} | 질문: {test.questions?.length || 0}개 | 결과 유형: {test.resultTypes?.length || 0}개
                  </p>
                  {test.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-md">{test.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(test)}
                  className={`text-xs px-3 py-1 rounded ${test.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                >
                  {test.isActive ? '비활성화' : '활성화'}
                </button>
                <button
                  onClick={() => handleEditTest(test)}
                  className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  편집
                </button>
                <button
                  onClick={() => handleDelete(test.testKey)}
                  className="text-xs px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PsychTestManager;
