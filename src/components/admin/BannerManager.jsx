import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getBanners, createBanner, updateBanner, deleteBanner, updateBannerOrder } from '../../lib/api';
import { uploadBannerImage, deleteFile } from '../../lib/storage';
import { toast } from 'sonner';

const BannerManager = () => {
  // URL에서 파일명 추출 함수
  const getFileNameFromUrl = (url) => {
    if (!url) return null;
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  };

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    pc_image_url: '',
    mobile_image_url: '',
    link_url: '',
    active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState({ pc: false, mobile: false });

  // 배너 목록 조회
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data || []);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      toast.error('배너 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEdit = (banner) => {
    setIsEditing(banner.id);
    setEditForm({
      title: banner.title || '',
      description: banner.description || '',
      pc_image_url: banner.pc_image_url || '',
      mobile_image_url: banner.mobile_image_url || '',
      link_url: banner.link_url || '',
      active: banner.active
    });
  };

  const handleSave = async (id) => {
    try {
      if (!editForm.title || !editForm.pc_image_url) {
        toast.error('제목과 PC 이미지는 필수입니다.');
        return;
      }

      await updateBanner(id, editForm);
      setIsEditing(null);
      setEditForm({ title: '', description: '', pc_image_url: '', mobile_image_url: '', link_url: '', active: true });
      fetchBanners();
      toast.success('배너가 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update banner:', error);
      toast.error('배너 수정에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({ title: '', description: '', pc_image_url: '', mobile_image_url: '', link_url: '', active: true });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const banner = banners.find(b => b.id === id);

      // 이미지 파일 삭제 (백엔드에서 처리)
      if (banner.pc_image_url) {
        await deleteFile(banner.pc_image_url);
      }

      if (banner.mobile_image_url) {
        await deleteFile(banner.mobile_image_url);
      }

      await deleteBanner(id);
      fetchBanners();
      toast.success('배너가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete banner:', error);
      toast.error('배너 삭제에 실패했습니다.');
    }
  };

  const handleAdd = async () => {
    try {
      if (!editForm.title) {
        toast.error('제목은 필수입니다.');
        return;
      }

      if (!editForm.pc_image_url) {
        toast.error('PC 이미지를 업로드해주세요.');
        return;
      }

      await createBanner(editForm);
      setShowAddForm(false);
      setEditForm({ title: '', description: '', pc_image_url: '', mobile_image_url: '', link_url: '', active: true });
      fetchBanners();
      toast.success('배너가 추가되었습니다.');
    } catch (error) {
      console.error('Failed to create banner:', error);
      toast.error('배너 추가에 실패했습니다.');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const banner = banners.find(b => b.id === id);
      await updateBanner(id, { active: !banner.active });
      fetchBanners();
    } catch (error) {
      console.error('Failed to toggle banner active state:', error);
      toast.error('배너 상태 변경에 실패했습니다.');
    }
  };

  const handleFileUpload = async (e, type, bannerId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading({ ...uploading, [type]: true });
      const result = await uploadBannerImage(file, type);
      const newImageUrl = result.data.publicUrl;

      if (bannerId) {
        // 기존 배너 이미지 업데이트 - editForm도 함께 업데이트
        const fieldName = type === 'mobile' ? 'mobile_image_url' : 'pc_image_url';
        setEditForm({ ...editForm, [fieldName]: newImageUrl });
      } else {
        // 새 배너용 이미지
        const fieldName = type === 'mobile' ? 'mobile_image_url' : 'pc_image_url';
        setEditForm({ ...editForm, [fieldName]: newImageUrl });
      }

      toast.success('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const moveItem = async (fromIndex, toIndex) => {
    try {
      const newBanners = [...banners];
      const [removed] = newBanners.splice(fromIndex, 1);
      newBanners.splice(toIndex, 0, removed);

      // 새로운 순서로 sort_order 업데이트
      const updates = newBanners.map((banner, index) => ({
        id: banner.id,
        sort_order: index + 1
      }));

      await updateBannerOrder(updates);
      fetchBanners();
    } catch (error) {
      console.error('Failed to update banner order:', error);
      toast.error('배너 순서 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">배너 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">배너 관리</h2>
          <p className="text-sm text-gray-600 mt-2">
            📱 추천 이미지 크기: PC 1920x500px (16:10), 모바일 768x384px (2:1)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            • PC 이미지는 필수입니다 • 모바일 이미지가 없으면 PC 이미지가 사용됩니다
          </p>
          <p className="text-xs text-blue-600 mt-1">
            ℹ️ 실제 표시 높이 - PC: 500px, 태블릿: 384px, 모바일: 288px (object-cover로 비율 유지)
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-black hover:bg-gray-800 text-white"
        >
          새 배너 추가
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">새 배너 추가</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목 *
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="배너 제목"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="배너에 대한 설명"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PC 이미지 * (1920x500px)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'pc')}
                className="w-full text-sm text-gray-500 mb-2"
                disabled={uploading.pc}
              />
              {uploading.pc && <p className="text-xs text-blue-600">PC 이미지 업로드 중...</p>}
              {editForm.pc_image_url && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">메인페이지 PC 미리보기:</p>
                  <div className="w-full relative rounded-lg overflow-hidden shadow-md" style={{ paddingBottom: '31.25%' }}>
                    <img
                      src={editForm.pc_image_url}
                      alt="PC 미리보기"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {editForm.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white text-sm font-semibold">{editForm.title}</p>
                        {editForm.description && (
                          <p className="text-white/90 text-xs mt-1">{editForm.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                모바일 이미지 (768x384px)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'mobile')}
                className="w-full text-sm text-gray-500 mb-2"
                disabled={uploading.mobile}
              />
              {uploading.mobile && <p className="text-xs text-blue-600">모바일 이미지 업로드 중...</p>}
              {editForm.mobile_image_url && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">메인페이지 모바일 미리보기:</p>
                  <div className="w-full relative rounded-lg overflow-hidden shadow-md" style={{ paddingBottom: '52.08%' }}>
                    <img
                      src={editForm.mobile_image_url}
                      alt="모바일 미리보기"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {editForm.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-xs font-semibold">{editForm.title}</p>
                        {editForm.description && (
                          <p className="text-white/90 text-xs mt-0.5 line-clamp-1">{editForm.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                placeholder="#new-event"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="new-active"
                checked={editForm.active}
                onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="new-active" className="text-sm font-medium text-gray-700">
                활성화
              </label>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button
              onClick={handleAdd}
              className="bg-black hover:bg-gray-800 text-white"
              disabled={!editForm.title}
            >
              추가
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setEditForm({ title: '', description: '', pc_image_url: '', mobile_image_url: '', link_url: '', active: true });
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black"
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* Banner List */}
      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div key={banner.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              {/* Image Preview */}
              <div className="lg:col-span-1">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">PC 미리보기</p>
                    <div className="w-full relative rounded-lg overflow-hidden shadow-sm" style={{ paddingBottom: '31.25%' }}>
                      <img
                        src={banner.pc_image_url}
                        alt={`${banner.title} PC`}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden absolute inset-0 w-full h-full bg-gray-200 items-center justify-center text-gray-500 text-xs">
                        PC 이미지 없음
                      </div>
                      {banner.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                          <p className="text-white text-xs font-semibold truncate">{banner.title}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">모바일 미리보기</p>
                    <div className="w-full relative rounded-lg overflow-hidden shadow-sm" style={{ paddingBottom: '52.08%' }}>
                      <img
                        src={banner.mobile_image_url || banner.pc_image_url}
                        alt={`${banner.title} Mobile`}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden absolute inset-0 w-full h-full bg-gray-200 items-center justify-center text-gray-500 text-xs">
                        {banner.mobile_image_url ? '모바일 이미지 없음' : 'PC 이미지 사용'}
                      </div>
                      {banner.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                          <p className="text-white text-xs font-semibold truncate">{banner.title}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Info */}
              <div className="lg:col-span-2">
                {isEditing === banner.id ? (
                  <div className="space-y-3">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
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
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">PC 이미지 변경</label>
                        {banner.pc_image_url && (
                          <p className="text-xs text-gray-600 mb-1">현재: {getFileNameFromUrl(banner.pc_image_url)}</p>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'pc', banner.id)}
                          className="w-full text-xs text-gray-500"
                          disabled={uploading.pc}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">모바일 이미지 변경</label>
                        {banner.mobile_image_url ? (
                          <p className="text-xs text-gray-600 mb-1">현재: {getFileNameFromUrl(banner.mobile_image_url)}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mb-1">PC 이미지 사용 중</p>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'mobile', banner.id)}
                          className="w-full text-xs text-gray-500"
                          disabled={uploading.mobile}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{banner.description}</p>
                    <p className="text-sm text-gray-600">링크: {banner.link_url || '없음'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        banner.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.active ? '활성화' : '비활성화'}
                      </span>
                      <span className="text-xs text-gray-500">순서: {banner.sort_order}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="lg:col-span-1">
                {isEditing === banner.id ? (
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => handleSave(banner.id)}
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
                      onClick={() => handleEdit(banner)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(banner.id)}
                      className={`text-white text-sm ${
                        banner.active
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {banner.active ? '비활성화' : '활성화'}
                    </Button>
                    <div className="flex space-x-1">
                      {index > 0 && (
                        <Button
                          onClick={() => moveItem(index, index - 1)}
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1"
                        >
                          ↑
                        </Button>
                      )}
                      {index < banners.length - 1 && (
                        <Button
                          onClick={() => moveItem(index, index + 1)}
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1"
                        >
                          ↓
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDelete(banner.id)}
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

      {banners.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          등록된 배너가 없습니다.
        </div>
      )}
    </div>
  );
};

export default BannerManager;