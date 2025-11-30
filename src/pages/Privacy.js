import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">개인정보처리방침</h1>
          <p className="text-gray-600">TaroTI 개인정보처리방침</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-4">
              개인정보처리방침
            </h2>
          </div>

          <p className="mb-6 text-justify leading-relaxed">
            '타로티아이'(이하 '회사')이(가) 운영하는 'TaroTI'은(는) 개인정보보호법 제30조에 의거하여 이용자의 개인정보 및 권익을 보호하고 이와 관련한 고충 및 불만을 신속하게 처리하기 위하여 아래와 같이 개인정보 처리방침을 수립하여 운영하고 있습니다. 우리 회사는 관계법령에서 규정하고 있는 책임과 의무를 준수하고 실천하기 위해 최선의 노력을 하고 있습니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">1조 개인정보의 수집 및 이용에 관한 안내</h3>
          <ol className="list-decimal list-outside pl-6 mb-6 space-y-2">
            <li>회사는 서비스 이용에 필요한 최소한의 개인정보를 수집하고 있습니다.</li>
            <li>회사는 이용자의 개인정보를 아래와 같이 처리합니다.</li>
          </ol>

          <h4 className="text-lg font-semibold text-black mt-6 mb-3">개인정보 수집 및 이용</h4>
          <p className="mb-4 text-justify leading-relaxed">
            회사는 다양한 서비스 제공을 위해 이용자에게 동의를 받고 추가적인 개인정보를 수집할 수 있습니다.
          </p>

          <h5 className="text-lg font-semibold text-black mt-6 mb-3">회원가입 및 서비스 이용</h5>
          <div className="mb-6">
            <p className="font-medium mb-2">TaroTI 서비스 제공을 위한 회원가입 및 이용자 식별</p>
            <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
              <li>필수항목: 이름, 성별, 음/양력 여부, 생년월일, 태어난곳, 소셜ID</li>
              <li>선택항목: 태어난 시</li>
              <li>보유·이용기간: 수집일로부터 회원탈퇴까지</li>
            </ul>

            <p className="font-medium mb-2">민원 응대</p>
            <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
              <li>필수항목: 이메일주소, 문의내용, 앱 버전, 단말기 정보</li>
              <li>보유·이용기간: 수집일로부터 회원탈퇴까지</li>
            </ul>

            <p className="font-medium mb-2">유료 서비스 제공</p>
            <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
              <li>필수항목: 이름, 카드번호, 카드만료일, 은행계좌정보, 결제기록</li>
              <li>선택항목: 이메일</li>
              <li>보유·이용기간: 수집일로부터 관련법령에 따른 기간까지</li>
            </ul>

            <p className="font-medium mb-2">소셜 로그인</p>
            <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
              <li>필수항목:
                <ul className="list-disc list-outside pl-6 mt-2 space-y-1">
                  <li>[구글] 이름, 구글 고유식별자</li>
                  <li>[네이버] 이름, 네이버 고유식별자</li>
                  <li>[카카오] 이름, 카카오 고유식별자</li>
                  <li>[애플] 애플 고유식별자</li>
                </ul>
              </li>
              <li>보유·이용기간: 수집일로부터 회원탈퇴까지</li>
            </ul>
          </div>

          <h5 className="text-lg font-semibold text-black mt-6 mb-3">비회원</h5>
          <div className="mb-6">
            <p className="font-medium mb-2">비회원 유료서비스 이용</p>
            <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
              <li>필수항목: 이메일, 금융/간편결제 정보, 카드번호, 카드만료일, 결제기록</li>
              <li>보유·이용기간: 관련법령에 따른 기간까지</li>
            </ul>

            <p className="font-medium mb-2">비회원 타로 리딩</p>
            <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
              <li>필수항목: 이름, 성별, 음/양력, 생년월일</li>
              <li>선택항목: 태어난 시</li>
              <li>보유·이용기간: 수집일로부터 3개월까지 또는 삭제 요청 시까지</li>
            </ul>

            <p className="font-medium mb-2">비회원 유료서비스 타로 리딩</p>
            <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
              <li>필수항목: 이름, 성별, 음/양력, 생년월일, 태어난 도시</li>
              <li>선택항목: 태어난 시</li>
              <li>보유·이용기간: 수집일로부터 3개월까지 또는 삭제 요청 시까지</li>
            </ul>
          </div>

          <h5 className="text-lg font-semibold text-black mt-6 mb-3">마케팅</h5>
          <div className="mb-6">
            <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
              <li>수집 목적: 이벤트 및 서비스 혜택 안내, 사용자 맞춤형 푸시 알림</li>
              <li>필수항목: 이름, 성별, 접속IP정보, 로그, 서비스 이용기록, 모바일기기정보, 국가정보, 쿠키, 접속시간, 푸시 알림 토큰</li>
              <li>보유·이용기간: 동의철회까지 또는 회원탈퇴까지</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">2조 민감정보의 공개 가능성 및 비공개를 선택하는 방법</h3>
          <p className="mb-6 text-justify leading-relaxed">
            회사는 이용자의 민감한 개인정보를 수집하지 않습니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">3조 만 14세 미만 아동의 개인정보 처리에 관한 사항</h3>
          <p className="mb-6 text-justify leading-relaxed">
            회사는 만 14세 미만 아동에게 당사의 서비스를 제공하지 않으며 이와 관련한 개인정보를 수집하지 않습니다.
          </p>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">4조 개인정보의 보유·이용기간 및 파기</h3>
          <p className="mb-4 text-justify leading-relaxed">
            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
          </p>

          <h4 className="text-lg font-semibold text-black mt-6 mb-3">이용자정보</h4>
          <ol className="list-decimal list-outside pl-6 mb-6 space-y-2">
            <li>개인정보를 수집한 이용목적을 달성한 경우 회사는 이용자의 모든 개인정보를 삭제합니다.</li>
            <li>1년이상 서비스에 접속하지 않은 이용자의 개인정보를 보호하기 위하여 회사는 1년이 도래하기 30일 전까지 개인정보가 파기되는 사실, 기간 만료일 및 파기되는 개인정보의 항목을 통보하고 휴면계정으로 전환합니다. 휴면으로 전환된 계정은 2년후 삭제됩니다.</li>
            <li>단, 관계 법령에서 개인정보를 보존해야 할 필요가 있는 경우 해당 법률의 규정에 따릅니다.</li>
          </ol>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">5조 개인정보의 안전성 확보조치</h3>
          <p className="mb-4 text-justify leading-relaxed">
            회사는 이용자의 개인정보를 안전하게 관리하여 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지 않도록 최선을 다하고 있으며 필요한 기술적·관리적 및 물리적 조치를 하고 있습니다.
          </p>

          <ul className="list-disc list-outside pl-6 mb-6 space-y-2">
            <li><strong>개인정보 취급 직원의 최소화 및 교육</strong>: 개인정보를 취급하는 직원을 최소화하고, 주기적인 개인정보 보호 교육을 실시합니다.</li>
            <li><strong>내부관리계획의 수립 및 시행</strong>: 개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.</li>
            <li><strong>개인정보의 암호화</strong>: 이용자의 개인정보는 암호화 되어 저장 및 관리되고 있습니다.</li>
            <li><strong>해킹 등에 대비한 기술적 대책</strong>: 보안프로그램을 설치하고 주기적인 갱신·점검을 합니다.</li>
            <li><strong>개인정보에 대한 접근통제 제한</strong>: 개인정보처리시스템에 대한 접근권한을 통제하여 접근통제 조치를 하고 있습니다.</li>
          </ul>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">6조 이용자 및 법정대리인의 권리와 그 행사 방법</h3>
          <p className="mb-4 text-justify leading-relaxed">
            회사는 이용자(또는 법정대리인)의 개인정보 권리를 보호하기 위해 아래와 같이 행사 방법을 마련하고 있습니다.
          </p>

          <h4 className="text-lg font-semibold text-black mt-6 mb-3">이용자의 권리 및 행사방법</h4>
          <ol className="list-decimal list-outside pl-6 mb-6 space-y-2">
            <li>열람/수정: 더보기 &gt; 프로필 수정</li>
            <li>회원탈퇴: 설정 &gt; 계정 삭제</li>
            <li>개인정보의 이전을 거부하는 방법, 절차: 고객센터에 개인정보 국외 이전 거부 요청</li>
            <li>그 밖에 서면, 전자우편 등을 통하여 개인정보의 처리 정지 및 삭제를 요구할 수 있습니다.</li>
          </ol>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">7조 개인정보 보호책임자 및 이용자 권익침해에 대한 구제방법</h3>

          <h4 className="text-lg font-semibold text-black mt-6 mb-3">개인정보보호 책임자</h4>
          <ul className="list-disc list-outside pl-6 mb-6 space-y-1">
            <li>성명: 대표이사</li>
            <li>직책: 대표이사</li>
            <li>메일: privacy@taroti.com</li>
          </ul>

          <p className="mb-4 text-justify leading-relaxed">
            이용자는 서비스를 이용하면서 발생한 모든 개인정보보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 회사는 이용자의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
          </p>

          <h4 className="text-lg font-semibold text-black mt-6 mb-3">권익침해 관련 도움받을 수 있는 기관</h4>
          <ol className="list-decimal list-outside pl-6 mb-6 space-y-3">
            <li>
              <strong>개인정보 침해신고센터 (한국인터넷진흥원 운영)</strong>
              <ul className="list-disc list-outside pl-6 mt-2 space-y-1">
                <li>소관업무: 개인정보 침해사실 신고, 상담 신청</li>
                <li>홈페이지: privacy.kisa.or.kr</li>
                <li>전화: (국번없이) 118</li>
              </ul>
            </li>
            <li>
              <strong>개인정보 분쟁조정위원회</strong>
              <ul className="list-disc list-outside pl-6 mt-2 space-y-1">
                <li>소관업무: 개인정보 분쟁조정신청, 집단분쟁조정</li>
                <li>홈페이지: www.kopico.go.kr</li>
                <li>전화: (국번없이) 1833-6972</li>
              </ul>
            </li>
            <li>
              <strong>대검찰청 사이버범죄수사단</strong>
              <ul className="list-disc list-outside pl-6 mt-2 space-y-1">
                <li>전화: (국번없이) 1301</li>
                <li>홈페이지: www.spo.go.kr</li>
              </ul>
            </li>
            <li>
              <strong>경찰청 사이버안전국</strong>
              <ul className="list-disc list-outside pl-6 mt-2 space-y-1">
                <li>전화: 182</li>
                <li>홈페이지: cyberbureau.police.go.kr</li>
              </ul>
            </li>
          </ol>

          <h3 className="text-xl font-bold text-black mt-8 mb-4">8조 개인정보처리방침 변경에 관한 사항</h3>
          <p className="mb-4 text-justify leading-relaxed">
            개인정보 처리방침은 시행일로부터 적용되며, 관련 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 지체없이 홈페이지를 통하여 고지할 것입니다.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="mb-2"><strong>시행일자:</strong> 2024년 11월 30일</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;