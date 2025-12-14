import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { AlertCircle, Instagram, Loader2 } from 'lucide-react';
import instagramConfig from '../../config/instagram';

const InstagramPublisher = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaType = 'IMAGE', // IMAGE, VIDEO, CAROUSEL_ALBUM
  title = '',
  defaultCaption = '',
  defaultHashtags = '#타로 #운세 #타로티 #주간운세 #그사람의속마음',
  onPublishSuccess = () => {},
  metadata = {} // 추가 메타데이터 (videoId, imageIds 등)
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState(defaultHashtags);
  const [scheduleTime, setScheduleTime] = useState('');
  const [connectionError, setConnectionError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // 다이얼로그가 열릴 때마다 연결 상태 확인
      checkConnectionStatus();
      // 기본 캡션 설정
      setCaption(defaultCaption || title || '');
    }
  }, [isOpen, defaultCaption, title]);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/status`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.isConnected) {
        setIsConnected(true);
        setConnectionError('');
      } else {
        setIsConnected(false);
        setConnectionError('Instagram 계정이 연결되지 않았습니다.');
      }
    } catch (error) {
      console.error('연결 상태 확인 실패:', error);
      setIsConnected(false);
      setConnectionError('Instagram 연결 상태를 확인할 수 없습니다.');
    }
  };

  const handlePublish = async () => {
    if (!isConnected) {
      toast.error('Instagram 계정을 먼저 연결해주세요.');
      return;
    }

    if (!mediaUrl) {
      toast.error('게시할 미디어가 없습니다.');
      return;
    }

    setIsPublishing(true);

    try {
      // 캡션과 해시태그 결합
      const fullCaption = `${caption}\n\n${hashtags}`.trim();

      const requestBody = {
        mediaUrl,
        mediaType,
        caption: fullCaption,
        metadata: {
          ...metadata,
          title,
          source: 'admin_panel'
        }
      };

      // 예약 게시 시간이 설정된 경우
      if (scheduleTime) {
        requestBody.scheduleTime = new Date(scheduleTime).toISOString();
      }

      const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(
          scheduleTime
            ? `Instagram 게시물이 ${new Date(scheduleTime).toLocaleString('ko-KR')}에 예약되었습니다.`
            : 'Instagram에 성공적으로 게시되었습니다.'
        );

        // 성공 콜백 실행
        onPublishSuccess(result.data);

        // 다이얼로그 닫기
        handleClose();
      } else {
        throw new Error(result.error || '게시 실패');
      }
    } catch (error) {
      console.error('Instagram 게시 오류:', error);
      toast.error(`게시 실패: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClose = () => {
    // 상태 초기화
    setCaption('');
    setHashtags(defaultHashtags);
    setScheduleTime('');
    setConnectionError('');
    onClose();
  };

  const getMediaTypeLabel = () => {
    switch (mediaType) {
      case 'VIDEO':
        return '영상';
      case 'CAROUSEL_ALBUM':
        return '캐러셀';
      default:
        return '이미지';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Instagram 게시하기
          </DialogTitle>
          <DialogDescription>
            {title && <div className="font-semibold mt-2">{title}</div>}
            <div className="text-sm text-gray-500 mt-1">
              {getMediaTypeLabel()} 콘텐츠를 Instagram에 게시합니다.
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 연결 상태 */}
          {!isConnected && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800">{connectionError}</p>
                <Button
                  size="sm"
                  variant="link"
                  className="text-yellow-700 p-0 h-auto mt-1"
                  onClick={() => window.location.href = '/admin?tab=instagram'}
                >
                  Instagram 연결 설정하기 →
                </Button>
              </div>
            </div>
          )}

          {/* 미디어 미리보기 */}
          {mediaUrl && (
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <div className="p-2 bg-gray-100 text-xs text-gray-600">
                미리보기
              </div>
              <div className="p-4 flex justify-center">
                {mediaType === 'VIDEO' ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="max-w-full max-h-[200px] rounded"
                    style={{ aspectRatio: '4/5' }}
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Instagram 게시물 미리보기"
                    className="max-w-full max-h-[200px] object-contain rounded"
                  />
                )}
              </div>
            </div>
          )}

          {/* 캡션 입력 */}
          <div className="space-y-2">
            <Label htmlFor="caption">캡션</Label>
            <Textarea
              id="caption"
              placeholder="게시물 설명을 입력하세요..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {caption.length}/2200자
            </p>
          </div>

          {/* 해시태그 입력 */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">해시태그</Label>
            <Textarea
              id="hashtags"
              placeholder="#타로 #운세"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              각 해시태그는 #으로 시작해야 합니다.
            </p>
          </div>

          {/* 예약 게시 (선택사항) */}
          <div className="space-y-2">
            <Label htmlFor="scheduleTime">
              예약 게시 (선택사항)
            </Label>
            <Input
              id="scheduleTime"
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-500">
              비워두면 즉시 게시됩니다.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPublishing}
          >
            취소
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!isConnected || isPublishing || !mediaUrl}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                게시 중...
              </>
            ) : scheduleTime ? (
              '예약 게시'
            ) : (
              '지금 게시'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstagramPublisher;