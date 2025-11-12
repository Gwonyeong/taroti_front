import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CarrotChatBubble from "../components/CarrotChatBubble";
import WebtoonPanel from "../components/WebtoonPanel";

const Result = () => {
  const { landingUserId } = useParams();
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mbtiGroup, setMbtiGroup] = useState(null);
  const [mbtiDetails, setMbtiDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [selectedCardNumber, setSelectedCardNumber] = useState(null);
  const [cardData, setCardData] = useState(null);

  // 카드명 매핑 함수
  const getCardName = (cardNumber) => {
    const cardNames = {
      0: "TheFool",
      1: "TheMagician",
      2: "TheHighPriestess",
      3: "TheEmpress",
      4: "TheEmperor",
      5: "TheHierophant",
      6: "TheLovers",
      7: "TheChariot",
      8: "Strength",
      9: "TheHermit",
      10: "WheelOfFortune",
    };
    return cardNames[cardNumber] || "TheFool";
  };

  // 카드 표시명 함수
  const getCardDisplayName = (cardNumber) => {
    const displayNames = {
      0: "THE FOOL (바보)",
      1: "THE MAGICIAN (마법사)",
      2: "THE HIGH PRIESTESS (여사제)",
      3: "THE EMPRESS (여황제)",
      4: "THE EMPEROR (황제)",
      5: "THE HIEROPHANT (교황)",
      6: "THE LOVERS (연인)",
      7: "THE CHARIOT (전차)",
      8: "STRENGTH (힘)",
      9: "THE HERMIT (은둔자)",
      10: "WHEEL OF FORTUNE (운명의 수레바퀴)",
    };
    return displayNames[cardNumber] || "THE FOOL (바보)";
  };

  // **텍스트** 형식을 볼드 처리로 변환하는 함수
  const formatBoldText = (text) => {
    if (!text) return null;

    // **텍스트** 패턴을 찾아서 <strong> 태그로 변환
    const parts = text.split(/\*\*(.*?)\*\*/g);

    return parts.map((part, index) => {
      // 홀수 인덱스는 **로 감싸진 텍스트
      if (index % 2 === 1) {
        return (
          <strong key={index} className="font-bold">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  // 성격 유형 그룹별 조언 가져오기
  const getMbtiAdvice = (mbti, cardData) => {
    if (!mbti || !cardData) return null;

    const secondLetter = mbti.charAt(1); // N 또는 S
    const thirdLetter = mbti.charAt(2); // T 또는 F

    // 성격 유형 그룹 결정
    let adviceKey = "";
    if (secondLetter === "N" && thirdLetter === "F") {
      adviceKey = "nfAdvice";
    } else if (secondLetter === "N" && thirdLetter === "T") {
      adviceKey = "ntAdvice";
    } else if (secondLetter === "S" && thirdLetter === "J") {
      adviceKey = "sjAdvice";
    } else if (secondLetter === "S" && thirdLetter === "P") {
      adviceKey = "spAdvice";
    }

    return (
      cardData[adviceKey] || "해당 성격 유형 그룹에 대한 조언이 준비 중입니다."
    );
  };

  // 카드 데이터 로드 함수
  const loadCardData = async (cardNumber) => {
    try {
      const response = await fetch(
        "/documents/cardDescription/3cardSpread/1.current.json"
      );
      if (response.ok) {
        const data = await response.json();
        const cardInfo = data.TarotInterpretations.find(
          (card) => card.CardNumber === cardNumber.toString()
        );
        setCardData(cardInfo);
      }
    } catch (error) {
      console.error("Error loading card data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // 카드 번호 가져오기 (URL 파라미터 또는 로컬스토리지)
      let cardNumber = searchParams.get("cardNumber");
      if (!cardNumber) {
        cardNumber = localStorage.getItem("taroTI_selectedCardNumber");
      }
      if (cardNumber) {
        setSelectedCardNumber(parseInt(cardNumber));
        await loadCardData(parseInt(cardNumber));
      } else {
        // 기본값으로 0번 카드 설정
        setSelectedCardNumber(0);
        await loadCardData(0);
      }

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
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }/api/landing-user/${landingUserId}`
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);

          // 성격 유형 그룹 정보 로드
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
        const response = await fetch("/documents/mbti/1_NS_GROUP.json");
        if (response.ok) {
          const groups = await response.json();
          const matchedGroup = groups.find((group) =>
            new RegExp(group.regex).test(mbti)
          );
          setMbtiGroup(matchedGroup);
        }
      } catch (error) {
        console.error("Error loading 성격 유형 group:", error);
      }
    };

    const getRandomPoint = (pointsArray) => {
      if (!pointsArray || pointsArray.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * pointsArray.length);
      return pointsArray[randomIndex];
    };

    const getRandomDescription = (descriptionArray) => {
      if (!descriptionArray || descriptionArray.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * descriptionArray.length);
      return descriptionArray[randomIndex];
    };

    const loadMbtiDetailFiles = async (mbti) => {
      if (!mbti || mbti === "UNKNOWN") return;

      const mbtiDetails = {};

      // Define folder-specific combination patterns based on available files
      const folderCombinations = {
        action: [
          mbti.charAt(0) + mbti.charAt(3), // E/I + J/P (EJ, EP, IJ, IP)
        ],
        david: [
          mbti.charAt(1) + mbti.charAt(2), // N/S + T/F (NF, NT, SJ, SP)
        ],
        temperament: [
          mbti.charAt(2) + mbti.charAt(3), // T/F + J/P (TJ, TP, FJ, FP)
        ],
      };

      for (const [folder, combinations] of Object.entries(folderCombinations)) {
        // Try to find a matching file for this folder
        for (const combination of combinations) {
          try {
            const response = await fetch(
              `/documents/mbtiDetail/${folder}/${combination}.json`
            );
            if (response.ok) {
              const data = await response.json();
              const randomPoint = getRandomPoint(data.point);
              const randomDescription = getRandomDescription(data.description);
              if (randomPoint) {
                mbtiDetails[folder] = {
                  groupName: combination,
                  title: randomPoint.title,
                  description: randomPoint.description,
                  randomDescription: randomDescription,
                  fullData: data,
                };
                break; // Found a match for this folder, move to next folder
              }
            }
          } catch (error) {
            console.error(
              `Error loading ${folder}/${combination}.json:`,
              error
            );
          }
        }
      }

      setMbtiDetails(mbtiDetails);
    };

    fetchUserData();
  }, [landingUserId, searchParams]);

  const handlePurchaseClick = async () => {
    if (landingUserId && landingUserId !== "temp") {
      try {
        // 구매 클릭 데이터 저장
        await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }/api/landing-user/${landingUserId}/purchase`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );
      } catch (error) {
        console.error("Error recording purchase click:", error);
      }
    }

    // 모달 표시
    setShowModal(true);
  };

  const handleEmailSave = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setEmailSaving(true);

    try {
      if (landingUserId && landingUserId !== "temp") {
        await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }/api/landing-user/${landingUserId}/purchase`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );
      }

      alert(
        "이메일이 저장되었습니다. 서비스 준비가 완료되면 가장 먼저 연락드리겠습니다!"
      );
      setShowModal(false);
      setEmail("");
    } catch (error) {
      console.error("Error saving email:", error);
      alert("이메일 저장 중 오류가 발생했습니다.");
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
              결과 : 페넥의 연애조언
            </h2>
          </div>

          {/* Webtoon Panel - 타로 마법사 여우 소개 */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-lg">
              <WebtoonPanel
                backgroundImage="/images/characters/webtoon/desert_fox_taro.png"
                fitImage={true}
                allowOverflow={false}
                className=""
                borderRadius="rounded-lg"
                speechBubbles={[
                  {
                    content: "카드를 잘 골랐다마!",
                    position: "top-4 left-4",

                    bubbleStyle:
                      "bg-white bg-opacity-95 border-3 border-amber-400 ",
                    tailPosition: "bottom",
                    maxWidth: "55%",
                    textStyle:
                      "text-lg text-gray-800 font-bold leading-relaxed",
                    zIndex: 20,
                  },
                ]}
              />
            </div>
          </div>

          {/* Second Webtoon Panel - 페넥의 타로 해석 (세로 직사각형) */}
          <div className="flex justify-center w-full overflow-visible py-12">
            <div className="w-full max-w-sm mr-20 ">
              <WebtoonPanel
                backgroundImage="/images/characters/webtoon/book_highligting.png"
                fitImage={false}
                panelHeight="h-32"
                allowOverflow={true}
                className=""
                borderRadius="rounded-lg"
                speechBubbles={[
                  {
                    content: "네 정보는 꼼꼼히 확인했다마!",
                    position: "right-[-80px] bottom-4",
                    bubbleStyle:
                      "bg-white bg-opacity-95 border-3 border-purple-400",
                    showTail: false,
                    tailPosition: "left",
                    maxWidth: "55%",
                    textStyle:
                      "text-sm text-gray-800 font-bold leading-relaxed",
                    zIndex: 20,
                  },
                ]}
              />
            </div>
          </div>

          {/* Third Webtoon Panel - 페넥의 타로 해석 (세로 직사각형) */}
          <div className="flex justify-center w-full overflow-visible py-12">
            <div className="w-full max-w-xs ml-20">
              <WebtoonPanel
                backgroundImage="/images/characters/webtoon/desert_fox_card_on_hands.jpeg"
                fitImage={false}
                panelHeight="h-48"
                allowOverflow={true}
                className=""
                borderRadius="rounded-lg"
                speechBubbles={[
                  {
                    content: "이제 카드의 뜻을 알려줄 것이다마!",
                    position: " left-[-100px] top-4",
                    bubbleStyle:
                      "bg-yellow-50 bg-opacity-95 border-3 border-purple-400",
                    tailPosition: "right",
                    maxWidth: "65%",
                    textStyle:
                      "text-xs text-gray-800 font-bold leading-relaxed",
                    zIndex: 20,
                  },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-center w-full">
            <div className="w-full max-w-lg">
              <WebtoonPanel
                backgroundImage="/images/characters/webtoon/desert_fox_watching_card.jpeg"
                fitImage={true}
                allowOverflow={true}
                className=""
                borderRadius="rounded-lg"
                soundEffects={[
                  {
                    content: "흠!",
                    position: "top-32 right-6",
                    rotation: -15,
                    textStyle: "text-4xl font-black ",

                    stroke: "3px #fff",
                    zIndex: 25,
                  },
                ]}
              />
            </div>
          </div>

          {/* Selected Card */}
          {selectedCardNumber !== null && (
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg border">
                <img
                  src={`/documents/illustrator/${String(
                    selectedCardNumber
                  ).padStart(2, "0")}-${getCardName(selectedCardNumber)}.jpg`}
                  alt={`${getCardName(selectedCardNumber)} 카드`}
                  className="w-40 h-60 object-cover rounded-lg mx-auto"
                  onError={(e) => {
                    e.target.src = "/images/cards/back/camp_band.jpeg";
                  }}
                />
                <h3 className="text-center mt-4 text-xl font-bold text-charcoal">
                  {getCardDisplayName(selectedCardNumber)}
                </h3>
                <p className="text-center text-sm text-gray-500">
                  {cardData?.["CardFeature/Concept"]?.[0] || "새로운 시작"}
                </p>
              </div>
            </div>
          )}

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
                <span className="text-gray-600">성격 유형:</span>
                <span className="text-charcoal font-medium">
                  {userData?.mbti || "알 수 없음"}
                </span>
              </div>
            </div>
          </div>

          {/* 카드 설명 */}
          {cardData && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-charcoal mb-3">카드 해석</h4>
              <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                {cardData.CardDescription && (
                  <div>
                    <p>
                      <strong>그림 설명:</strong>
                    </p>
                    <p className="whitespace-pre-line">
                      {formatBoldText(cardData.CardDescription)}
                    </p>
                  </div>
                )}
                {cardData.CardFeeling && (
                  <div>
                    <p>
                      <strong>카드가 주는 느낌:</strong>
                    </p>
                    <p className="whitespace-pre-line">
                      {formatBoldText(cardData.CardFeeling)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card Meaning */}
          {cardData && (
            <>
              {/* 애인이 나를 어떻게 생각하는지 */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-charcoal mb-3">
                  애인이 나를 어떻게 생각하는지
                </h4>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">
                    {formatBoldText(cardData["Lover'sPerception"])}
                  </p>
                </div>
              </div>

              {/* 성격 유형별 조언 */}
              {userData?.mbti && userData.mbti !== "UNKNOWN" && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-charcoal mb-3">
                    당신의 성격 유형({userData.mbti})에 맞는 조언
                  </h4>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">
                      {formatBoldText(getMbtiAdvice(userData.mbti, cardData))}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Webtoon Panel - Character Introduction */}
          <WebtoonPanel
            panelHeight="h-40"
            backgroundColor="bg-gradient-to-r from-blue-50 to-purple-50"
            borderStyle=""
            characters={[
              {
                image: "/images/characters/carot.png",
                position: "bottom-2 right-6",
                className: "h-24 w-auto object-contain",
                name: "캐럿",
              },
            ]}
            speechBubbles={[
              {
                content:
                  "성격 유형에도 해석 방식이\n여러개가 있다냥!\n\n성격 유형의 두번째 글자가\n내면에 큰 영향을 미친다냥!",
                position: "top-3 left-4",
                characterName: "캐럿",
                bubbleStyle: "bg-white border-2 border-orange-400",
                tailPosition: "bottom",
                maxWidth: "65%",
                textStyle: "text-sm text-gray-800 font-medium leading-relaxed",
              },
            ]}
          />

          {/* 성격 유형 Group Interpretation */}
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

          {/* 성격 유형 Detail Boxes from JSON files */}
          {userData?.mbti &&
            userData.mbti !== "UNKNOWN" &&
            Object.keys(mbtiDetails).length > 0 && (
              <>
                {/* Action Box */}
                {mbtiDetails.action && (
                  <div className="bg-gray-100 p-4 rounded-lg opacity-60">
                    <h4 className="font-semibold text-charcoal mb-3">
                      {mbtiDetails.action.groupName}그룹 -{" "}
                      {mbtiDetails.action.title}
                    </h4>
                    <div className="bg-white p-3 rounded mb-3">
                      <p className="text-sm text-gray-700">
                        {mbtiDetails.action.description}
                      </p>
                    </div>
                    {mbtiDetails.action.randomDescription && (
                      <p className="text-sm text-gray-700 mb-3">
                        {mbtiDetails.action.groupName}그룹은{" "}
                        {mbtiDetails.action.randomDescription} 이 그룹은...
                      </p>
                    )}
                    <div className="relative">
                      <div className="blur-sm">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          - **핵심 특징**: 행동 지향적인 성향으로 애인과의
                          관계에서 실질적인 변화를 추구 - **긍정적 측면**:
                          관계의 문제를 실행을 통해 해결하려 노력하며, 상대방을
                          위한 구체적인 행동을 보임 - **주의점**: 때로는
                          감정보다 행동에 치중하여 상대방의 마음을 놓칠 수 있음
                          - **개선 방향**: 행동과 함께 감정적 소통도 균형있게
                          유지하기
                        </p>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <img
                          src="/images/characters/carot.png"
                          alt="캐럿"
                          className="w-16 h-16 rounded-full mb-2"
                        />
                        <p className="text-sm font-medium text-charcoal bg-white px-3 py-1 rounded">
                          구매시 내용을 확인할 수 있다냥.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* David Box */}
                {mbtiDetails.david && (
                  <div className="bg-gray-100 p-4 rounded-lg opacity-60">
                    <h4 className="font-semibold text-charcoal mb-3">
                      {mbtiDetails.david.groupName}그룹 -{" "}
                      {mbtiDetails.david.title}
                    </h4>
                    <div className="bg-white p-3 rounded mb-3">
                      <p className="text-sm text-gray-700">
                        {mbtiDetails.david.description}
                      </p>
                    </div>
                    {mbtiDetails.david.randomDescription && (
                      <p className="text-sm text-gray-700 mb-3">
                        {mbtiDetails.david.groupName}그룹은{" "}
                        {mbtiDetails.david.randomDescription} 이 그룹은...
                      </p>
                    )}
                    <div className="relative">
                      <div className="blur-sm">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          - **핵심 특징**: 깊이 있는 관찰력과 분석적 사고로
                          관계를 바라보는 성향 - **긍정적 측면**: 애인의 본질적
                          특성을 잘 파악하고 장기적인 관점에서 관계를 발전시킴 -
                          **주의점**: 과도한 분석으로 인해 자연스러운 감정의
                          흐름을 방해할 수 있음 - **개선 방향**: 분석적 사고와
                          감정적 직관의 균형을 맞추어 관계의 따뜻함 유지하기
                        </p>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <img
                          src="/images/characters/carot.png"
                          alt="캐럿"
                          className="w-16 h-16 rounded-full mb-2"
                        />
                        <p className="text-sm font-medium text-charcoal bg-white px-3 py-1 rounded">
                          구매시 내용을 확인할 수 있다냥.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Temperament Box */}
                {mbtiDetails.temperament && (
                  <div className="bg-gray-100 p-4 rounded-lg opacity-60">
                    <h4 className="font-semibold text-charcoal mb-3">
                      {mbtiDetails.temperament.groupName}그룹 -{" "}
                      {mbtiDetails.temperament.title}
                    </h4>
                    <div className="bg-white p-3 rounded mb-3">
                      <p className="text-sm text-gray-700">
                        {mbtiDetails.temperament.description}
                      </p>
                    </div>
                    {mbtiDetails.temperament.randomDescription && (
                      <p className="text-sm text-gray-700 mb-3">
                        {mbtiDetails.temperament.groupName}그룹은{" "}
                        {mbtiDetails.temperament.randomDescription} 이 그룹은...
                      </p>
                    )}
                    <div className="relative">
                      <div className="blur-sm">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          - **핵심 특징**: 감정과 논리의 균형을 중시하며
                          상대방과의 조화를 추구하는 성향 - **긍정적 측면**:
                          애인의 기질을 이해하고 맞춰가며 안정적인 관계를 유지할
                          수 있음 - **주의점**: 상대방에게 너무 맞추려다
                          자신만의 특성을 잃을 위험이 있음 - **개선 방향**: 상호
                          존중을 바탕으로 각자의 개성을 살리면서 조화를 이루기
                        </p>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <img
                          src="/images/characters/carot.png"
                          alt="캐럿"
                          className="w-16 h-16 rounded-full mb-2"
                        />
                        <p className="text-sm font-medium text-charcoal bg-white px-3 py-1 rounded">
                          구매시 내용을 확인할 수 있다냥.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comprehensive Summary Box */}
                <div className="bg-gray-100 p-4 rounded-lg opacity-60">
                  <h4 className="font-semibold text-charcoal mb-3">
                    종합 - {userData.mbti}
                  </h4>
                  <div className="relative">
                    <div className="blur-sm">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {userData.mbti} 유형의 연애 스타일은 복합적이고 다층적인
                        특성을 보입니다. 바보 카드와 결합될 때, 이들은 새로운
                        시작에 대한 열망과 동시에 신중함을 잃지 않는 독특한
                        균형감을 드러냅니다.
                        {mbtiDetails.action &&
                          ` 행동적 측면에서는 ${mbtiDetails.action.title}의 특성을 보이며,`}
                        {mbtiDetails.david &&
                          ` 분석적 측면에서는 ${mbtiDetails.david.title}의 성향을 나타내고,`}
                        {mbtiDetails.temperament &&
                          ` 기질적으로는 ${mbtiDetails.temperament.title}의 면모를 보입니다.`}
                        애인과의 관계에서 진정성을 추구하되, 때로는 과도한
                        완벽주의로 인해 자연스러운 흐름을 방해할 수 있습니다.
                        감정과 이성, 직관과 현실감각 사이에서 조화를 이루려
                        노력하며, 이러한 내적 갈등이 오히려 관계에 깊이를
                        더해주기도 합니다. 상대방에게는 예측 불가능하면서도
                        안정적인 파트너로 인식될 가능성이 높으며, 장기적인
                        관점에서 서로를 성장시키는 건강한 관계를 구축할 수 있는
                        잠재력을 가지고 있습니다.
                      </p>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <img
                        src="/images/characters/carot.png"
                        alt="캐럿"
                        className="w-16 h-16 rounded-full mb-2"
                      />
                      <p className="text-sm font-medium text-charcoal bg-white px-3 py-1 rounded">
                        구매시 내용을 확인할 수 있다냥.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>

        {/* Fixed Bottom Purchase Section */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full min-w-[320px] max-w-[500px] bg-white border-t border-gray-200 p-4 shadow-lg">
          {/* Webtoon Panel - Purchase Message */}
          <div className="mb-4">
            <WebtoonPanel
              panelHeight="h-20"
              backgroundColor="bg-gradient-to-r from-yellow-50 to-orange-50"
              borderStyle=""
              className="mb-2"
              characters={[
                {
                  image: "/images/characters/carot.png",
                  position: "bottom-1 right-4",
                  className: "h-14 w-auto object-contain",
                  name: "캐럿",
                },
              ]}
              speechBubbles={[
                {
                  content: "1000원으로 모든 내용을\n확인할 수 있다냥!",
                  position: "top-2 left-3",
                  characterName: "캐럿",
                  bubbleStyle: "bg-white border-2 border-yellow-400",
                  tailPosition: "bottom",
                  maxWidth: "70%",
                  textStyle: "text-xs text-gray-800 font-bold",
                },
              ]}
            />
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
                {/* Webtoon Panel - Service Announcement */}
                <div className="mb-6">
                  <WebtoonPanel
                    panelHeight="h-28"
                    backgroundColor="bg-gradient-to-r from-pink-50 to-blue-50"
                    borderStyle=""
                    characters={[
                      {
                        image: "/images/characters/carot.png",
                        position: "bottom-2 right-6",
                        className: "h-20 w-auto object-contain",
                        name: "캐럿",
                      },
                    ]}
                    speechBubbles={[
                      {
                        content:
                          "사실 TaroTI는 서비스 준비중이다냥!\n\n이메일을 남겨주면\n가장 먼저 초대하겠다냥!",
                        position: "top-3 left-4",
                        characterName: "캐럿",
                        bubbleStyle: "bg-white border-2 border-pink-400",
                        tailPosition: "bottom",
                        maxWidth: "65%",
                        textStyle:
                          "text-sm text-charcoal font-medium leading-relaxed",
                      },
                    ]}
                  />
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
                      setEmail("");
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
                    {emailSaving ? "저장 중..." : "저장하기"}
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
