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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">로그인이 필요해요</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <button
            onClick={handleKakaoLogin}
            disabled={isLoggingIn}
            className="w-full relative transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
          >
            <img
              src="/images/kakao_login_large_wide.png"
              alt="카카오 로그인"
              className="w-full h-auto"
            />
            {isLoggingIn && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
                <span className="text-white font-medium">로그인 중...</span>
              </div>
            )}
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
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
