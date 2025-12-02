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

  const TemplatePreview = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('thumbnail');
    const [selectedTheme, setSelectedTheme] = useState('기본운');
    const [previewHtml, setPreviewHtml] = useState('');
    const [loading, setLoading] = useState(false);

    const templates = [
      { value: 'thumbnail', label: '썸네일' },
      { value: 'page1', label: '페이지 1 (1-4번 별자리)' },
      { value: 'page2', label: '페이지 2 (5-8번 별자리)' },
      { value: 'page3', label: '페이지 3 (9-12번 별자리)' },
      { value: 'ending', label: '마무리 페이지' }
    ];

    const themes = [
      { value: '기본운', label: '기본운 (골든 + 핑크)' },
      { value: '연애운', label: '연애운 (핑크 + 핫핑크)' },
      { value: '금전운', label: '금전운 (카키 + 골드)' },
      { value: '건강운', label: '건강운 (라임 + 그린)' }
    ];

    const loadTemplate = async (templateType, theme = selectedTheme) => {
      try {
        setLoading(true);
        const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/preview-templates?templateType=${templateType}&theme=${theme}`, {
          credentials: 'include'
        });

        if (response.ok) {
          const html = await response.text();
          setPreviewHtml(html);
        } else {
          throw new Error('템플릿 로드 실패');
        }
      } catch (error) {
        toast.error('템플릿을 불러오는데 실패했습니다.');
        console.error('Template load error:', error);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      loadTemplate(selectedTemplate);
    }, [selectedTemplate, selectedTheme]);

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Instagram 포스트 템플릿 미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">템플릿 선택</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    {templates.map(template => (
                      <option key={template.value} value={template.value}>
                        {template.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">운세 테마</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                  >
                    {themes.map(theme => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{templates.find(t => t.value === selectedTemplate)?.label} 미리보기</h3>
                <Button
                  onClick={() => loadTemplate(selectedTemplate, selectedTheme)}
                  disabled={loading}
                  variant="outline"
                  className="text-sm"
                >
                  {loading ? '로딩 중...' : '새로고침'}
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden bg-gray-100">
                {loading ? (
                  <div className="flex items-center justify-center h-96 bg-gray-50">
                    <div className="text-center">
                      <div className="text-gray-500 mb-2">템플릿 로딩 중...</div>
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  </div>
                ) : previewHtml ? (
                  <div className="flex justify-center p-4">
                    <div
                      className="relative bg-white rounded-lg shadow-lg"
                      style={{
                        width: '400px',
                        height: '400px',
                        aspectRatio: '1 / 1'
                      }}
                    >
                      <iframe
                        srcDoc={previewHtml}
                        className="w-full h-full border-0 rounded-lg"
                        style={{
                          width: '1080px',
                          height: '1080px',
                          transform: 'scale(0.37)',
                          transformOrigin: 'top left',
                          position: 'absolute',
                          top: 0,
                          left: 0
                        }}
                        title={`Template Preview: ${selectedTemplate}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gray-50">
                    <div className="text-center text-gray-500">
                      템플릿을 불러올 수 없습니다.
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">📝 사용법</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 위 드롭다운에서 미리보고 싶은 템플릿을 선택하세요</li>
                  <li>• 실제 데이터 대신 예시 운세 데이터로 미리보기가 생성됩니다</li>
                  <li>• HTML 파일을 수정한 후 "새로고침" 버튼으로 변경사항을 확인하세요</li>
                  <li>• 템플릿 파일 위치: <code>/marketing/templates/daily-fortune-*.html</code></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const DailyFortuneScheduler = () => {
    const [schedulerData, setSchedulerData] = useState({
      isActive: false,
      postingTime: '09:00',
      fortuneTheme: '기본운',
      nextRunAt: null,
      lastRunAt: null
    });
    const [loading, setLoading] = useState(false);
    const [recentPosts, setRecentPosts] = useState([]);

    // 스케줄러 상태 조회
    const fetchSchedulerStatus = async () => {
      try {
        const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/scheduler/status`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setSchedulerData(data);
        }
      } catch (error) {
        console.error('스케줄러 상태 조회 실패:', error);
      }
    };

    // 스케줄러 시작/중지
    const handleSchedulerToggle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/scheduler/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            action: schedulerData.isActive ? 'stop' : 'start',
            postingTime: schedulerData.postingTime,
            fortuneTheme: schedulerData.fortuneTheme
          })
        });

        if (response.ok) {
          const data = await response.json();
          setSchedulerData(prev => ({
            ...prev,
            isActive: !prev.isActive,
            nextRunAt: data.nextRunAt
          }));
          toast.success(schedulerData.isActive ? '스케줄러가 중지되었습니다.' : '스케줄러가 시작되었습니다.');
        } else {
          throw new Error('스케줄러 상태 변경 실패');
        }
      } catch (error) {
        toast.error('스케줄러 상태 변경 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 즉시 실행
    const handleRunNow = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/scheduler/run-now`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            fortuneTheme: schedulerData.fortuneTheme
          })
        });

        if (response.ok) {
          toast.success('오늘의 운세 게시가 시작되었습니다!');
          fetchSchedulerStatus();
        } else {
          throw new Error('즉시 실행 실패');
        }
      } catch (error) {
        toast.error('즉시 실행 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 설정 업데이트
    const handleSettingsUpdate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${instagramConfig.backendUrl}/api/instagram/scheduler/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            postingTime: schedulerData.postingTime,
            fortuneTheme: schedulerData.fortuneTheme
          })
        });

        if (response.ok) {
          toast.success('설정이 저장되었습니다.');
        } else {
          throw new Error('설정 저장 실패');
        }
      } catch (error) {
        toast.error('설정 저장 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      if (isConnected) {
        fetchSchedulerStatus();
      }
    }, [isConnected]);

    return (
      <div className="space-y-4">
        {/* 스케줄러 상태 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              오늘의 운세 스케줄러
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                schedulerData.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {schedulerData.isActive ? '활성화' : '비활성화'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-4">
                {schedulerData.nextRunAt && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      다음 실행 예정: {new Date(schedulerData.nextRunAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">게시 시간</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={schedulerData.postingTime}
                      onChange={(e) => setSchedulerData({...schedulerData, postingTime: e.target.value})}
                    >
                      <option value="09:00">오전 9:00</option>
                      <option value="12:00">오후 12:00</option>
                      <option value="18:00">오후 6:00</option>
                      <option value="21:00">오후 9:00</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">운세 주제</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={schedulerData.fortuneTheme}
                      onChange={(e) => setSchedulerData({...schedulerData, fortuneTheme: e.target.value})}
                    >
                      <option value="기본운">기본운</option>
                      <option value="연애운">연애운</option>
                      <option value="재물운">재물운</option>
                      <option value="학업운">학업운</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSchedulerToggle}
                    disabled={loading}
                    className={`flex-1 ${
                      schedulerData.isActive
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {loading ? '처리 중...' : (schedulerData.isActive ? '스케줄러 중지' : '스케줄러 시작')}
                  </Button>

                  <Button
                    onClick={handleRunNow}
                    disabled={loading || !isConnected}
                    variant="outline"
                    className="flex-1"
                  >
                    {loading ? '실행 중...' : '즉시 실행'}
                  </Button>

                  <Button
                    onClick={handleSettingsUpdate}
                    disabled={loading}
                    variant="outline"
                  >
                    설정 저장
                  </Button>
                </div>

                <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                  💡 스케줄러가 활성화되면 매일 설정한 시간에 12개 별자리의 운세가 자동으로 Instagram에 게시됩니다.
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Instagram을 먼저 연결해주세요.</p>
            )}
          </CardContent>
        </Card>

        {/* 최근 게시 내역 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 게시 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              게시 내역이 없습니다. 스케줄러를 실행하여 운세를 게시해보세요.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Instagram 마케팅</h2>
        <p className="text-gray-600">Instagram Business 계정을 연결하여 자동 포스팅을 관리하세요.</p>
      </div>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection">연결 관리</TabsTrigger>
          <TabsTrigger value="scheduler">운세 스케줄러</TabsTrigger>
          <TabsTrigger value="template">템플릿 미리보기</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <ConnectionStatus />
          <TokenInfo />
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-4">
          <DailyFortuneScheduler />
        </TabsContent>

        <TabsContent value="template" className="space-y-4">
          <TemplatePreview />
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