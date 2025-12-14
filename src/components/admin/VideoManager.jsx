import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Instagram } from 'lucide-react';
import InstagramPublisher from './InstagramPublisher';

const VideoManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);
  const [videoType, setVideoType] = useState('weekly-fortune');
  const [customTitle, setCustomTitle] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState(null);

  // Instagram 게시 관련 상태
  const [publishDialog, setPublishDialog] = useState({
    isOpen: false,
    mediaUrl: '',
    mediaType: 'VIDEO',
    title: '',
    metadata: {}
  });

  // 비디오 타입별 설정
  const videoTypeOptions = {
    'weekly-fortune': {
      label: '주간 운세',
      description: '다음 주 월요일~일요일 기간이 자동으로 제목에 포함됩니다',
      placeholder: '커스텀 제목을 입력하세요 (비워두면 자동 생성)'
    },
    'true-feelings': {
      label: '그 사람의 속마음은?',
      description: '고정 제목 "그 사람의 속마음은?"이 사용됩니다',
      placeholder: '커스텀 제목을 입력하세요 (비워두면 기본 제목 사용)'
    }
  };

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
      console.log('📺 비디오 타입:', videoType);
      console.log('✏️ 커스텀 제목:', customTitle || '자동 생성');

      const requestBody = {
        videoType: videoType
      };

      // 커스텀 제목이 있으면 추가
      if (customTitle.trim()) {
        requestBody.customTitle = customTitle.trim();
      }

      const response = await fetch('/api/video/test/card-flip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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

  // 생성된 영상 목록 조회
  const fetchVideoList = async () => {
    setIsLoadingList(true);
    setListError(null);

    try {
      const response = await fetch('/api/video/list?limit=20');
      const data = await response.json();

      if (data.success) {
        setVideoList(data.data.videos);
      } else {
        setListError('영상 목록 로드 실패');
      }
    } catch (error) {
      setListError(`영상 목록 로드 오류: ${error.message}`);
    } finally {
      setIsLoadingList(false);
    }
  };

  // 컴포넌트 마운트시 영상 목록 로드
  React.useEffect(() => {
    fetchVideoList();
  }, []);

  // 영상 생성 성공 후 목록 새로고침
  React.useEffect(() => {
    if (lastResult && lastResult.type === 'video_generation') {
      fetchVideoList();
    }
  }, [lastResult]);

  // 생성 시간 포맷
  const formatDuration = (ms) => {
    return `${ms / 1000}초`;
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  // 카드 배열을 문자열로 변환
  const formatCards = (cards) => {
    if (Array.isArray(cards)) {
      return cards.join(', ');
    }
    return '알 수 없음';
  };

  // Instagram 게시 다이얼로그 열기
  const openInstagramPublish = (video) => {
    const defaultCaption = generateVideoCaption(video);

    setPublishDialog({
      isOpen: true,
      mediaUrl: video.publicUrl,
      mediaType: 'VIDEO',
      title: video.title,
      defaultCaption: defaultCaption,
      metadata: {
        videoId: video.id,
        videoType: video.videoType,
        selectedCards: video.selectedCards,
        createdAt: video.createdAt
      }
    });
  };

  // Instagram 게시 다이얼로그 닫기
  const closeInstagramPublish = () => {
    setPublishDialog({
      isOpen: false,
      mediaUrl: '',
      mediaType: 'VIDEO',
      title: '',
      metadata: {}
    });
  };

  // 비디오용 기본 캡션 생성
  const generateVideoCaption = (video) => {
    const typeLabel = videoTypeOptions[video.videoType]?.label || video.videoType;
    const cardsText = Array.isArray(video.selectedCards) ?
      `선택된 카드: ${video.selectedCards.join(', ')}번` : '';

    return `✨ ${typeLabel} ✨

${cardsText ? `${cardsText}\n` : ''}
타로 카드로 보는 운세를 확인해보세요!

🔮 매주 새로운 운세가 업데이트됩니다
💫 당신만을 위한 특별한 메시지`;
  };

  // Instagram 게시 성공 후 처리
  const handlePublishSuccess = (publishData) => {
    console.log('Instagram 게시 성공:', publishData);
    // 필요시 비디오 목록 새로고침 등 추가 작업
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
            • 10초 길이의 타로카드 뒤집기 애니메이션<br/>
            • 썸네일 인트로 (1.5초) + 카드 뒤집기 (6초) + 엔딩 메시지 (2.5초)<br/>
            • 4개의 랜덤 카드 (중복 없음)<br/>
            • 인스타그램 게시물 크기 (4:5 비율, 1080x1350)<br/>
            • JSON 파일에서 카드별 설명 자동 로드
          </p>

          {/* 비디오 타입 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              영상 종류 선택
            </label>
            <div className="space-y-3">
              {Object.entries(videoTypeOptions).map(([type, config]) => (
                <div key={type} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id={type}
                    name="videoType"
                    value={type}
                    checked={videoType === type}
                    onChange={(e) => setVideoType(e.target.value)}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    disabled={isGenerating}
                  />
                  <div className="flex-1">
                    <label htmlFor={type} className="block text-sm font-medium text-gray-900 cursor-pointer">
                      {config.label}
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 커스텀 제목 입력 */}
          <div className="mb-4">
            <label htmlFor="customTitle" className="block text-sm font-medium text-gray-700 mb-2">
              커스텀 제목 (선택사항)
            </label>
            <input
              type="text"
              id="customTitle"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={videoTypeOptions[videoType].placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-1">
              비워두면 {videoType === 'weekly-fortune' ? '다음 주 기간이 자동으로 생성됩니다' : '기본 제목이 사용됩니다'}
            </p>
          </div>

          <Button
            onClick={generateCardFlipVideo}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400"
          >
            {isGenerating ? '영상 생성 중...' : `${videoTypeOptions[videoType].label} 영상 생성`}
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
                  <div><strong>영상 종류:</strong> {videoTypeOptions[lastResult.data.data.videoType]?.label || lastResult.data.data.videoType}</div>
                  <div><strong>파일명:</strong> {lastResult.data.data.filename}</div>
                  <div><strong>길이:</strong> {lastResult.data.data.duration}ms ({lastResult.data.data.duration / 1000}초)</div>
                  <div><strong>선택된 카드:</strong> {lastResult.data.data.cards.join(', ')}</div>
                  <div><strong>메시지:</strong> {lastResult.data.data.message}</div>
                  {lastResult.data.data.cardContent && (
                    <div><strong>콘텐츠 제목:</strong> {lastResult.data.data.cardContent.title}</div>
                  )}
                  {lastResult.data.data.generatedImages && lastResult.data.data.generatedImages.length > 0 && (
                    <div><strong>생성된 이미지:</strong> {lastResult.data.data.generatedImages.length}개</div>
                  )}
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
                      style={{ aspectRatio: '4/5' }}
                    >
                      <source src={lastResult.data.data.publicUrl} type="video/webm" />
                      브라우저에서 영상을 지원하지 않습니다.
                    </video>
                  </div>
                </div>

                {/* 생성된 이미지들 미리보기 */}
                {lastResult.data.data.generatedImages && lastResult.data.data.generatedImages.length > 0 && (
                  <div className="mt-6">
                    <strong>생성된 추가 이미지들:</strong>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {lastResult.data.data.generatedImages.map((image, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden bg-white">
                          <div className="p-2 bg-gray-50 border-b">
                            <div className="text-xs font-semibold text-gray-700">
                              {image.type === 'ending' ? '마무리 페이지' : `카드 ${image.cardIndex}`}
                              {image.cardName && <span className="text-gray-500 ml-1">({image.cardName})</span>}
                            </div>
                          </div>
                          <a
                            href={image.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block hover:opacity-90 transition-opacity"
                          >
                            <img
                              src={image.publicUrl}
                              alt={`생성된 이미지 ${index + 1}`}
                              className="w-full h-auto"
                              style={{ aspectRatio: '4/5' }}
                            />
                          </a>
                          <div className="p-2 bg-gray-50 border-t">
                            <button
                              onClick={() => navigator.clipboard.writeText(image.publicUrl)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              링크 복사
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  썸네일 인트로와 카드 뒤집기 애니메이션 영상을 생성하고 있습니다. 약 30초~1분 정도 소요됩니다...
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
          <div><strong>2. 영상 종류 선택:</strong> 주간 운세 또는 속마음 중에서 선택합니다.</div>
          <div><strong>3. 영상 생성:</strong> 선택한 종류의 카드 뒤집기 애니메이션 영상을 생성합니다.</div>
          <div><strong>4. 결과 확인:</strong> 생성된 영상을 미리보기로 확인할 수 있습니다.</div>
          <div><strong>5. 다운로드:</strong> 링크를 클릭하여 영상을 다운로드하거나 공유할 수 있습니다.</div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <strong>📊 영상 종류:</strong>
            <ul className="mt-1 text-xs space-y-1">
              <li>• <strong>주간 운세:</strong> 다음 주 월~일 기간 자동 생성, 타로 카드별 주간 운세 설명 포함</li>
              <li>• <strong>그 사람의 속마음:</strong> 고정 제목, 타로 카드별 속마음 해석 포함</li>
            </ul>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <strong>⚠️ 주의사항:</strong>
            <ul className="mt-1 text-xs space-y-1">
              <li>• 영상 생성에는 시간이 걸릴 수 있습니다 (30초~1분)</li>
              <li>• 생성된 영상은 Supabase에 자동 업로드됩니다</li>
              <li>• 각 영상에는 랜덤 카드 4장이 선택됩니다 (중복 없음)</li>
              <li>• JSON 파일에서 카드별 설명을 자동으로 가져옵니다</li>
              <li>• 커스텀 제목을 비우면 자동으로 생성됩니다</li>
            </ul>
          </div>
        </div>

        {/* 생성된 영상 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              📺 생성된 영상 목록
            </h2>
            <Button
              onClick={fetchVideoList}
              disabled={isLoadingList}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              {isLoadingList ? '로드 중...' : '새로고침'}
            </Button>
          </div>

          {listError && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-red-700">{listError}</p>
            </div>
          )}

          {isLoadingList ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">영상 목록을 로드하고 있습니다...</p>
            </div>
          ) : videoList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">아직 생성된 영상이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videoList.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {video.title}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><strong>영상 종류:</strong> {videoTypeOptions[video.videoType]?.label || video.videoType || '알 수 없음'}</div>
                        <div><strong>생성 시간:</strong> {formatDate(video.createdAt)}</div>
                        <div><strong>영상 길이:</strong> {formatDuration(video.duration)}</div>
                        <div><strong>선택된 카드:</strong> {formatCards(video.selectedCards)}</div>
                        <div><strong>파일명:</strong> {video.filename}</div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`px-2 py-1 rounded text-xs ${
                        video.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {video.isPublished ? '게시됨' : '미게시'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={video.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      영상 보기
                    </a>
                    <span className="text-gray-300 text-sm">|</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(video.publicUrl)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      링크 복사
                    </button>
                    <span className="text-gray-300 text-sm">|</span>
                    <button
                      onClick={() => openInstagramPublish(video)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      <Instagram className="h-3 w-3" />
                      Instagram 게시
                    </button>
                  </div>

                  {/* 영상 미리보기 */}
                  <div className="mt-3">
                    <video
                      controls
                      className="max-w-xs border rounded"
                      style={{ aspectRatio: '4/5' }}
                    >
                      <source src={video.publicUrl} type="video/webm" />
                      브라우저에서 영상을 지원하지 않습니다.
                    </video>
                  </div>

                  {/* 연결된 이미지들 미리보기 */}
                  {video.images && video.images.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        연결된 이미지 ({video.images.length}개)
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {video.images.map((image, idx) => (
                          <div key={image.id} className="relative group">
                            <a
                              href={image.publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={image.publicUrl}
                                alt={`이미지 ${idx + 1}`}
                                className="w-full h-auto rounded border hover:opacity-90 transition-opacity"
                                style={{ aspectRatio: '4/5' }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                                  {image.imageType === 'ending' ? '마무리' : `카드 ${image.cardIndex}`}
                                </span>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instagram 게시 다이얼로그 */}
      <InstagramPublisher
        isOpen={publishDialog.isOpen}
        onClose={closeInstagramPublish}
        mediaUrl={publishDialog.mediaUrl}
        mediaType={publishDialog.mediaType}
        title={publishDialog.title}
        defaultCaption={publishDialog.defaultCaption}
        defaultHashtags="#타로 #운세 #타로티 #주간운세 #그사람의속마음 #타로카드 #점술 #미래 #운명"
        onPublishSuccess={handlePublishSuccess}
        metadata={publishDialog.metadata}
      />
    </div>
  );
};

export default VideoManager;