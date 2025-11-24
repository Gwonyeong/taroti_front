import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

const BannerManager = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      image: '/images/promotions/1.jpg',
      link: '#event1',
      alt: 'TaroTI 이벤트 1',
      active: true
    },
    {
      id: 2,
      image: '/images/promotions/2.jpg',
      link: '#event2',
      alt: 'TaroTI 이벤트 2',
      active: true
    },
    {
      id: 3,
      image: '/images/promotions/3.jpg',
      link: '#event3',
      alt: 'TaroTI 이벤트 3',
      active: true
    },
    {
      id: 4,
      image: '/images/promotions/4.jpg',
      link: '#event4',
      alt: 'TaroTI 이벤트 4',
      active: true
    },
    {
      id: 5,
      image: '/images/promotions/5.jpg',
      link: '#event5',
      alt: 'TaroTI 이벤트 5',
      active: true
    }
  ]);

  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    image: '',
    link: '',
    alt: '',
    active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (banner) => {
    setIsEditing(banner.id);
    setEditForm({
      image: banner.image,
      link: banner.link,
      alt: banner.alt,
      active: banner.active
    });
  };

  const handleSave = (id) => {
    setBanners(banners.map(banner =>
      banner.id === id
        ? { ...banner, ...editForm }
        : banner
    ));
    setIsEditing(null);
    setEditForm({ image: '', link: '', alt: '', active: true });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({ image: '', link: '', alt: '', active: true });
  };

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      setBanners(banners.filter(banner => banner.id !== id));
    }
  };

  const handleAdd = () => {
    if (!editForm.image || !editForm.alt) {
      alert('이미지 경로와 설명은 필수입니다.');
      return;
    }

    const newBanner = {
      id: Math.max(...banners.map(b => b.id), 0) + 1,
      ...editForm
    };

    setBanners([...banners, newBanner]);
    setShowAddForm(false);
    setEditForm({ image: '', link: '', alt: '', active: true });
  };

  const handleToggleActive = (id) => {
    setBanners(banners.map(banner =>
      banner.id === id
        ? { ...banner, active: !banner.active }
        : banner
    ));
  };

  const handleFileUpload = (e, bannerId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    // 실제 구현에서는 서버로 파일을 업로드하고 URL을 받아와야 합니다
    // 여기서는 임시로 URL.createObjectURL을 사용합니다
    const fileURL = URL.createObjectURL(file);

    if (bannerId) {
      // 기존 배너 이미지 업데이트
      setBanners(banners.map(banner =>
        banner.id === bannerId
          ? { ...banner, image: fileURL }
          : banner
      ));
    } else {
      // 새 배너용 이미지
      setEditForm({ ...editForm, image: fileURL });
    }

    alert('이미지가 업로드되었습니다. 실제 서비스에서는 서버에 업로드됩니다.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">배너 관리</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 경로 *
              </label>
              <input
                type="text"
                value={editForm.image}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="/images/promotions/new-banner.jpg"
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
                링크 URL
              </label>
              <input
                type="text"
                value={editForm.link}
                onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="#new-event"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명 (Alt Text) *
              </label>
              <input
                type="text"
                value={editForm.alt}
                onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="배너 설명"
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
            >
              추가
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setEditForm({ image: '', link: '', alt: '', active: true });
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
        {banners.map(banner => (
          <div key={banner.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              {/* Image Preview */}
              <div className="lg:col-span-1">
                <img
                  src={banner.image}
                  alt={banner.alt}
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

              {/* Banner Info */}
              <div className="lg:col-span-2">
                {isEditing === banner.id ? (
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        설명
                      </label>
                      <input
                        type="text"
                        value={editForm.alt}
                        onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-900">{banner.alt}</h3>
                    <p className="text-sm text-gray-600 mt-1">이미지: {banner.image}</p>
                    <p className="text-sm text-gray-600">링크: {banner.link || '없음'}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      banner.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.active ? '활성화' : '비활성화'}
                    </span>
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