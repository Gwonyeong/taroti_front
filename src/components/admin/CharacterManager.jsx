import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

// 채팅 시나리오 편집 컴포넌트
const MessageScenariosEditor = ({ scenarios, onScenariosChange }) => {
  const [localScenarios, setLocalScenarios] = useState(scenarios || {
    withProfile: [
      { text: '운세를 봐줄거래!', sender: 'bot' },
      { text: '바로 카드를 뽑아보고래!', sender: 'bot', showCardSelect: true }
    ],
    needsProfile: [
      { text: '운세를 봐줄거래!', sender: 'bot' },
      { text: '먼저 생년월일을 알려줘고래~', sender: 'bot', showUserInput: 'birthDate' },
      { text: '성별도 알려줘고래!', sender: 'bot', showUserInput: 'gender' },
      { text: 'MBTI도 궁금해고래!', sender: 'bot', showUserInput: 'mbti' },
      { text: '좋아고래! 이제 카드를 뽑아보고래!', sender: 'bot', showCardSelect: true }
    ]
  });

  useEffect(() => {
    if (scenarios) {
      setLocalScenarios(scenarios);
    }
  }, [scenarios]);

  const updateScenario = (type, value) => {
    try {
      const parsed = JSON.parse(value);
      const updated = {
        ...localScenarios,
        [type]: parsed
      };
      setLocalScenarios(updated);
      onScenariosChange(updated);
    } catch (err) {
      // JSON 파싱 오류는 무시 (사용자 입력 중)
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">기본 채팅 시나리오</h4>

      {/* 프로필이 있는 사용자용 */}
      <div>
        <h5 className="text-sm font-medium mb-2">프로필이 있는 사용자용 (로그인 + 완전한 프로필)</h5>
        <textarea
          value={JSON.stringify(localScenarios.withProfile || [], null, 2)}
          onChange={(e) => updateScenario('withProfile', e.target.value)}
          className="w-full px-3 py-2 border rounded-md font-mono text-sm"
          rows="8"
          placeholder='예: [{ "text": "운세를 봐줄거래!", "sender": "bot" }]'
        />
      </div>

      {/* 프로필 정보가 필요한 사용자용 */}
      <div>
        <h5 className="text-sm font-medium mb-2">프로필 정보가 필요한 사용자용 (비로그인 또는 불완전한 프로필)</h5>
        <textarea
          value={JSON.stringify(localScenarios.needsProfile || [], null, 2)}
          onChange={(e) => updateScenario('needsProfile', e.target.value)}
          className="w-full px-3 py-2 border rounded-md font-mono text-sm"
          rows="10"
          placeholder='예: [{ "text": "먼저 생년월일을 알려줘고래~", "sender": "bot", "showUserInput": "birthDate" }]'
        />
      </div>

      <div className="text-xs text-gray-500">
        <p><strong>사용 가능한 액션:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><code>showUserInput: 'birthDate'</code> - 생년월일 입력</li>
          <li><code>showUserInput: 'gender'</code> - 성별 입력</li>
          <li><code>showUserInput: 'mbti'</code> - MBTI 입력</li>
          <li><code>showCardSelect: true</code> - 카드 선택</li>
        </ul>
      </div>
    </div>
  );
};

// 캐릭터 폼 컴포넌트
const CharacterForm = ({ character, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    imageSrc: '',
    description: '',
    personality: '',
    imageFile: null,
    defaultMessageScenarios: {
      withProfile: [
        { text: '운세를 봐줄거래!', sender: 'bot' },
        { text: '바로 카드를 뽑아보고래!', sender: 'bot', showCardSelect: true }
      ],
      needsProfile: [
        { text: '운세를 봐줄거래!', sender: 'bot' },
        { text: '먼저 생년월일을 알려줘고래~', sender: 'bot', showUserInput: 'birthDate' },
        { text: '성별도 알려줘고래!', sender: 'bot', showUserInput: 'gender' },
        { text: 'MBTI도 궁금해고래!', sender: 'bot', showUserInput: 'mbti' },
        { text: '좋아고래! 이제 카드를 뽑아보고래!', sender: 'bot', showCardSelect: true }
      ]
    }
  });

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name || '',
        imageSrc: character.imageSrc || '',
        description: character.description || '',
        personality: character.personality || '',
        defaultMessageScenarios: character.defaultMessageScenarios || formData.defaultMessageScenarios
      });
    }
  }, [character]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-4">기본 정보</h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">캐릭터 이름 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="예: 타로티, 별이"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">캐릭터 이미지 *</label>

            {/* 이미지 미리보기 */}
            {(formData.imageSrc || formData.imageFile) && (
              <div className="mb-3">
                <img
                  src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.imageSrc}
                  alt="캐릭터 미리보기"
                  className="w-32 h-32 rounded-lg object-cover border"
                />
              </div>
            )}

            {/* 파일 업로드 입력 */}
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, imageFile: file });
                  }
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-sm text-gray-500">
                {
                  character && !formData.imageFile
                    ? '새 이미지를 업로드하지 않으면 기존 이미지가 유지됩니다.'
                    : 'JPG, PNG, GIF 형식을 지원합니다. (최대 5MB)'
                }
              </p>

              {/* 외부 URL 입력 (선택적) */}
              <div className="mt-3">
                <label className="text-sm text-gray-600">또는 이미지 URL 입력:</label>
                <input
                  type="text"
                  value={formData.imageSrc}
                  onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value, imageFile: null })}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">캐릭터 설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="캐릭터에 대한 간단한 설명"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">성격/말투 특징</label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="예: ~고래 말투를 사용하며 친근하고 따뜻한 성격"
            />
          </div>
        </div>
      </div>

      {/* 채팅 시나리오 */}
      <div className="border p-4 rounded-md">
        <MessageScenariosEditor
          scenarios={formData.defaultMessageScenarios}
          onScenariosChange={(scenarios) =>
            setFormData({ ...formData, defaultMessageScenarios: scenarios })
          }
        />
      </div>

      {/* 버튼들 */}
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '저장 중...' : character ? '수정' : '생성'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
};

