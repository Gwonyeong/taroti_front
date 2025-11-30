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

        <div className="prose prose-lg max-w-none">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-4">
              TaroTI 이용약관 v1.0
            </h2>
          </div>

          <p className="mb-6 text-justify leading-relaxed">
            TaroTI 서비스를 방문하여 주셔서 감사합니다. 타로티아이 (이하 "회사")는 웹사이트와 모바일 앱을 포함하는 TaroTI 서비스 이용약관을 마련하였습니다. 회사는 이용자께서 TaroTI 서비스를 이용함과 동시에 회사의 약관을 숙지하여 동의한 것으로 간주하고 있으니 조금만 시간을 내어 약관을 읽어주시면 감사하겠습니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제1조 (용어의 정의)</h3>
          <ol className="list-decimal list-outside pl-6 mb-6 space-y-2">
            <li>"서비스" 또는 "TaroTI"란 회사가 이용자에게 타로, 점성술, 운세 등의 콘텐츠를 제공하기 위하여 정보통신설비를 이용하여 설정한 가상의 영업장을 말하며, 아울러 본 서비스를 운영하는 사업자의 의미로도 사용합니다.</li>
            <li>"이용자"란 회사의 "서비스"에 접속하여 본 약관에 따라 회사가 제공하는 콘텐츠 및 제반 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>"회원"이란 본 약관에 동의하고 개인정보를 제공하여 회원 등록을 한 자로서, 회사가 제공하는 정보와 서비스를 지속해서 이용할 수 있는 자를 말합니다.</li>
            <li>"비회원"이란 회원 등록을 하지 않고 회사가 제공하는 정보와 서비스를 이용하는 자를 말합니다.</li>
            <li>"콘텐츠"라 함은 회사가 제공하는 타로 카드 리딩, 운세, 점성술 분석 등 서비스와 관련되어 게시한 내용물 일체를 의미합니다.</li>
            <li>"유료콘텐츠"라 함은 회사가 유료로 제공하는 프리미엄 타로 리딩, 개인 맞춤 운세 등의 콘텐츠 및 서비스를 의미합니다.</li>
          </ol>

          <p className="mb-6 text-justify leading-relaxed">
            본 조에서 정의하지 않은 용어에 대해서는 관계 법령, 안내, "회사"의 서비스 정책 등에서 정하는 바에 의하며, 이에 정하지 않은 것은 일반적 상관례에 의합니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제2조 (TaroTI 서비스의 회원가입)</h3>
          <p className="mb-4 text-justify leading-relaxed">
            TaroTI는 다양한 소셜 네트워크 계정 (구글, 카카오, 네이버 등 제3자의 API를 통한 로그인 방식)을 통해 회원가입 및 이용이 가능하며 회원 가입 절차는 다음과 같습니다.
          </p>
          <ol className="list-decimal list-outside pl-6 mb-6 space-y-2">
            <li>소셜 네트워크 계정 로그인을 통한 인증</li>
            <li>서비스 이용을 위한 이용자의 생년월일, 성별, 출생 시간(선택) 정보 입력</li>
            <li>"동의하고 시작하기"를 클릭</li>
          </ol>

          <p className="mb-4 text-justify leading-relaxed">
            "동의하고 시작하기" 클릭 시 이용자(이하 "회원")는 서비스 약관에 동의하신 것으로 간주하며, 필요한 경우 추가 인증절차가 요구될 수 있습니다. 회원은 TaroTI 서비스에서 사용할 회원 이름(닉네임)과 개인 프로필을 별도로 설정할 수 있습니다.
          </p>

          <p className="mb-4 text-justify leading-relaxed">
            다음과 같은 경우 회사는 회원의 계정 생성을 승낙하지 않거나, 해당 회원의 서비스 이용을 중단 또는 계정을 삭제하는 등의 이용 제한을 할 수 있습니다.
          </p>
          <ul className="list-disc list-outside pl-6 mb-6 space-y-2">
            <li>다른 사람 명의의 소셜 계정이나 이메일 주소 등 타인의 개인정보를 도용하여 TaroTI 계정을 생성하려 한 경우</li>
            <li>TaroTI 계정 생성시 필요한 정보를 입력하지 않거나 허위의 정보를 입력한 경우</li>
            <li>만 14세 미만인 이용자가 신청하였을 경우</li>
            <li>회사의 재정적, 기술적 문제로 서비스 제공에 문제가 있다고 판단되는 경우</li>
            <li>본 약관 및 관계 법령을 위반하는 경우</li>
            <li>회원으로 등록하는 것이 회사의 기술상 현저한 지장이 있다고 판단되는 경우</li>
          </ul>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제3조 (TaroTI 서비스 회원의 유의사항)</h3>
          <p className="mb-4 text-justify leading-relaxed">
            회원은 TaroTI 서비스를 자유롭게 이용할 수 있으며, 회원분들의 더 편리한 사용을 위해 회사는 항상 노력하겠습니다. 다만, TaroTI 서비스를 잘못된 방법으로 이용하시는 경우 불이익을 받으실 수 있음을 안내드립니다.
          </p>
          <ul className="list-disc list-outside pl-6 mb-6 space-y-2">
            <li>잘못된 방법으로 TaroTI 서비스의 제공을 방해하거나 회사가 안내하는 방법 이외의 다른 방법을 사용하여 TaroTI 서비스에 접근할 수 없습니다.</li>
            <li>다른 TaroTI 회원의 정보를 무단으로 수집, 이용하거나 다른 사람들에게 제공하면 안됩니다.</li>
            <li>TaroTI 서비스를 영리 목적으로 이용하는 행위 및 음란 정보나 저작권 침해 정보 등 공서양속 및 법령에 위반되는 내용의 정보 등을 발송하거나 게시하여서는 안됩니다.</li>
            <li>회사의 동의 없이 TaroTI 서비스 또는 이에 포함된 소프트웨어의 일부를 복사, 수정, 배포, 판매, 양도, 대여, 담보제공하거나 타인에게 그 이용을 허락하는 행위와 소프트웨어를 역설계하거나 소스 코드의 추출을 시도하는 등 TaroTI 서비스를 복제, 분해 또는 모방하거나 기타 변형하는 행위도 금지합니다.</li>
          </ul>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제4조 (비회원의 서비스 이용)</h3>
          <p className="mb-6 text-justify leading-relaxed">
            회원가입 없이 TaroTI 웹 서비스를 이용하시는 경우 회사는 고객이 입력한 정보를 저장하지 않습니다. 다만 일정 기간 이용자의 웹 브라우저 캐시에 저장된 정보를 통해 재입력 없이 서비스를 이용하실 수 있습니다. 비회원으로 접속하여 TaroTI를 이용하시는 경우 회사는 언제든지 해당 서비스를 중단하거나 변경할 수 있음을 알려드립니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제5조 (개인정보 보호방침)</h3>
          <p className="mb-6 text-justify leading-relaxed">
            회원의 개인정보에 대한 안전한 취급을 위해 회사는 최선을 다하겠습니다. 회원의 개인정보는 TaroTI 서비스의 원활한 제공을 위하여 여러분이 동의한 목적과 범위 내에서만 활용됩니다. 관련 법령에 의하거나 회원이 별도로 동의한 경우 외에는 회사는 회원의 개인정보를 제3자에게 제공하지 않습니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제6조 (회사의 서비스 제공에 대한 의무)</h3>
          <p className="mb-4 text-justify leading-relaxed">
            회사는 TaroTI 서비스를 24시간, 365일 끊김없이 제공하기 위하여 최선의 노력을 다합니다. 다만, 장비의 유지∙보수를 위한 정기 또는 임시 점검 또는 다른 상당한 이유로 TaroTI 서비스의 제공이 일시 중단될 수 있으며, 이때에는 미리 서비스 제공화면, 웹사이트에 공지하겠습니다.
          </p>

          <p className="mb-4 text-justify leading-relaxed">회사는 다음과 같은 업무를 수행합니다.</p>
          <ul className="list-disc list-outside pl-6 mb-6 space-y-2">
            <li>타로 카드 리딩, 운세, 점성술 등 콘텐츠에 대한 정보 제공</li>
            <li>개인 맞춤 타로 리딩 및 운세 서비스 제공</li>
            <li>이벤트 등 유, 무료 상품 및 서비스와 관련된 판촉 행위</li>
            <li>기타 이용자에게 원활한 서비스 이용에 필요한 유용한 정보 제공</li>
          </ul>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제7조 (유료 서비스)</h3>
          <p className="mb-6 text-justify leading-relaxed">
            유료 콘텐츠를 이용하기 위해서는 TaroTI 내에서 사용 가능한 전자적 지급수단으로 이용 대가를 지불하여야 합니다. 회원은 인앱 결제와 웹 결제 등을 통해 유료 서비스를 이용할 수 있으며, 회사는 결제 방법과 이용 조건 등을 TaroTI 내에 게시합니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제8조 (회원가입 해지)</h3>
          <p className="mb-6 text-justify leading-relaxed">
            TaroTI 서비스의 이용을 더 이상 원치 않는 때에는 언제든지 TaroTI 서비스 내에서 제공되는 메뉴를 이용하여 TaroTI 서비스 이용계약의 해지 신청을 할 수 있으며, 회사는 법령이 정하는 바에 따라 신속히 처리하겠습니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제9조 (회사의 책임범위)</h3>
          <p className="mb-4 text-justify leading-relaxed">
            회사는 회원들이 TaroTI 서비스를 이용함으로써 더 많은 편리함을 누리시기를 희망합니다. 만일 회사의 과실로 인하여 회원이 손해를 입게 될 경우 회사는 법령에 따라 회원의 손해를 배상하겠습니다.
          </p>

          <p className="mb-4 text-justify leading-relaxed">다만 회사는 다음의 경우에 대하여 책임을 부담하지 않습니다.</p>
          <ul className="list-disc list-outside pl-6 mb-6 space-y-2">
            <li>천재지변 또는 이에 준하는 불가항력으로 인하여 TaroTI 서비스를 제공할 수 없는 경우</li>
            <li>제3자가 불법적으로 회사의 서버에 접속하거나 서버를 이용함으로써 발생하는 손해</li>
            <li>명예훼손 등 제3자가 TaroTI 서비스를 이용하는 과정에서 회원들에게 발생시킨 손해</li>
          </ul>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제10조 (서비스 약관의 명시와 수정)</h3>
          <p className="mb-4 text-justify leading-relaxed">
            회사는 이용자가 본 약관의 내용을 확인할 수 있도록 TaroTI 서비스 화면에 게시합니다. 회사는 법률이나 TaroTI 서비스의 변경사항을 반영하기 위한 목적 등으로 관계 법령을 위배하지 않는 범위에서 본 약관을 수정할 수 있습니다.
          </p>

          <p className="mb-6 text-justify leading-relaxed">
            본 약관이 변경되는 경우 회사는 변경 사항을 TaroTI 팝업, 알림 등의 방법으로 통지하거나 7일 이상 공지사항에 게시함으로 회원들에게 통지할 수 있습니다. 변경된 약관은 게시한 날로부터 15일 이후에 효력이 발생합니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">제11조 (기타)</h3>
          <p className="mb-4 text-justify leading-relaxed">
            본 약관에서 명시하지 않은 사항과 본 약관의 해석에 관하여는 정부가 제정한 소비자보호지침, 전자거래소비자보호지침 및 관계 법령, 또는 상관례에 따릅니다.
          </p>

          <p className="mb-8 text-justify leading-relaxed">
            본 약관 또는 회사 서비스와 관련하여서는 대한민국의 법률이 적용됩니다.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="mb-2"><strong>공고일자:</strong> 2024년 11월 30일</p>
            <p><strong>시행일자:</strong> 2024년 11월 30일</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;