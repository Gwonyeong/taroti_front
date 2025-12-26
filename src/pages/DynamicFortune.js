import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DynamicChatFortune from '../components/fortune/DynamicChatFortune';
import { toast } from 'sonner';

const DynamicFortune = () => {
  const { templateKey } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/fortune-templates/${templateKey}`
        );

        const data = await response.json();

        if (data.success) {
          setTemplate(data.template);
        } else {
          throw new Error(data.message || '템플릿을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError(err.message);
        toast.error('템플릿을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (templateKey) {
      fetchTemplate();
    }
  }, [templateKey]);

  const handleSessionCreated = (sessionId) => {
    // 세션 ID를 localStorage에 저장 (결과 페이지에서 사용)
    localStorage.setItem(`fortune_session_${templateKey}`, sessionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">템플릿을 불러오는 중...</div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">{error || '템플릿을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <DynamicChatFortune
      template={template}
      onSessionCreated={handleSessionCreated}
    />
  );
};

export default DynamicFortune;