// 메인 캐릭터 매니저 컴포넌트
const CharacterManager = () => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

  // 캐릭터 목록 로드
  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/characters`);
      const data = await response.json();

      if (data.success) {
        setCharacters(data.characters);
      } else {
        toast.error('캐릭터 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      toast.error('캐릭터 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 캐릭터 저장 (생성/수정)
  const saveCharacter = async (characterData) => {
    try {
      setIsSubmitting(true);

      const isEdit = editingCharacter !== null;
      const url = isEdit
        ? `${API_BASE_URL}/api/characters/${editingCharacter.id}`
        : `${API_BASE_URL}/api/characters`;

      const method = isEdit ? 'PUT' : 'POST';

      // FormData 객체 생성 (파일 업로드를 위해)
      const formDataToSend = new FormData();

      // 텍스트 데이터 추가
      formDataToSend.append('name', characterData.name);
      if (characterData.description) formDataToSend.append('description', characterData.description);
      if (characterData.personality) formDataToSend.append('personality', characterData.personality);
      if (characterData.defaultMessageScenarios) {
        formDataToSend.append('defaultMessageScenarios', JSON.stringify(characterData.defaultMessageScenarios));
      }

      // 이미지 파일이 있는 경우
      if (characterData.imageFile) {
        formDataToSend.append('image', characterData.imageFile);
      } else if (characterData.imageSrc) {
        // URL을 직접 입력한 경우
        formDataToSend.append('imageSrc', characterData.imageSrc);
      } else if (!isEdit) {
        // 새 캐릭터인데 이미지가 없는 경우
        toast.error('캐릭터 이미지를 선택해주세요.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`캐릭터가 ${isEdit ? '수정' : '생성'}되었습니다.`);
        setShowForm(false);
        setEditingCharacter(null);
        loadCharacters();
      } else {
        toast.error(data.message || '캐릭터 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving character:', error);
      toast.error('캐릭터 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 캐릭터 삭제
  const deleteCharacter = async (id) => {
    if (!window.confirm('정말로 이 캐릭터를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/characters/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('캐릭터가 삭제되었습니다.');
        loadCharacters();
      } else {
        toast.error(data.message || '캐릭터 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting character:', error);
      toast.error('캐릭터 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  // 새 캐릭터 생성
  const handleCreateNew = () => {
    setEditingCharacter(null);
    setShowForm(true);
  };

  // 캐릭터 수정
  const handleEdit = (character) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  // 폼 취소
  const handleCancel = () => {
    setShowForm(false);
    setEditingCharacter(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingCharacter ? '캐릭터 수정' : '새 캐릭터 생성'}
          </h2>
        </div>

        <CharacterForm
          character={editingCharacter}
          onSubmit={saveCharacter}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">캐릭터 관리</h2>
        <Button onClick={handleCreateNew}>
          새 캐릭터 생성
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">캐릭터 목록을 불러오는 중...</div>
      ) : characters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          생성된 캐릭터가 없습니다.
        </div>
      ) : (
        <div className="grid gap-6">
          {characters.map((character) => (
            <div key={character.id} className="border rounded-lg p-6 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {character.imageSrc && (
                    <img
                      src={character.imageSrc}
                      alt={character.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/images/character/default.png';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                    {character.description && (
                      <p className="text-gray-600 mb-2">{character.description}</p>
                    )}
                    {character.personality && (
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>성격:</strong> {character.personality}
                      </p>
                    )}
                    <div className="text-sm text-gray-500">
                      <span>사용된 템플릿: {character._count?.fortuneTemplates || 0}개</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(character)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCharacter(character.id)}
                    disabled={character._count?.fortuneTemplates > 0}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterManager;