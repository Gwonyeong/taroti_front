// 카카오 SDK 초기화
export const initKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao) {
    // 카카오 앱 키는 환경변수에서 가져오거나 기본값 사용
    const kakaoKey = process.env.REACT_APP_KAKAO_APP_KEY || 'YOUR_KAKAO_APP_KEY';

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
    }
  }
};

// 카카오 로그인
export const loginWithKakao = () => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error('Kakao SDK not loaded'));
      return;
    }

    window.Kakao.Auth.login({
      success: function(authObj) {
        resolve(authObj.access_token);
      },
      fail: function(err) {
        console.error('Kakao login failed:', err);
        reject(err);
      }
    });
  });
};

// 카카오 로그아웃
export const logoutFromKakao = () => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao || !window.Kakao.Auth) {
      resolve(); // SDK가 없어도 성공으로 처리
      return;
    }

    window.Kakao.Auth.logout(() => {
      resolve();
    });
  });
};

// 카카오 사용자 정보 가져오기
export const getKakaoUserInfo = () => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error('Kakao SDK not loaded'));
      return;
    }

    window.Kakao.API.request({
      url: '/v2/user/me',
      success: function(res) {
        resolve(res);
      },
      fail: function(err) {
        console.error('Failed to get Kakao user info:', err);
        reject(err);
      }
    });
  });
};