import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getContents, createContent, updateContent, deleteContent, updateContentOrder } from '../../lib/api';
import { uploadContentImage, deleteFile } from '../../lib/storage';

const ContentManager = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 콘텐츠 목록 조회
  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await getContents();
      setContents(data || []);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
      alert('콘텐츠 목록을 불러오는데 실패했습니다.');
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
      image_url: content.image_url || '',
      link_url: content.link_url || '',
      active: content.active
    });
  };

  const handleSave = async (id) => {
    try {
      if (!editForm.title || !editForm.description || !editForm.image_url) {
        alert('제목, 설명, 이미지는 필수입니다.');
        return;
      }

      await updateContent(id, editForm);
      setIsEditing(null);
      setEditForm({ title: '', description: '', image_url: '', link_url: '', active: true });
      fetchContents();
      alert('콘텐츠가 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update content:', error);
      alert('콘텐츠 수정에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({ title: '', description: '', image_url: '', link_url: '', active: true });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const content = contents.find(c => c.id === id);

      // 이미지 파일 삭제 (백엔드에서 처리)
      if (content.image_url) {
        await deleteFile(content.image_url);
      }

      await deleteContent(id);
      fetchContents();
      alert('콘텐츠가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('콘텐츠 삭제에 실패했습니다.');
    }
  };

  const handleAdd = async () => {
    try {
      if (!editForm.title || !editForm.description || !editForm.image_url) {
        alert('제목, 설명, 이미지는 필수입니다.');
        return;
      }

      await createContent(editForm);
      setShowAddForm(false);
      setEditForm({ title: '', description: '', image_url: '', link_url: '', active: true });
      fetchContents();
      alert('콘텐츠가 추가되었습니다.');
    } catch (error) {
      console.error('Failed to create content:', error);
      alert('콘텐츠 추가에 실패했습니다.');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const content = contents.find(c => c.id === id);
      await updateContent(id, { active: !content.active });
      fetchContents();
    } catch (error) {
      console.error('Failed to toggle content active state:', error);
      alert('콘텐츠 상태 변경에 실패했습니다.');
    }
  };

  const handleFileUpload = async (e, contentId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadContentImage(file);

      if (contentId) {
        // 기존 콘텐츠 이미지 업데이트
        await updateContent(contentId, { image_url: result.publicUrl });
        fetchContents();
      } else {
        // 새 콘텐츠용 이미지
        setEditForm({ ...editForm, image_url: result.publicUrl });
      }

      alert('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const moveContent = async (fromIndex, toIndex) => {
    try {
      const newContents = [...contents];
      const [removed] = newContents.splice(fromIndex, 1);
      newContents.splice(toIndex, 0, removed);

      // 새로운 순서로 sort_order 업데이트
      const updates = newContents.map((content, index) => ({
        id: content.id,
        sort_order: index + 1
      }));

      await updateContentOrder(updates);
      fetchContents();
    } catch (error) {
      console.error('Failed to update content order:', error);
      alert('콘텐츠 순서 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">콘텐츠 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">콘텐츠 관리</h2>
          <p className="text-sm text-gray-600 mt-2">
            🖼️ 추천 이미지 크기: 400x600px (세로형 카드 형태)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            • 모든 필드는 필수입니다 • 이미지는 카드 형태로 표시됩니다
          </p>
        </div>
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
                value={editForm.link_url}
                onChange={(e) => setEditForm({ ...editForm, link_url: e.target.value })}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 * (400x600px 권장)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                className="w-full text-sm text-gray-500 mb-2"
                disabled={uploading}
              />
              {uploading && <p className="text-xs text-blue-600">이미지 업로드 중...</p>}
              {editForm.image_url && (
                <img
                  src={editForm.image_url}
                  alt="미리보기"
                  className="w-32 h-48 object-cover rounded border mt-2"
                />
              )}
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
              disabled={!editForm.title || !editForm.description || !editForm.image_url}
            >
              추가
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setEditForm({ title: '', description: '', image_url: '', link_url: '', active: true });
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
                  src={content.image_url}
                  alt={content.title}
                  className="w-full h-40 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div
                  className="hidden w-full h-40 bg-gray-200 rounded border flex items-center justify-center text-gray-500"
                >
                  이미지를 불러올 수 없습니다
                </div>
              </div>

              {/* Content Info */}
              <div className="lg:col-span-3">
                {isEditing === content.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
                        <input
                          type="text"
                          value={editForm.link_url}
                          onChange={(e) => setEditForm({ ...editForm, link_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이미지 변경</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, content.id)}
                        className="w-full text-xs text-gray-500"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{content.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{content.description}</p>
                    <p className="text-xs text-gray-500 mt-2">링크: {content.link_url || '없음'}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        content.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {content.active ? '활성화' : '비활성화'}
                      </span>
                      <span className="text-xs text-gray-500">순서: {content.sort_order}</span>
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