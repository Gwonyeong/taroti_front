import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Result = () => {
  const { landingUserId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mbtiGroup, setMbtiGroup] = useState(null);
  const [mbtiDetails, setMbtiDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (landingUserId === "temp") {
          // 임시 데이터
          const tempData = {
            birthDate: "951225",
            gender: "알 수 없음",
            mbti: "UNKNOWN",
          };
          setUserData(tempData);
          await loadMbtiGroup(tempData.mbti);
          await loadMbtiDetailFiles(tempData.mbti);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002'}/api/landing-user/${landingUserId}`
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);

          // MBTI 그룹 정보 로드
          await loadMbtiGroup(data.mbti);
          await loadMbtiDetailFiles(data.mbti);
        } else {
          setError("사용자 데이터를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("서버 연결에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    const loadMbtiGroup = async (mbti) => {
      try {
        const response = await fetch('/documents/mbti/1_NS_GROUP.json');
        if (response.ok) {
          const groups = await response.json();
          const matchedGroup = groups.find(group =>
            new RegExp(group.regex).test(mbti)
          );
          setMbtiGroup(matchedGroup);
        }
      } catch (error) {
        console.error('Error loading MBTI group:', error);
      }
    };

    const getRandomPoint = (pointsArray) => {
      if (!pointsArray || pointsArray.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * pointsArray.length);
      return pointsArray[randomIndex];
    };

    const loadMbtiDetailFiles = async (mbti) => {
      if (!mbti || mbti === 'UNKNOWN') return;

      const folders = ['action', 'david', 'temperament'];
      const mbtiDetails = {};

      for (const folder of folders) {
        // Get all possible combinations for this MBTI
        const combinations = [
          mbti.charAt(0) + mbti.charAt(1), // E/I + N/S
          mbti.charAt(0) + mbti.charAt(2), // E/I + T/F
          mbti.charAt(0) + mbti.charAt(3), // E/I + J/P
          mbti.charAt(1) + mbti.charAt(2), // N/S + T/F
          mbti.charAt(1) + mbti.charAt(3), // N/S + J/P
          mbti.charAt(2) + mbti.charAt(3), // T/F + J/P
        ];

        // Try to find a matching file for this folder
        for (const combination of combinations) {
          try {
            const response = await fetch(`/documents/mbtiDetail/${folder}/${combination}.json`);
            if (response.ok) {
              const data = await response.json();
              const randomPoint = getRandomPoint(data.point);
              if (randomPoint) {
                mbtiDetails[folder] = {
                  groupName: combination,
                  title: randomPoint.title,
                  description: randomPoint.description,
                  fullData: data
                };
                break; // Found a match for this folder, move to next folder
              }
            }
          } catch (error) {
            console.error(`Error loading ${folder}/${combination}.json:`, error);
          }
        }
      }

      setMbtiDetails(mbtiDetails);
    };

    fetchUserData();
  }, [landingUserId]);

  const handlePurchaseClick = async () => {
    if (landingUserId && landingUserId !== 'temp') {
      try {
        // 구매 클릭 데이터 저장
        await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002'}/api/landing-user/${landingUserId}/purchase`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
      } catch (error) {
        console.error('Error recording purchase click:', error);
      }
    }

    // 모달 표시
    setShowModal(true);
  };

  const handleEmailSave = async () => {
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    setEmailSaving(true);

    try {
      if (landingUserId && landingUserId !== 'temp') {
        await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002'}/api/landing-user/${landingUserId}/purchase`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });
      }

      alert('이메일이 저장되었습니다. 서비스 준비가 완료되면 가장 먼저 연락드리겠습니다!');
      setShowModal(false);
      setEmail('');
    } catch (error) {
      console.error('Error saving email:', error);
      alert('이메일 저장 중 오류가 발생했습니다.');
    } finally {
      setEmailSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
          <div className="bg-white text-black p-4 shadow-md">
            <h1 className="text-xl font-bold text-left">TaroTI</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto mb-4"></div>
              <p className="text-charcoal">결과를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center">
        <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
          <div className="bg-white text-black p-4 shadow-md">
            <h1 className="text-xl font-bold text-left">TaroTI</h1>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => {
                  localStorage.removeItem("taroTI_landingUserId");
                  window.location.href = "/landing";
                }}
                className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-800"
              >
                다시 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offWhite flex justify-center">
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white text-black p-4 shadow-md">
          <h1 className="text-xl font-bold text-left">TaroTI</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 pb-40">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              타로 리딩 결과
            </h2>
            <p className="text-gray-600">당신을 위한 특별한 메시지입니다</p>
          </div>

          {/* Selected Card */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <img
                src="/images/cards/0_THE_FOOL.png"
                alt="THE FOOL 카드"
                className="w-40 h-60 object-cover rounded-lg mx-auto"
              />
              <h3 className="text-center mt-4 text-xl font-bold text-charcoal">
                THE FOOL
              </h3>
              <p className="text-center text-sm text-gray-500">새로운 시작</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-charcoal mb-3">입력하신 정보</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">생년월일:</span>
                <span className="text-charcoal font-medium">
                  {userData?.birthDate
                    ? `${userData.birthDate.substring(
                        0,
                        2
                      )}년 ${userData.birthDate.substring(
                        2,
                        4
                      )}월 ${userData.birthDate.substring(4, 6)}일`
                    : "알 수 없음"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">성별:</span>
                <span className="text-charcoal font-medium">
                  {userData?.gender || "알 수 없음"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MBTI:</span>
                <span className="text-charcoal font-medium">
                  {userData?.mbti || "알 수 없음"}
                </span>
              </div>
            </div>
          </div>

          {/* Card Meaning */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-charcoal mb-3">카드의 의미</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              타로의 '바보' 카드는 보통 절벽 끝에서 앞을 보지 않고 한 발을
              내딛으려는 젊은이의 모습으로 표현됩니다. 이는 미지의 것을 향한
              도약과 새로운 시작을 상징합니다.
            </p>
          </div>

          {/* MBTI Group Interpretation */}
          {mbtiGroup && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-charcoal mb-3">
                {mbtiGroup.tempTitle}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {mbtiGroup.tempResult}
              </p>
            </div>
          )}

          {/* MBTI Detail Boxes from JSON files */}
          {userData?.mbti && userData.mbti !== 'UNKNOWN' && Object.keys(mbtiDetails).length > 0 && (
            <>
              {/* Action Box */}
              {mbtiDetails.action && (
                <div className="bg-gray-100 p-4 rounded-lg opacity-60">
                  <h4 className="font-semibold text-charcoal mb-3">
                    {mbtiDetails.action.groupName}그룹 - {mbtiDetails.action.title}
                  </h4>
                  <div className="bg-white p-3 rounded mb-3">
                    <p className="text-sm text-gray-700">
                      {mbtiDetails.action.description}
                    </p>
                  </div>
                  <div className="blur-sm">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      - **핵심 특징**: 행동 지향적인 성향으로 애인과의 관계에서 실질적인 변화를 추구
                      - **긍정적 측면**: 관계의 문제를 실행을 통해 해결하려 노력하며, 상대방을 위한 구체적인 행동을 보임
                      - **주의점**: 때로는 감정보다 행동에 치중하여 상대방의 마음을 놓칠 수 있음
                      - **개선 방향**: 행동과 함께 감정적 소통도 균형있게 유지하기
                    </p>
                  </div>
                </div>
              )}

              {/* David Box */}
              {mbtiDetails.david && (
                <div className="bg-gray-100 p-4 rounded-lg opacity-60">
                  <h4 className="font-semibold text-charcoal mb-3">
                    {mbtiDetails.david.groupName}그룹 - {mbtiDetails.david.title}
                  </h4>
                  <div className="bg-white p-3 rounded mb-3">
                    <p className="text-sm text-gray-700">
                      {mbtiDetails.david.description}
                    </p>
                  </div>
                  <div className="blur-sm">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      - **핵심 특징**: 깊이 있는 관찰력과 분석적 사고로 관계를 바라보는 성향
                      - **긍정적 측면**: 애인의 본질적 특성을 잘 파악하고 장기적인 관점에서 관계를 발전시킴
                      - **주의점**: 과도한 분석으로 인해 자연스러운 감정의 흐름을 방해할 수 있음
                      - **개선 방향**: 분석적 사고와 감정적 직관의 균형을 맞추어 관계의 따뜻함 유지하기
                    </p>
                  </div>
                </div>
              )}

              {/* Temperament Box */}
              {mbtiDetails.temperament && (
                <div className="bg-gray-100 p-4 rounded-lg opacity-60">
                  <h4 className="font-semibold text-charcoal mb-3">
                    {mbtiDetails.temperament.groupName}그룹 - {mbtiDetails.temperament.title}
                  </h4>
                  <div className="bg-white p-3 rounded mb-3">
                    <p className="text-sm text-gray-700">
                      {mbtiDetails.temperament.description}
                    </p>
                  </div>
                  <div className="blur-sm">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      - **핵심 특징**: 감정과 논리의 균형을 중시하며 상대방과의 조화를 추구하는 성향
                      - **긍정적 측면**: 애인의 기질을 이해하고 맞춰가며 안정적인 관계를 유지할 수 있음
                      - **주의점**: 상대방에게 너무 맞추려다 자신만의 특성을 잃을 위험이 있음
                      - **개선 방향**: 상호 존중을 바탕으로 각자의 개성을 살리면서 조화를 이루기
                    </p>
                  </div>
                </div>
              )}

              {/* Comprehensive Summary Box */}
              <div className="bg-gray-100 p-4 rounded-lg opacity-60">
                <h4 className="font-semibold text-charcoal mb-3">
                  종합 - {userData.mbti}
                </h4>
                <div className="blur-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {userData.mbti} 유형의 연애 스타일은 복합적이고 다층적인 특성을 보입니다. 바보 카드와 결합될 때, 이들은 새로운 시작에 대한 열망과 동시에 신중함을 잃지 않는 독특한 균형감을 드러냅니다.
                    {mbtiDetails.action && ` 행동적 측면에서는 ${mbtiDetails.action.title}의 특성을 보이며,`}
                    {mbtiDetails.david && ` 분석적 측면에서는 ${mbtiDetails.david.title}의 성향을 나타내고,`}
                    {mbtiDetails.temperament && ` 기질적으로는 ${mbtiDetails.temperament.title}의 면모를 보입니다.`}
                    애인과의 관계에서 진정성을 추구하되, 때로는 과도한 완벽주의로 인해 자연스러운 흐름을 방해할 수 있습니다. 감정과 이성, 직관과 현실감각 사이에서 조화를 이루려 노력하며, 이러한 내적 갈등이 오히려 관계에 깊이를 더해주기도 합니다. 상대방에게는 예측 불가능하면서도 안정적인 파트너로 인식될 가능성이 높으며, 장기적인 관점에서 서로를 성장시키는 건강한 관계를 구축할 수 있는 잠재력을 가지고 있습니다.
                  </p>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Fixed Bottom Purchase Section */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full min-w-[320px] max-w-[500px] bg-white border-t border-gray-200 p-4 shadow-lg">
          {/* Carrot Chat Message */}
          <div className="flex items-start space-x-3 mb-4">
            <img
              src="/images/characters/carot.png"
              alt="캐럿"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 inline-block max-w-[80%]">
                <p className="text-sm text-charcoal">
                  1000원으로 모든 내용을 확인할 수 있다냥
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchaseClick}
            className="w-full bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            구매하기
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full min-w-[320px] max-w-[400px] mx-4">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                {/* Carrot Chat Message */}
                <div className="flex items-start space-x-3 mb-6">
                  <img
                    src="/images/characters/carot.png"
                    alt="캐럿"
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm text-charcoal leading-relaxed">
                        사실 TaroTI는 서비스 준비중이다냥, 이메일을 남겨주면 가장 먼저 초대하겠다냥
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEmail('');
                    }}
                    className="flex-1 bg-gray-200 text-charcoal py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    닫기
                  </button>
                  <button
                    onClick={handleEmailSave}
                    disabled={emailSaving}
                    className="flex-1 bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {emailSaving ? '저장 중...' : '저장하기'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
