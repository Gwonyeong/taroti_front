import React, { createContext, useContext, useEffect, useState } from 'react';
import { initKakao, loginWithKakao, logoutFromKakao, getKakaoUserInfo } from '../lib/kakao';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

  useEffect(() => {
    initKakao();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      // 기존에 저장된 잘못된 토큰 제거
      localStorage.removeItem('authToken');

      const kakaoToken = await loginWithKakao();
      const userInfo = await getKakaoUserInfo();

      const response = await fetch(`${API_BASE_URL}/api/auth/kakao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: kakaoToken,
          userInfo: userInfo,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('카카오 로그인 응답:', responseData); // 디버깅용

        const { token, user: userData } = responseData;

        if (!token) {
          console.error('토큰이 응답에 없습니다:', responseData);
          throw new Error('토큰이 없습니다');
        }

        console.log('저장할 토큰:', token); // 디버깅용
        localStorage.setItem('authToken', token);

        // 토큰이 제대로 저장되었는지 확인
        const savedToken = localStorage.getItem('authToken');
        console.log('저장된 토큰 확인:', savedToken); // 디버깅용

        setUser(userData);
        setIsAuthenticated(true);

        // 로그인 후 최신 프로필 정보를 다시 가져오기
        try {
          const profileResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (profileResponse.ok) {
            const latestUserData = await profileResponse.json();
            setUser(latestUserData);
          }
        } catch (profileError) {
          console.warn('Failed to fetch latest profile after login:', profileError);
        }

        return userData;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      await logoutFromKakao();
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const { user: userData } = await response.json();
        setUser(userData);
        return userData;
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};