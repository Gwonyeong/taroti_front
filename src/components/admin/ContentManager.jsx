import React, { useState } from 'react';
import { Button } from '../ui/button';

const ContentManager = () => {
  const [contents, setContents] = useState([
    {
      id: 1,
      image: '/images/characters/webtoon/desert_fox_card_on_hands.jpeg',
      title: '타로 연애 운세',
      description: '타로카드와 MBTI를 결합한 개인 맞춤형 연애 운세',
      link: '/service/love-tarot',
      active: true
    },
    {
      id: 2,
      image: '/images/characters/webtoon/desert_fox_taro.png',
      title: 'MBTI 궁합 분석',
      description: 'MBTI 기반 커플 궁합 분석 및 관계 발전 가이드',
      link: '/service/mbti-compatibility',
      active: true
    },
    {
      id: 3,
      image: '/images/characters/webtoon/desert_fox_watching_card.jpeg',
      title: '일일 타로 운세',
      description: '매일 새로운 타로카드로 확인하는 오늘의 운세',
      link: '/service/daily-tarot',
      active: true
    },
    {
      id: 4,
      image: '/images/cards/0_THE_FOOL.png',
      title: '성격 유형 분석',
      description: 'MBTI와 타로의 융합으로 발견하는 나의 숨은 성격',
      link: '/service/personality-analysis',
      active: true
    },
    {
      id: 5,
      image: '/images/characters/webtoon/desert_fox_light_hands.jpeg',
      title: '연애 조언 상담',
      description: '전문가의 타로와 MBTI 기반 맞춤형 연애 상담',
      link: '/service/love-consultation',
      active: true
    },
    {
      id: 6,
      image: '/images/characters/webtoon/rabbit_watching_desert_fox.png',
      title: '미래 연인 예측',
      description: '타로카드가 예측하는 당신의 운명적인 미래 연인',
      link: '/service/future-love',
      active: true
    }
  ]);

  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    image: '',
    title: '',
    description: '',
    link: '',
    active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (content) => {
    setIsEditing(content.id);
    setEditForm({
      image: content.image,
      title: content.title,
      description: content.description,
      link: content.link,
      active: content.active
    });
  };

  const handleSave = (id) => {
    setContents(contents.map(content =>
      content.id === id
        ? { ...content, ...editForm }
        : content
    ));
    setIsEditing(null);
    setEditForm({ image: '', title: '', description: '', link: '', active: true });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({ image: '', title: '', description: '', link: '', active: true });
  };

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      setContents(contents.filter(content => content.id !== id));
    }
  };

  const handleAdd = () => {
    if (!editForm.image || !editForm.title || !editForm.description) {
      alert('이미지, 제목, 설명은 필수입니다.');
      return;
    }

    const newContent = {
      id: Math.max(...contents.map(c => c.id), 0) + 1,
      ...editForm
    };

    setContents([...contents, newContent]);
    setShowAddForm(false);
    setEditForm({ image: '', title: '', description: '', link: '', active: true });
  };

  const handleToggleActive = (id) => {
    setContents(contents.map(content =>
      content.id === id
        ? { ...content, active: !content.active }
        : content
    ));
  };

  const handleFileUpload = (e, contentId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    // 실제 구현에서는 서버로 파일을 업로드하고 URL을 받아와야 합니다
    // 여기서는 임시로 URL.createObjectURL을 사용합니다
    const fileURL = URL.createObjectURL(file);

    if (contentId) {
      // 기존 콘텐츠 이미지 업데이트
      setContents(contents.map(content =>
        content.id === contentId
          ? { ...content, image: fileURL }
          : content
      ));
    } else {
      // 새 콘텐츠용 이미지
      setEditForm({ ...editForm, image: fileURL });
    }

    alert('이미지가 업로드되었습니다. 실제 서비스에서는 서버에 업로드됩니다.');
  };

  const moveContent = (fromIndex, toIndex) => {
    const newContents = [...contents];
    const [removed] = newContents.splice(fromIndex, 1);
    newContents.splice(toIndex, 0, removed);
    setContents(newContents);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">콘텐츠 관리</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-black hover:bg-gray-800 text-white"
        >
          새 콘텐츠 추가
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">새 콘텐츠 추가</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 경로 *
              </label>
              <input
                type="text"
                value={editForm.image}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="/images/content/new-content.jpg"
              />
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e)}
                  className="text-sm text-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목 *
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="콘텐츠 제목"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                링크 URL
              </label>
              <input
                type="text"
                value={editForm.link}
                onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="/service/new-service"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명 *
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="콘텐츠에 대한 설명을 입력하세요"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="new-content-active"
                checked={editForm.active}
                onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="new-content-active" className="text-sm font-medium text-gray-700">
                활성화
              </label>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button
              onClick={handleAdd}
              className="bg-black hover:bg-gray-800 text-white"
            >
              추가
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setEditForm({ image: '', title: '', description: '', link: '', active: true });
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black"
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="grid grid-cols-1 gap-4">
        {contents.map((content, index) => (
          <div key={content.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
              {/* Image Preview */}
              <div className="lg:col-span-1">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div
                  className="hidden w-full h-32 bg-gray-200 rounded border flex items-center justify-center text-gray-500"
                >
                  이미지를 불러올 수 없습니다
                </div>
              </div>

              {/* Content Info */}
              <div className="lg:col-span-3">
                {isEditing === content.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이미지 경로
                      </label>
                      <input
                        type="text"
                        value={editForm.image}
                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e)}
                        className="mt-1 text-xs text-gray-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          제목
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          링크 URL
                        </label>
                        <input
                          type="text"
                          value={editForm.link}
                          onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        설명
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{content.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{content.description}</p>
                    <p className="text-xs text-gray-500 mt-2">링크: {content.link || '없음'}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        content.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {content.active ? '활성화' : '비활성화'}
                      </span>
                      <span className="text-xs text-gray-500">순서: {index + 1}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="lg:col-span-1">
                {isEditing === content.id ? (
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => handleSave(content.id)}
                      className="bg-black hover:bg-gray-800 text-white text-sm"
                    >
                      저장
                    </Button>
                    <Button
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-black text-sm"
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => handleEdit(content)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(content.id)}
                      className={`text-white text-sm ${
                        content.active
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {content.active ? '비활성화' : '활성화'}
                    </Button>
                    <div className="flex space-x-1">
                      {index > 0 && (
                        <Button
                          onClick={() => moveContent(index, index - 1)}
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1"
                        >
                          ↑
                        </Button>
                      )}
                      {index < contents.length - 1 && (
                        <Button
                          onClick={() => moveContent(index, index + 1)}
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1"
                        >
                          ↓
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDelete(content.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          등록된 콘텐츠가 없습니다.
        </div>
      )}
    </div>
  );
};

export default ContentManager;