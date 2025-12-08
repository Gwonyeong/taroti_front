import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  getFeaturedContentsForAdmin,
  createFeaturedContent,
  updateFeaturedContent,
  deleteFeaturedContent,
  updateFeaturedContentOrder
} from '../../lib/api';
import { uploadContentImage, deleteFile } from '../../lib/storage';
import { toast } from 'sonner';

const FeaturedContentManager = () => {
  // URL에서 파일명 추출 함수
  const getFileNameFromUrl = (url) => {
    if (!url) return '파일 없음';
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName;
    } catch {
      return '알 수 없는 파일';
    }
  };

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    linkUrl: '',
    active: true,
    sortOrder: 0,
    imageUrl: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 카테고리 옵션
  const categoryOptions = [
    { value: '', label: '선택하지 않음' },
    { value: '운세', label: '운세' },
    { value: '타로', label: '타로' },
    { value: '심리테스트', label: '심리테스트' },
    { value: '기타', label: '기타' }
  ];

  // 콘텐츠 목록 조회
  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await getFeaturedContentsForAdmin();
      const data = response.contents || [];
      console.log('FeaturedContentManager received data:', data);
      setContents(data);
    } catch (error) {
      console.error('Failed to fetch featured contents:', error);
      setContents([]);
      toast.error('운세 콘텐츠 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleEdit = (content) => {
    setIsEditing(content.id);
    setEditForm({
      title: content.title || '',
      description: content.description || '',
      category: content.category || '',
      linkUrl: content.linkUrl || '',
      active: content.active,
      sortOrder: content.sortOrder,
      imageUrl: content.imageUrl || ''
    });
  };

  const handleSave = async (id) => {
    try {
      if (!editForm.title || !editForm.description || !editForm.imageUrl) {
        toast.error('제목, 설명, 이미지는 필수입니다.');
        return;
      }

      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('category', editForm.category);
      formData.append('linkUrl', editForm.linkUrl);
      formData.append('active', editForm.active);
      formData.append('sortOrder', editForm.sortOrder);
      if (editForm.imageUrl) {
        formData.append('imageUrl', editForm.imageUrl); // 이미지 URL 추가
      }

      await updateFeaturedContent(id, formData);
      setIsEditing(null);
      setEditForm({ title: '', description: '', category: '', linkUrl: '', active: true, sortOrder: 0, imageUrl: '' });
      fetchContents();
      toast.success('운세 콘텐츠가 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update featured content:', error);
      toast.error('운세 콘텐츠 수정에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({ title: '', description: '', category: '', linkUrl: '', active: true, sortOrder: 0, imageUrl: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 운세 콘텐츠를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const content = contents.find(c => c.id === id);

      // 이미지 파일 삭제 (백엔드에서 처리)
      if (content.imageUrl) {
        await deleteFile(content.imageUrl);
      }

      await deleteFeaturedContent(id);
      fetchContents();
      toast.success('운세 콘텐츠가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete featured content:', error);
      toast.error('운세 콘텐츠 삭제에 실패했습니다.');
    }
  };

  const handleFileUpload = async (e, contentId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadContentImage(file);

      if (contentId) {
        // 편집 중인 콘텐츠의 이미지 업데이트
        setEditForm({ ...editForm, imageUrl: result.data.publicUrl });
      } else {
        // 새 콘텐츠용 이미지
        setEditForm({ ...editForm, imageUrl: result.data.publicUrl });
      }

      toast.success('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();

    if (!editForm.title || !editForm.description || !editForm.imageUrl) {
      toast.error('제목, 설명, 이미지는 필수입니다.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('category', editForm.category);
      formData.append('linkUrl', editForm.linkUrl);
      formData.append('active', editForm.active);
      formData.append('sortOrder', editForm.sortOrder);
      formData.append('imageUrl', editForm.imageUrl); // 이미지 URL 추가

      await createFeaturedContent(formData);
      setEditForm({ title: '', description: '', category: '', linkUrl: '', active: true, sortOrder: 0, imageUrl: '' });
      setShowAddForm(false);
      fetchContents();
      toast.success('운세 콘텐츠가 생성되었습니다.');
    } catch (error) {
      console.error('Failed to create featured content:', error);
      toast.error('운세 콘텐츠 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      const content = contents.find(c => c.id === id);
      const formData = new FormData();
      formData.append('active', !content.active);

      await updateFeaturedContent(id, formData);
      fetchContents();
      toast.success('상태가 변경되었습니다.');
    } catch (error) {
      console.error('Failed to toggle active status:', error);
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">운세 콘텐츠 관리</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {showAddForm ? '목록 보기' : '새 운세 콘텐츠 추가'}
        </Button>
      </div>

      {/* 새 콘텐츠 추가 폼 */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">새 운세 콘텐츠 추가</h3>
          <form onSubmit={handleAddContent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="운세 콘텐츠 제목"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">설명 *</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="운세 콘텐츠 설명"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">링크 경로</label>
              <input
                type="text"
                value={editForm.linkUrl}
                onChange={(e) => setEditForm({ ...editForm, linkUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="/love-fortune 또는 /tarot/career"
              />
              <p className="text-xs text-gray-500 mt-1">"/" 로 시작하는 서비스 내 페이지 경로를 입력하세요.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
              <input
                type="number"
                value={editForm.sortOrder}
                onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">이미지 * (400x600px 권장)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                className="w-full text-sm text-gray-500 mb-2"
                disabled={uploading}
              />
              {uploading && <p className="text-xs text-blue-600">이미지 업로드 중...</p>}
              {editForm.imageUrl && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">메인페이지 미리보기:</p>
                  <div className="w-48 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="relative w-full" style={{ paddingBottom: '158.33%' }}>
                      <img
                        src={editForm.imageUrl}
                        alt="미리보기"
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          e.target.src = '/images/characters/webtoon/desert_fox_card_on_hands.jpeg';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-black mb-1">
                        {editForm.title || '제목'}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {editForm.description || '설명'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.active}
                  onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">활성화</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? '생성 중...' : '생성'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                취소
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 콘텐츠 목록 */}
      {!showAddForm && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : contents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">운세 콘텐츠가 없습니다.</p>
            </div>
          ) : (
            contents.map((content) => (
              <div key={content.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                  {/* Image Preview */}
                  <div className="lg:col-span-1">
                    <p className="text-xs font-medium text-gray-600 mb-2">메인페이지 미리보기:</p>
                    <div className="w-full max-w-[180px] bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="relative w-full" style={{ paddingBottom: '158.33%' }}>
                        <img
                          src={isEditing === content.id ? editForm.imageUrl || content.imageUrl : content.imageUrl}
                          alt={isEditing === content.id ? editForm.title || content.title : content.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                          onError={(e) => {
                            e.target.src = '/images/characters/webtoon/desert_fox_card_on_hands.jpeg';
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-black mb-1 truncate">
                          {isEditing === content.id ? editForm.title || content.title : content.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {isEditing === content.id ? editForm.description || content.description : content.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Form/Info */}
                  <div className="lg:col-span-4">
                    {isEditing === content.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          >
                            {categoryOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">링크 경로</label>
                          <input
                            type="text"
                            value={editForm.linkUrl}
                            onChange={(e) => setEditForm({ ...editForm, linkUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                            placeholder="/love-fortune"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
                          <input
                            type="number"
                            value={editForm.sortOrder}
                            onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">이미지 변경</label>
                          {content.imageUrl && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 mb-1">현재 이미지:</p>
                              <img
                                src={content.imageUrl}
                                alt="현재 이미지"
                                className="w-20 h-20 object-cover rounded border"
                                onError={(e) => {
                                  e.target.src = '/images/characters/webtoon/desert_fox_card_on_hands.jpeg';
                                }}
                              />
                              <p className="text-xs text-gray-500 mt-1">{getFileNameFromUrl(content.imageUrl)}</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, content.id)}
                            className="w-full text-xs text-gray-500"
                            disabled={uploading}
                          />
                          {uploading && <p className="text-xs text-blue-600 mt-1">이미지 업로드 중...</p>}
                        </div>
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.active}
                              onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">활성화</span>
                          </label>
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                          <Button
                            onClick={() => handleSave(content.id)}
                            disabled={uploading}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                          >
                            저장
                          </Button>
                          <Button
                            onClick={handleCancel}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{content.title}</h3>
                          <div className="flex gap-2">
                            {content.category && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                {content.category}
                              </span>
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              content.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {content.active ? '활성' : '비활성'}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{content.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex gap-4">
                            {content.linkUrl && <span>링크: {content.linkUrl}</span>}
                            <span>순서: {content.sortOrder}</span>
                            <span>조회: {content.viewCount || 0}</span>
                            <span>클릭: {content.clickCount || 0}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleActive(content.id)}
                              className={`text-xs px-2 py-1 rounded border ${
                                content.active
                                  ? 'text-red-600 hover:text-red-900'
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {content.active ? '비활성화' : '활성화'}
                            </button>
                            <button
                              onClick={() => handleEdit(content)}
                              className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded border"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(content.id)}
                              className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded border"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedContentManager;