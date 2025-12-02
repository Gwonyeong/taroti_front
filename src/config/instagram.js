// Instagram API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isNgrokMode = true; // ngrok 사용 모드 활성화

// 환경별 URL 설정
const BACKEND_URL = isNgrokMode
  ? 'https://foxiest-jerome-untruly.ngrok-free.dev'
  : isDevelopment
    ? 'http://localhost:5002'
    : 'https://taroti-back.vercel.app';

// Meta App Dashboard는 HTTPS만 허용하므로 ngrok URL 사용
const REDIRECT_URI = isNgrokMode
  ? 'https://foxiest-jerome-untruly.ngrok-free.dev/admin/instagram/callback'
  : 'https://taroti-front.vercel.app/admin/instagram/callback';

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