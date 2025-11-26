import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, isLoading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      setIsLoggingIn(true);
      const userData = await login();

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      onClose();
      toast.success("카카오 로그인이 완료되었습니다.");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">로그인이 필요해요</DialogTitle>
          <DialogDescription className="text-center">
            마음 읽기 결과를 확인하려면 로그인해주세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <button
            onClick={handleKakaoLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5c5.25 0 9.5 4.25 9.5 9.5s-4.25 9.5-9.5 9.5S2.5 17.25 2.5 12 6.75 2.5 12 2.5zm0 1.5c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1.5 6c.83 0 1.5-.67 1.5-1.5S11.33 8.5 10.5 8.5 9 9.17 9 10s.67 1.5 1.5 1.5zm3 0c.83 0 1.5-.67 1.5-1.5S14.33 8.5 13.5 8.5 12 9.17 12 10s.67 1.5 1.5 1.5zm-1.5 6c3 0 5-2 5-5h-10c0 3 2 5 5 5z"/>
            </svg>
            <span>{isLoggingIn ? "로그인 중..." : "카카오로 시작하기"}</span>
          </button>

          <Button
            onClick={onClose}
            className="w-full"
            variant="secondary"
            disabled={isLoggingIn}
          >
            취소
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500">
          로그인하면 개인화된 마음 읽기 서비스를 이용하실 수 있습니다
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;