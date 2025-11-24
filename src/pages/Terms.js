import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/home"
          className="inline-block mb-8 px-4 py-2 text-black border border-black rounded hover:bg-black hover:text-white transition-all duration-200"
        >
          ← 메인으로 돌아가기
        </Link>

        <div className="text-center mb-12 pb-6 border-b-2 border-black">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">이용약관</h1>
          <p className="text-gray-600">TaroTI 서비스 이용약관</p>
        </div>

        <div className="text-center py-16">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
            <p className="text-gray-500 italic text-lg leading-relaxed">
              이용약관 내용이 여기에 표시됩니다.
              <br /><br />
              서비스 이용 조건, 사용자 권리와 의무, 서비스 제공 조건 등의 내용이 포함됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;