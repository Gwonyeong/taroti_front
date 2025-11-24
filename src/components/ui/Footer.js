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
              <p>상호명: TaroTI</p>
              <p>사업자등록번호: 000-00-00000</p>
              <p>대표: 홍길동</p>
              <p>주소: 서울특별시 강남구 테헤란로</p>
              <p>전화: 02-1234-5678</p>
              <p>이메일: contact@taroti.com</p>
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