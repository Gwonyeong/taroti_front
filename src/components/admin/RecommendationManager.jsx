import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const RecommendationManager = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [availableContents, setAvailableContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAvailableContents, setFilteredAvailableContents] = useState([]);

  // API 기본 URL
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

  // 추천 콘텐츠 목록 조회
  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/content-recommendations/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } else {
        throw new Error('추천 콘텐츠 목록을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('추천 콘텐츠 목록을 불러오는데 실패했습니다.');
    }
  };

  // 사용 가능한 콘텐츠 목록 조회
  const fetchAvailableContents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/content-recommendations/admin/available-contents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableContents(data.contents || []);
        setFilteredAvailableContents(data.contents || []);
      } else {
        throw new Error('사용 가능한 콘텐츠 목록을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching available contents:', error);
      toast.error('사용 가능한 콘텐츠 목록을 불러오는데 실패했습니다.');
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRecommendations(), fetchAvailableContents()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // 검색 필터링
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAvailableContents(availableContents);
    } else {
      const filtered = availableContents.filter(content =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAvailableContents(filtered);
    }
  }, [searchTerm, availableContents]);

  // 추천 콘텐츠 추가
  const handleAddRecommendation = async (contentId, formData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/content-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentId,
          showOnDecemberFortune: formData.showOnDecemberFortune,
          showOnNewYearFortune: formData.showOnNewYearFortune,
          showOnMindReading: formData.showOnMindReading,
          sortOrder: formData.sortOrder || 0
        })
      });

      if (response.ok) {
        toast.success('추천 콘텐츠가 추가되었습니다.');
        await Promise.all([fetchRecommendations(), fetchAvailableContents()]);
        setShowAddModal(false);
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error adding recommendation:', error);
      toast.error(error.message || '추천 콘텐츠 추가에 실패했습니다.');
    }
  };

  // 추천 콘텐츠 수정
  const handleUpdateRecommendation = async (id, formData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/content-recommendations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('추천 콘텐츠가 수정되었습니다.');
        await fetchRecommendations();
        setEditingItem(null);
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error updating recommendation:', error);
      toast.error(error.message || '추천 콘텐츠 수정에 실패했습니다.');
    }
  };

  // 추천 콘텐츠 삭제
  const handleDeleteRecommendation = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/content-recommendations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('추천 콘텐츠가 삭제되었습니다.');
        await Promise.all([fetchRecommendations(), fetchAvailableContents()]);
      } else {
        throw new Error('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      toast.error('추천 콘텐츠 삭제에 실패했습니다.');
    }
  };

  // 순서 변경
  const handleSortOrderChange = async (id, newSortOrder) => {
    await handleUpdateRecommendation(id, { sortOrder: parseInt(newSortOrder) });
  };

  // 활성화 상태 변경
  const handleToggleActive = async (id, currentActive) => {
    await handleUpdateRecommendation(id, { active: !currentActive });
  };

  // 페이지 표시 설정 변경
  const handlePageDisplayChange = async (id, field, value) => {
    await handleUpdateRecommendation(id, { [field]: value });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="text-gray-600">로딩 중...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">이런 콘텐츠도 있어요!</h2>
          <p className="text-gray-600">결과 페이지에 표시할 추천 콘텐츠를 관리하세요</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          콘텐츠 추가
        </Button>
      </div>

      {/* 현재 추천 콘텐츠 목록 */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">현재 추천 콘텐츠 ({recommendations.length}개)</h3>
        </div>

        <div className="divide-y">
          {recommendations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              추천 콘텐츠가 없습니다. 콘텐츠를 추가해보세요.
            </div>
          ) : (
            recommendations
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((rec) => (
                <div key={rec.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* 콘텐츠 이미지 */}
                    <img
                      src={rec.content.imageUrl || '/images/placeholder.jpg'}
                      alt={rec.content.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />

                    {/* 콘텐츠 정보 */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-lg">{rec.content.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{rec.content.description}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            <span>조회수: {rec.viewCount}</span>
                            <span className="mx-2">|</span>
                            <span>클릭수: {rec.clickCount}</span>
                          </div>
                        </div>

                        {/* 활성화 상태 */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleActive(rec.id, rec.active)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              rec.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {rec.active ? '활성' : '비활성'}
                          </button>
                        </div>
                      </div>

                      {/* 설정 영역 */}
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        {/* 순서 설정 */}
                        <div className="flex items-center space-x-2">
                          <label className="text-xs text-gray-600">순서:</label>
                          <input
                            type="number"
                            value={rec.sortOrder}
                            onChange={(e) => handleSortOrderChange(rec.id, e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                          />
                        </div>

                        {/* 페이지 표시 설정 */}
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              checked={rec.showOnDecemberFortune}
                              onChange={(e) => handlePageDisplayChange(rec.id, 'showOnDecemberFortune', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-gray-700">12월 운세</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              checked={rec.showOnNewYearFortune}
                              onChange={(e) => handlePageDisplayChange(rec.id, 'showOnNewYearFortune', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-gray-700">신년 운세</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              checked={rec.showOnMindReading}
                              onChange={(e) => handlePageDisplayChange(rec.id, 'showOnMindReading', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-gray-700">마음읽기</span>
                          </label>
                        </div>

                        {/* 삭제 버튼 */}
                        <Button
                          onClick={() => handleDeleteRecommendation(rec.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          제거
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* 콘텐츠 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">추천할 콘텐츠 선택</h3>
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  size="sm"
                >
                  닫기
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* 검색 */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="콘텐츠 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* 사용 가능한 콘텐츠 목록 */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {filteredAvailableContents.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    {searchTerm ? '검색 결과가 없습니다.' : '추가할 수 있는 콘텐츠가 없습니다.'}
                  </div>
                ) : (
                  filteredAvailableContents.map((content) => (
                    <div key={content.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={content.imageUrl || '/images/placeholder.jpg'}
                          alt={content.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{content.title}</h4>
                          <p className="text-gray-600 text-sm">{content.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            링크: {content.linkUrl}
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            // 기본 설정으로 추가
                            handleAddRecommendation(content.id, {
                              showOnDecemberFortune: true,
                              showOnNewYearFortune: true,
                              showOnMindReading: false,
                              sortOrder: recommendations.length
                            });
                          }}
                          size="sm"
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          추가
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationManager;