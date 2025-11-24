import React, { useState } from 'react';
import { Button } from '../ui/button';

const PasswordAuth = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 환경변수에서 비밀번호 확인
    const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    // 디버깅용 콘솔 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('입력된 비밀번호:', password);
      console.log('설정된 비밀번호:', correctPassword);
      console.log('비교 결과:', password === correctPassword);
    }

    setTimeout(() => {
      if (password === correctPassword) {
        onAuthSuccess();
      } else {
        setError(`잘못된 비밀번호입니다. 환경변수 확인: ${correctPassword ? '설정됨' : '설정안됨'}`);
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">Admin 로그인</h1>
          <p className="mt-2 text-gray-600">관리자 비밀번호를 입력하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-black hover:bg-gray-800 text-white py-3"
          >
            {isLoading ? '확인 중...' : '로그인'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            TaroTI 관리자 페이지
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordAuth;