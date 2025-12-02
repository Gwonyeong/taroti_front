import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import instagramConfig from '../../config/instagram';

const InstagramCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        toast.error(`Instagram 연결 실패: ${error}`);
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        toast.error('인증 코드를 받지 못했습니다.');
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
        return;
      }

      try {
        setStatus('processing');

        // 백엔드로 인증 코드 전송하여 액세스 토큰 교환
        const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          toast.success('Instagram 연결이 완료되었습니다!');

          // 3초 후 어드민 페이지로 리다이렉트
          setTimeout(() => {
            navigate('/admin');
          }, 3000);
        } else {
          throw new Error(data.message || '토큰 교환 실패');
        }
      } catch (error) {
        console.error('Instagram callback 처리 오류:', error);
        setStatus('error');
        toast.error('Instagram 연결 처리 중 오류가 발생했습니다.');

        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            status === 'processing'
              ? 'bg-blue-100'
              : status === 'success'
                ? 'bg-green-100'
                : 'bg-red-100'
          }`}>
            {status === 'processing' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            )}
            {status === 'success' && (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {status === 'processing' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900">Instagram 연결 중...</h2>
              <p className="text-gray-600">
                Instagram 계정을 연결하고 있습니다. 잠시만 기다려주세요.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <h2 className="text-2xl font-bold text-green-900">연결 완료!</h2>
              <p className="text-gray-600">
                Instagram 계정이 성공적으로 연결되었습니다.
                자동으로 어드민 페이지로 이동합니다.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <h2 className="text-2xl font-bold text-red-900">연결 실패</h2>
              <p className="text-gray-600">
                Instagram 연결 중 오류가 발생했습니다.
                어드민 페이지로 이동하여 다시 시도해주세요.
              </p>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate('/admin')}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              어드민 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramCallback;