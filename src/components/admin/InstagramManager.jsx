import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import instagramConfig, { getInstagramAuthUrl } from '../../config/instagram';

const InstagramManager = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    // 저장된 연결 상태 확인
    checkConnectionStatus();
    // 인스타그램 인증 URL 생성
    generateAuthUrl();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/status`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.isConnected) {
        setIsConnected(true);
        setAccessToken(data.accessToken);
        setUserInfo(data.userInfo);
      }
    } catch (error) {
      console.error('연결 상태 확인 실패:', error);
    }
  };

  const generateAuthUrl = () => {
    const url = getInstagramAuthUrl();
    setAuthUrl(url);
    console.log('Generated Instagram Auth URL:', url); // 디버깅용
  };

  const handleConnect = () => {
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        setIsConnected(false);
        setAccessToken('');
        setUserInfo(null);
        toast.success('Instagram 연결이 해제되었습니다.');
      } else {
        throw new Error('연결 해제 실패');
      }
    } catch (error) {
      toast.error('연결 해제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        toast.success('토큰이 갱신되었습니다.');
      } else {
        throw new Error('토큰 갱신 실패');
      }
    } catch (error) {
      toast.error('토큰 갱신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('연결 테스트 성공!');
        setUserInfo(data.userInfo);
      } else {
        throw new Error(data.message || '연결 테스트 실패');
      }
    } catch (error) {
      toast.error('연결 테스트 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const ConnectionStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          연결 상태
          <div className={`px-2 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? '연결됨' : '연결 안됨'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            {userInfo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">계정 정보</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">사용자 ID:</span> {userInfo.id}</p>
                  <p><span className="font-medium">사용자명:</span> {userInfo.username || 'N/A'}</p>
                  <p><span className="font-medium">계정 타입:</span> {userInfo.account_type || 'N/A'}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={testConnection}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? '테스트 중...' : '연결 테스트'}
              </Button>
              <Button
                onClick={refreshToken}
                disabled={loading}
                variant="outline"
              >
                {loading ? '갱신 중...' : '토큰 갱신'}
              </Button>
              <Button
                onClick={handleDisconnect}
                disabled={loading}
                variant="destructive"
              >
                {loading ? '해제 중...' : '연결 해제'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Instagram Business 계정을 연결하여 자동 포스팅 기능을 사용하세요.</p>
            <Button
              onClick={handleConnect}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Instagram 연결하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const TokenInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>토큰 정보</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">액세스 토큰</label>
              <div className="bg-gray-50 p-3 rounded border font-mono text-xs break-all">
                {accessToken ? accessToken.substring(0, 50) + '...' : '토큰 없음'}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              보안을 위해 토큰의 일부만 표시됩니다. 토큰은 60일마다 갱신해야 합니다.
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Instagram을 연결하면 토큰 정보가 표시됩니다.</p>
        )}
      </CardContent>
    </Card>
  );

  const TestPostUpload = () => {
    const [postData, setPostData] = useState({
      imageUrl: '',
      caption: '',
      hashtags: '#타로 #운세 #TaroTI #오늘의운세'
    });
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
      if (!postData.imageUrl || !postData.caption) {
        toast.error('이미지 URL과 캡션을 모두 입력해주세요.');
        return;
      }

      try {
        setUploading(true);
        const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(postData)
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('Instagram에 성공적으로 게시되었습니다!');
          setPostData({
            imageUrl: '',
            caption: '',
            hashtags: '#타로 #운세 #TaroTI #오늘의운세'
          });
        } else {
          throw new Error(data.error || '업로드 실패');
        }
      } catch (error) {
        toast.error('업로드 실패: ' + error.message);
      } finally {
        setUploading(false);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>테스트 게시물 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이미지 URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://example.com/image.jpg"
                  value={postData.imageUrl}
                  onChange={(e) => setPostData({...postData, imageUrl: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">
                  공개적으로 접근 가능한 HTTPS 이미지 URL을 입력하세요.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">캡션</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  rows="4"
                  placeholder="게시물 내용을 입력하세요..."
                  value={postData.caption}
                  onChange={(e) => setPostData({...postData, caption: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">해시태그</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  rows="2"
                  placeholder="#타로 #운세 #TaroTI"
                  value={postData.hashtags}
                  onChange={(e) => setPostData({...postData, hashtags: e.target.value})}
                />
              </div>

              {postData.imageUrl && (
                <div>
                  <label className="block text-sm font-medium mb-1">이미지 미리보기</label>
                  <div className="border rounded-md p-2">
                    <img
                      src={postData.imageUrl}
                      alt="미리보기"
                      className="max-w-full h-48 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{display: 'none'}} className="text-center py-8 text-gray-500">
                      이미지를 불러올 수 없습니다. URL을 확인해주세요.
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={uploading || !postData.imageUrl || !postData.caption}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {uploading ? '업로드 중...' : 'Instagram에 게시하기'}
              </Button>

              <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded">
                ⚠️ 주의: 이 기능은 테스트용입니다. 실제로 Instagram에 게시물이 업로드됩니다.
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Instagram을 먼저 연결해주세요.</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const AutoPostingSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>자동 포스팅 설정</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="enable-auto-post" className="rounded" />
              <label htmlFor="enable-auto-post" className="text-sm">자동 포스팅 활성화</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">포스팅 시간</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="09:00">오전 9:00</option>
                <option value="12:00">오후 12:00</option>
                <option value="18:00">오후 6:00</option>
                <option value="21:00">오후 9:00</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">포스팅 빈도</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="daily">매일</option>
                <option value="weekly">주간</option>
                <option value="monthly">월간</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">기본 해시태그</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
                placeholder="#타로 #운세 #TaroTI #오늘의운세"
                defaultValue="#타로 #운세 #TaroTI #오늘의운세"
              />
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700">
              설정 저장
            </Button>
          </div>
        ) : (
          <p className="text-gray-500">Instagram을 먼저 연결해주세요.</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Instagram 마케팅</h2>
        <p className="text-gray-600">Instagram Business 계정을 연결하여 자동 포스팅을 관리하세요.</p>
      </div>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection">연결 관리</TabsTrigger>
          <TabsTrigger value="upload">테스트 업로드</TabsTrigger>
          <TabsTrigger value="settings">포스팅 설정</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <ConnectionStatus />
          <TokenInfo />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <TestPostUpload />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AutoPostingSettings />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>포스팅 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">총 포스팅</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">이번 달</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">평균 좋아요</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-gray-600">평균 댓글</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                Instagram을 연결하면 통계를 확인할 수 있습니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstagramManager;