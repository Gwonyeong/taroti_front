import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:justify-between md:items-start">
          <div className="mb-8 md:mb-0 md:flex-1">
            <h4 className="text-lg font-semibold text-black mb-4">사업자 정보</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>사업자등록번호: 467-15-02791</p>
              <p>통신판매업 신고번호: 2025-서울마포-2857</p>
              <p>상호명: 파드켓 | 대표자명: 조권영</p>
              <p>주소: 서울특별시 마포구 월드컵북로 6길 19-10</p>
              <p>전화번호: 010-5418-3486</p>
            </div>
          </div>

          <div className="md:ml-8">
            <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
              <Link
                to="/terms"
                className="text-sm text-black hover:text-gray-600 hover:underline transition-colors duration-200"
              >
                이용약관
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/privacy"
                className="text-sm text-black hover:text-gray-600 hover:underline transition-colors duration-200"
              >
                개인정보처리방침
              </Link>
            </div>

            <div className="text-center md:text-left">
              <p className="text-xs text-gray-500">
                &copy; 2024 TaroTI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;