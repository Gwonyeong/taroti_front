// Instagram API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// 환경변수에서 설정 가져오기 (기존 REACT_APP_API_BASE_URL 사용)
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL ||
  (isDevelopment
    ? 'https://foxiest-jerome-untruly.ngrok-free.dev'  // 개발 시 ngrok 사용
    : 'https://tarotiback.vercel.app'  // 프로덕션 백엔드
  );

// Instagram OAuth Redirect URI (Meta Dashboard에 등록된 URI와 일치해야 함)
const REDIRECT_URI = process.env.REACT_APP_INSTAGRAM_REDIRECT_URI ||
  `${BACKEND_URL}/admin/instagram/callback`;

export const instagramConfig = {
  clientId: process.env.REACT_APP_INSTAGRAM_APP_ID || '828538843381325',
  backendUrl: BACKEND_URL,
  redirectUri: REDIRECT_URI,
  scopes: [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_content_publish',
    'instagram_business_manage_insights'
  ].join(','),
  forceReauth: true
};

// Instagram OAuth URL 생성 함수
export const getInstagramAuthUrl = () => {
  const params = new URLSearchParams({
    force_reauth: instagramConfig.forceReauth ? 'true' : 'false',
    client_id: instagramConfig.clientId,
    redirect_uri: instagramConfig.redirectUri,
    response_type: 'code',
    scope: instagramConfig.scopes
  });

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
};

export default instagramConfig;