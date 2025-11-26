import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/ui/Navigation';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    birthDate: '',
    gender: '',
    mbti: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // 로그인되지 않은 경우 홈으로 리디렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        birthDate: user.birthDate || '',
        gender: user.gender || '',
        mbti: user.mbti || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // 기본 유효성 검사
      if (!formData.birthDate || !formData.gender || !formData.mbti) {
        toast.error('모든 필드를 입력해주세요.');
        return;
      }

      // 생년월일 형식 검증 (YYMMDD)
      const birthDateRegex = /^\d{6}$/;
      if (!birthDateRegex.test(formData.birthDate)) {
        toast.error('생년월일은 YYMMDD 형식으로 입력해주세요.');
        return;
      }

      await updateProfile(formData);
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      toast.error('프로필 업데이트에 실패했습니다.');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <Navigation fixed />
        <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
          <div className="h-16"></div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto mb-4"></div>
              <p className="text-charcoal">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 리디렉트 처리됨
  }

  return (
    <div className="min-h-screen bg-offWhite flex justify-center">
      <Navigation fixed />
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col min-h-screen">
        {/* 고정 네비게이션을 위한 여백 */}
        <div className="h-16"></div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-charcoal mb-2">프로필 설정</h1>
            <p className="text-gray-600">개인 정보를 수정하실 수 있습니다.</p>
          </div>

          {/* 프로필 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              {user?.profileImageUrl && (
                <img
                  src={user.profileImageUrl}
                  alt="프로필"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="text-lg font-medium text-charcoal">{user?.nickname}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* 폼 */}
          <div className="space-y-6">
            {/* 생년월일 */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                생년월일
              </label>
              <input
                type="text"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                placeholder="YYMMDD (예: 951225)"
                maxLength={6}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                6자리 숫자로 입력해주세요 (예: 951225)
              </p>
            </div>

            {/* 성별 */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                성별
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'gender', value: '남성' } })}
                  className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                    formData.gender === '남성'
                      ? 'border-charcoal bg-charcoal text-white'
                      : 'border-gray-300 bg-white text-charcoal hover:border-gray-400'
                  }`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'gender', value: '여성' } })}
                  className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                    formData.gender === '여성'
                      ? 'border-charcoal bg-charcoal text-white'
                      : 'border-gray-300 bg-white text-charcoal hover:border-gray-400'
                  }`}
                >
                  여성
                </button>
              </div>
            </div>

            {/* 성격 유형 */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                성격 유형
              </label>
              <div className="grid grid-cols-4 gap-2">
                {mbtiTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'mbti', value: type } })}
                    className={`p-2 text-sm rounded-lg border transition-colors duration-200 ${
                      formData.mbti === type
                        ? 'border-charcoal bg-charcoal text-white'
                        : 'border-gray-300 bg-white text-charcoal hover:border-gray-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>

          {/* 뒤로가기 */}
          <div className="pt-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 text-charcoal py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              뒤로가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;