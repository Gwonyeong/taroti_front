import React, { useState } from 'react';
import { Button } from '../ui/button';

const VideoManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);

  // 영상 서비스 상태 확인
  const checkVideoServiceStatus = async () => {
    try {
      const response = await fetch('/api/video/status');
      const data = await response.json();

      if (data.success) {
        setLastResult({
          type: 'status',
          data: data
        });
        setError(null);
      } else {
        setError('영상 서비스 상태 확인 실패');
      }
    } catch (error) {
      setError(`영상 서비스 상태 확인 오류: ${error.message}`);
    }
  };

  // 카드 뒤집기 영상 생성 테스트
  const generateCardFlipVideo = async () => {
    setIsGenerating(true);
    setError(null);
    setLastResult(null);

    try {
      console.log('🎬 카드 뒤집기 영상 생성 요청 시작');

      const response = await fetch('/api/video/test/card-flip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setLastResult({
          type: 'video_generation',
          data: data
        });
        console.log('✅ 카드 뒤집기 영상 생성 완료:', data);
      } else {
        setError(data.error || '영상 생성 실패');
      }
    } catch (error) {
      console.error('❌ 영상 생성 오류:', error);
      setError(`영상 생성 오류: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎬 영상 생성 테스트
        </h2>
        <p className="text-gray-600 mb-6">
          인스타그램 콘텐츠용 애니메이션 영상을 생성하고 테스트할 수 있습니다.
        </p>

        {/* 상태 확인 섹션 */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">📊 서비스 상태 확인</h3>
          <Button
            onClick={checkVideoServiceStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            영상 서비스 상태 확인
          </Button>
        </div>

        {/* 영상 생성 섹션 */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">🎯 카드 뒤집기 영상 생성</h3>
          <p className="text-sm text-gray-600 mb-4">
            • 7초 길이의 타로카드 뒤집기 애니메이션<br/>
            • 4개의 랜덤 카드 (중복 없음)<br/>
            • 4초 후 순차적 카드 뒤집기<br/>
            • 인스타그램 스토리 크기 (9:16 비율)
          </p>
          <Button
            onClick={generateCardFlipVideo}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400"
          >
            {isGenerating ? '영상 생성 중...' : '카드 뒤집기 영상 생성'}
          </Button>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">❌ 오류</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 결과 표시 */}
        {lastResult && (
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              ✅ {lastResult.type === 'status' ? '서비스 상태' : '영상 생성 결과'}
            </h3>

            {lastResult.type === 'status' && (
              <div className="space-y-2 text-sm">
                <div><strong>메시지:</strong> {lastResult.data.message}</div>
                <div><strong>지원 기능:</strong> {lastResult.data.features.join(', ')}</div>
                <div><strong>지원 포맷:</strong> {lastResult.data.supported_formats.join(', ')}</div>
                <div><strong>최대 길이:</strong> {lastResult.data.max_duration}</div>
              </div>
            )}

            {lastResult.type === 'video_generation' && (
              <div className="space-y-3">
                <div className="text-sm space-y-2">
                  <div><strong>파일명:</strong> {lastResult.data.data.filename}</div>
                  <div><strong>길이:</strong> {lastResult.data.data.duration}ms ({lastResult.data.data.duration / 1000}초)</div>
                  <div><strong>선택된 카드:</strong> {lastResult.data.data.cards.join(', ')}</div>
                  <div><strong>메시지:</strong> {lastResult.data.data.message}</div>
                </div>

                <div className="mt-4">
                  <strong>생성된 영상:</strong>
                  <div className="mt-2 p-3 bg-white border rounded">
                    <a
                      href={lastResult.data.data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {lastResult.data.data.publicUrl}
                    </a>
                  </div>
                </div>

                {/* 영상 미리보기 */}
                <div className="mt-4">
                  <strong>영상 미리보기:</strong>
                  <div className="mt-2 max-w-xs">
                    <video
                      controls
                      className="w-full border rounded-lg"
                      style={{ aspectRatio: '9/16' }}
                    >
                      <source src={lastResult.data.data.publicUrl} type="video/webm" />
                      브라우저에서 영상을 지원하지 않습니다.
                    </video>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 로딩 상태 */}
        {isGenerating && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">🎬 영상 생성 중</h3>
                <p className="text-blue-700">
                  애니메이션 영상을 생성하고 있습니다. 약 30초~1분 정도 소요됩니다...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 사용법 안내 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📖 사용법 안내</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div><strong>1. 서비스 상태 확인:</strong> 영상 서비스가 정상 작동하는지 확인합니다.</div>
          <div><strong>2. 영상 생성:</strong> 카드 뒤집기 애니메이션 영상을 생성합니다.</div>
          <div><strong>3. 결과 확인:</strong> 생성된 영상을 미리보기로 확인할 수 있습니다.</div>
          <div><strong>4. 다운로드:</strong> 링크를 클릭하여 영상을 다운로드하거나 공유할 수 있습니다.</div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <strong>⚠️ 주의사항:</strong>
          <ul className="mt-1 text-xs space-y-1">
            <li>• 영상 생성에는 시간이 걸릴 수 있습니다 (30초~1분)</li>
            <li>• 생성된 영상은 Supabase에 자동 업로드됩니다</li>
            <li>• 각 영상에는 랜덤 카드가 선택됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoManager;