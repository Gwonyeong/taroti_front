import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import WebtoonPanel from "../components/WebtoonPanel";
import SpeechBubble from "../components/SpeechBubble";
import KeywordsBox from "../components/KeywordsBox";

const Result = () => {
  const { landingUserId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mbtiDescriptions, setMbtiDescriptions] = useState({});
  // 모달 관련 변수들 제거 (더 이상 사용 안함)
  const [selectedCardNumber, setSelectedCardNumber] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  // 피드백 모달 관련 변수들 제거 (더 이상 사용 안함)
  const [isV2, setIsV2] = useState(false);
  const triggerPanelRef = useRef(null);
  const [mbtiGroupData, setMbtiGroupData] = useState(null);

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
    // 섹션 파라미터 확인
    const section = searchParams.get("section");
    setCurrentSection(section ? parseInt(section) : 1);
  }, [searchParams]);

  useEffect(() => {
    const fetchUserData = async () => {
      // 버전 확인
      const version = searchParams.get("version");
      const isVersion2 = version === "2";
      setIsV2(isVersion2);

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
          await loadMbtiDetailFiles(tempData.mbti);
          setLoading(false);
          return;
        }

        // V2와 V1 API 구분하여 호출
        const apiUrl = isVersion2
          ? `/api/landing-user-v2/${landingUserId}`
          : `/api/landing-user/${landingUserId}`;

        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }${apiUrl}`
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);

          // 성격 유형 정보 로드
          await loadMbtiDetailFiles(data.mbti);
          // MBTI 그룹 데이터 로드
          await loadMbtiGroupData(data.mbti);
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

    const getRandomDescriptions = (descriptionArray, count = 5) => {
      if (!descriptionArray || descriptionArray.length === 0) return [];
      const shuffled = [...descriptionArray].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, descriptionArray.length));
    };

    // MBTI 그룹 데이터 로드 함수
    const loadMbtiGroupData = async (mbti) => {
      if (!mbti || mbti === "UNKNOWN") return;

      try {
        const response = await fetch("/documents/mbti/1_NS_GROUP.json");
        if (response.ok) {
          const groupData = await response.json();

          // 사용자의 MBTI와 매칭되는 그룹 찾기
          const matchingGroup = groupData.find((group) => {
            const regex = new RegExp(group.regex.slice(1, -1)); // 정규식 문자열에서 ^와 $ 제거
            return regex.test(mbti);
          });

          if (matchingGroup) {
            setMbtiGroupData(matchingGroup);
          }
        }
      } catch (error) {
        console.error("Error loading MBTI group data:", error);
      }
    };

    const loadMbtiDetailFiles = async (mbti) => {
      if (!mbti || mbti === "UNKNOWN") return;

      const mbtiDetails = {};
      const mbtiDescriptions = {};

      // 각 폴더에서 해당 MBTI에 맞는 파일들을 찾기
      const folders = ["action", "david", "temperament"];

      for (const folder of folders) {
        const matchedFiles = [];

        // 가능한 모든 파일 체크
        const possibleFiles = [
          { file: "EJ.json", letters: ["E", "J"] },
          { file: "EP.json", letters: ["E", "P"] },
          { file: "IJ.json", letters: ["I", "J"] },
          { file: "IP.json", letters: ["I", "P"] },
          { file: "TJ.json", letters: ["T", "J"] },
          { file: "TP.json", letters: ["T", "P"] },
          { file: "FJ.json", letters: ["F", "J"] },
          { file: "FP.json", letters: ["F", "P"] },
          { file: "NT.json", letters: ["N", "T"] },
          { file: "NF.json", letters: ["N", "F"] },
          { file: "SJ.json", letters: ["S", "J"] },
          { file: "SP.json", letters: ["S", "P"] },
        ];

        for (const fileInfo of possibleFiles) {
          // MBTI가 파일의 모든 글자를 포함하는지 체크
          const hasAllLetters = fileInfo.letters.every((letter) =>
            mbti.includes(letter)
          );

          if (hasAllLetters) {
            try {
              const response = await fetch(
                `/documents/mbtiDetail/${folder}/${fileInfo.file}`
              );
              if (response.ok) {
                const data = await response.json();
                matchedFiles.push({
                  fileName: fileInfo.file.replace(".json", ""),
                  data: data,
                });
              }
            } catch (error) {
              // 파일이 없을 수 있으므로 에러 무시
            }
          }
        }

        // 매칭된 파일들의 description을 모두 모음
        let allDescriptions = [];
        for (const file of matchedFiles) {
          if (file.data.description) {
            allDescriptions = [...allDescriptions, ...file.data.description];
          }
        }

        // 랜덤으로 5개 선택
        if (allDescriptions.length > 0) {
          mbtiDescriptions[folder] = {
            descriptions: getRandomDescriptions(allDescriptions, 5),
            matchedFiles: matchedFiles.map((f) => f.fileName),
          };
        }
      }

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

                // mbtiDescriptions에도 point 정보 추가
                if (mbtiDescriptions[folder]) {
                  mbtiDescriptions[folder].point = {
                    title: randomPoint.title,
                    description: randomPoint.description,
                  };
                }

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

      setMbtiDescriptions(mbtiDescriptions);
    };

    fetchUserData();
  }, [landingUserId, searchParams]);

  // 스크롤 기반 배경색 변경 효과 (섹션 1에만 적용)
  useEffect(() => {
    const handleScroll = () => {
      // 섹션 2에서는 배경 효과를 적용하지 않음
      if (currentSection === 2) {
        setBackgroundOpacity(0);
        return;
      }

      if (!triggerPanelRef.current) return;

      const triggerElement = triggerPanelRef.current;
      const triggerRect = triggerElement.getBoundingClientRect();
      const triggerTop = triggerRect.top;
      const windowHeight = window.innerHeight;

      // 트리거 패널이 화면 중앙을 지날 때를 기준점으로 설정
      const triggerPoint = windowHeight * 0.5;

      if (triggerTop <= triggerPoint) {
        // 패널이 기준점을 지나면 어두워지기 시작
        const scrollDistance = triggerPoint - triggerTop;
        const maxDistance = windowHeight * 1.5; // 최대 어두워지는 거리
        const opacity = Math.min(scrollDistance / maxDistance, 0.92); // 최대 92% 어둡게
        setBackgroundOpacity(opacity);
      } else {
        // 패널이 기준점 위에 있으면 밝게
        setBackgroundOpacity(0);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 초기 상태 확인
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentSection]);

  const handleNextSection = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('section', '2');
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousSection = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('section', '1');
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePurchaseClick = async () => {
    if (landingUserId && landingUserId !== "temp") {
      try {
        // 구매 클릭 데이터 저장
        const apiUrl = isV2
          ? `/api/landing-user-v2/${landingUserId}/purchase`
          : `/api/landing-user/${landingUserId}/purchase`;

        await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }${apiUrl}`,
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

    // Feedback 페이지로 이동
    const cardNumber = searchParams.get("cardNumber") || selectedCardNumber;
    const versionParam = isV2 ? "&version=2" : "&version=1";
    navigate(
      `/feedback/${landingUserId}?cardNumber=${cardNumber}${versionParam}`
    );
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
    <div className="min-h-screen bg-offWhite flex justify-center relative">
      {/* 스크롤 기반 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-gray-950 pointer-events-none transition-opacity duration-300 ease-out"
        style={{ opacity: backgroundOpacity, zIndex: 1 }}
      />

      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen relative z-10">
        {/* Header */}
        <div className="bg-white text-black p-4 shadow-md">
          <h1 className="text-xl font-bold text-left">TaroTI</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 pb-40">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              결과 : 페넥의 연애조언 {currentSection === 2 && '(세부 분석)'}
            </h2>
          </div>

          {/* 섹션 1 컨텐츠 */}
          {currentSection === 1 && (
            <>

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

          {/* User Info - 두 번째 웹툰 패널 바로 다음에 배치 */}
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
            <div className="flex justify-center pt-12">
              <div className="relative bg-white p-6 rounded-lg shadow-lg border">
                {/* 말풍선 추가 */}
                <SpeechBubble
                  content="이게 네가 뽑은 카드다마!"
                  position="top-[-80px] left-4"
                  borderStyle="solid"
                  borderType="oval"
                  // backgroundColor="bg-amber-50"
                  // borderColor="border-amber-400"
                  borderWidth="border-2"
                  textStyle="text-sm font-bold text-gray-800"
                  padding="p-6"
                  maxWidth="200px"
                  zIndex={20}
                  showTail={false}
                  tailShow={false}
                  edgeImage="/images/characters/desert_fox/desert_fox_non_bg_watch_card.jpeg"
                  edgeImagePosition="top-right"
                  edgeImageSize="w-12 h-12"
                  customStyle={{
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)",
                  }}
                />

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

          {/* Webtoon Panel - After Card Interpretation */}
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
                    content:
                      "카드의 의미를 이해했다마!\n이제 진짜 해석을 시작하겠다마!",
                    position: "top-4 right-4",
                    bubbleStyle:
                      "bg-white bg-opacity-95 border-3 border-green-400",
                    tailPosition: "bottom",
                    maxWidth: "55%",
                    textStyle:
                      "text-sm text-gray-800 font-bold leading-relaxed",
                    zIndex: 20,
                  },
                ]}
              />
            </div>
          </div>

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

              {/* 말풍선 단독 컴포넌트 */}
              <div className="flex justify-center w-full py-12">
                <div className="relative">
                  <SpeechBubble
                    content="모든 타로 카드에는 긍정적인 의미와 부정적인 의미가 있다마!"
                    position="relative"
                    borderStyle="solid"
                    borderType="oval"
                    backgroundColor="bg-amber-50"
                    borderColor="border-amber-400"
                    borderWidth="border-3"
                    textStyle="text-sm font-bold text-gray-800"
                    padding="p-8"
                    maxWidth="300px"
                    zIndex={20}
                    showTail={false}
                    edgeImage="/images/characters/desert_fox/desert_fox_non_bg_watch_card.jpeg"
                    edgeImagePosition="bottom-right"
                    edgeImageSize="w-12 h-12"
                    customStyle={{
                      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)",
                    }}
                  />
                </div>
              </div>

              {/* Keywords 박스들 */}
              <div className="grid grid-cols-1 gap-4">
                <KeywordsBox
                  title="긍정적인 특징"
                  keywords={cardData.PositiveKeywords}
                  backgroundColor="bg-green-50"
                  titleColor="text-green-800"
                  borderColor="border-green-200"
                  textColor="text-green-700"
                />
                <KeywordsBox
                  title="부정적인 특징"
                  keywords={cardData.NegativeKeywords}
                  backgroundColor="bg-red-50"
                  titleColor="text-red-800"
                  borderColor="border-red-200"
                  textColor="text-red-700"
                />
              </div>

              {/* First Webtoon Panel - Before MBTI Advice */}
              <div className="flex justify-center w-full overflow-visible py-8">
                <div className="w-full max-w-lg">
                  <WebtoonPanel
                    backgroundImage="/images/characters/webtoon/desert_fox_watching_card.jpeg"
                    fitImage={true}
                    allowOverflow={true}
                    className=""
                    borderRadius="rounded-lg"
                    speechBubbles={[
                      {
                        content:
                          "흠... 이제 너의 성격에 맞게 애인을 어떻게 대하면 좋을지 알려주겠다마..",
                        position: "top-4 left-2",
                        bubbleStyle:
                          "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
                        tailPosition: "bottom",
                        maxWidth: "80%",
                        textStyle:
                          "text-sm text-gray-800 font-bold leading-relaxed",
                        zIndex: 20,
                      },
                    ]}
                    soundEffects={[
                      {
                        content: "분석중!",
                        position: "bottom-20 right-8",
                        rotation: -10,
                        textStyle: "text-2xl font-black text-yellow-600",
                        stroke: "2px #fff",
                        zIndex: 25,
                      },
                    ]}
                  />
                </div>
              </div>
              {/* Webtoon Panel - After Lover's Perception */}
              <div
                ref={triggerPanelRef}
                className="flex justify-center w-full py-8"
              >
                <div className="w-full max-w-md">
                  <WebtoonPanel
                    backgroundImage="/images/characters/webtoon/desert_fox_light_hands.jpeg"
                    fitImage={false}
                    panelHeight="h-40"
                    allowOverflow={true}
                    className=""
                    borderRadius="rounded-lg"
                    speechBubbles={[
                      {
                        content:
                          "성격유형 전문가인 내 친구 리트리버를 소개하겠다마..!",
                        position: "bottom-[-120px]",
                        bubbleStyle:
                          "bg-pink-50 bg-opacity-95 border-3 border-pink-400",
                        tailPosition: "",
                        maxWidth: "60%",
                        textStyle:
                          "text-sm text-gray-800 font-bold leading-relaxed",
                        zIndex: 20,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Second Webtoon Panel - Before MBTI Advice */}
              <div className="flex justify-center w-full overflow-visible py-4 pt-[800px]">
                <div className="w-full max-w-sm ml-16">
                  {userData?.mbti && userData.mbti !== "UNKNOWN" && (
                    <div className="relative py-12 pb-[500px]">
                      <SpeechBubble
                        content={`... 갑자기 주변이 어두워졌다.`}
                        position="top-4 left-16 transform -translate-x-1/2"
                        borderStyle="solid"
                        borderType="oval"
                        backgroundColor="bg-purple-100"
                        borderColor="border-purple-500"
                        borderWidth="border-3"
                        textStyle="text-lg font-bold text-purple-900"
                        padding="p-8"
                        maxWidth="400px"
                        zIndex={30}
                        showTail={false}
                        customStyle={{
                          boxShadow: "0 8px 25px rgba(147, 51, 234, 0.3)",
                          background:
                            "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
                        }}
                      />
                    </div>
                  )}
                  <WebtoonPanel
                    backgroundImage="/images/characters/webtoon/ritriber_guitar_fire_space.png"
                    fitImage={false}
                    panelHeight="h-36"
                    allowOverflow={true}
                    className=""
                    borderRadius="rounded-lg"
                    soundEffects={[
                      {
                        content: "디리링~",
                        position: "top-10 right-4",
                        rotation: -10,
                        textStyle: "text-2xl font-black text-yellow-600",
                        stroke: "2px #fff",
                        zIndex: 25,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Standalone Speech Bubble - Before MBTI Advice */}
              <WebtoonPanel
                backgroundImage="/images/characters/webtoon/ritriber_guitar_fire_space.png"
                fitImage={false}
                // panelHeight="h-36"
                allowOverflow={true}
                className=""
                borderRadius="rounded-lg"
                soundEffects={[
                  {
                    content: "안녕하세요!",
                    position: "top-20 right-2",
                    rotation: -10,
                    textStyle: "text-2xl font-black text-yellow-600",
                    stroke: "2px #fff",
                    zIndex: 25,
                  },
                ]}
                speechBubbles={[
                  {
                    content: "당신의 성격유형 분석을 도와줄 리트리에요!",
                    position: " left-[-20px] top-0",
                    bubbleStyle:
                      "bg-yellow-50 bg-opacity-95 border-3 border-purple-400",
                    showTail: false,

                    maxWidth: "55%",
                    textStyle:
                      "text-xs text-gray-800 font-bold leading-relaxed",
                    zIndex: 20,
                  },
                  {
                    content:
                      "성격에 따라 애인에게 더 좋은 행동을 해줄 수 있을거예요!",
                    position: " right-[-20px] bottom-[-50px]",
                    bubbleStyle:
                      "bg-yellow-50 bg-opacity-95 border-3 border-purple-400",
                    showTail: false,

                    maxWidth: "55%",
                    textStyle:
                      "text-xs text-gray-800 font-bold leading-relaxed",
                    zIndex: 20,
                  },
                ]}
              />

              {/* MBTI 그룹 설명 박스 */}
              {mbtiGroupData && (
                <div
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-purple-300 shadow-lg"
                  style={{ marginTop: "5rem" }}
                >
                  <h4 className="font-bold text-lg text-purple-900 mb-3 text-center">
                    {mbtiGroupData.tempTitle}
                  </h4>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {mbtiGroupData.description
                      .split("\\n")
                      .map((line, index) => (
                        <p key={index} className="mb-2">
                          {line
                            .split("**")
                            .map((part, i) =>
                              i % 2 === 0 ? (
                                part
                              ) : (
                                <strong key={i}>{part}</strong>
                              )
                            )}
                        </p>
                      ))}
                  </div>
                </div>
              )}

              {/* 성격 유형별 조언 */}
              {/* {userData?.mbti && userData.mbti !== "UNKNOWN" && (
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
              )} */}

              {/* MBTI 상세 설명 섹션 */}
              {userData?.mbti &&
                userData.mbti !== "UNKNOWN" &&
                Object.keys(mbtiDescriptions).length > 0 && (
                  <div className="space-y-6 mt-8">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-charcoal mb-2">
                        {userData.mbti} 성격유형 상세 분석
                      </h3>
                      <p className="text-sm text-gray-600">
                        당신의 성격유형에 대한 더 자세한 설명입니다
                      </p>
                    </div>

                    {/* Action 카테고리 */}
                    {mbtiDescriptions.action && (
                      <>
                        {/* Webtoon Panel - Before Action Pattern Analysis */}
                        <div className="flex justify-center w-full py-6">
                          <div className="w-full max-w-lg">
                            <WebtoonPanel
                              backgroundImage="/images/characters/ritriber/ritriber_talk.jpeg"
                              fitImage={true}
                              allowOverflow={false}
                              className=""
                              borderRadius="rounded-lg"
                              speechBubbles={[
                                {
                                  content:
                                    "성격 유형의 바깥쪽 글자로 '행동'을 알아볼 수 있어요!",
                                  position: "top-4 left-4",
                                  bubbleStyle:
                                    "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
                                  tailPosition: "bottom",
                                  maxWidth: "60%",
                                  textStyle:
                                    "text-sm text-gray-800 font-bold leading-relaxed",
                                  zIndex: 20,
                                },
                              ]}
                            />
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-blue-900 mb-3 text-lg">
                            행동 패턴 분석
                          </h4>
                          <p className="text-xs text-blue-700 mb-3">
                            매칭된 유형:{" "}
                            {mbtiDescriptions.action.matchedFiles.join(", ")}
                          </p>
                          <ul className="space-y-2">
                            {mbtiDescriptions.action.descriptions.map(
                              (desc, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-600 mr-2">•</span>
                                  <span className="text-sm text-gray-700">
                                    {desc}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </>
                    )}

                    {/* David Keirsey 기질 분류 */}
                    {mbtiDescriptions.david && (
                      <>
                        {/* Webtoon Panel - Before Temperament Analysis */}
                        <div className="flex justify-center w-full overflow-visible py-16 pb-32">
                          <div className="w-full max-w-lg">
                            <WebtoonPanel
                              backgroundImage="/images/characters/ritriber/ritriber_read_book.jpeg"
                              fitImage={false}
                              panelHeight="h-80"
                              allowOverflow={true}
                              className=""
                              borderRadius="rounded-lg"
                              speechBubbles={[
                                {
                                  content:
                                    "성격 유형의 가운데 두글자를 보면 내면을 확인할 수 있어요!",
                                  position: "top-[-30px] right-4",
                                  bubbleStyle:
                                    "bg-purple-50 bg-opacity-95 border-3 border-purple-400",
                                  tailPosition: "bottom",
                                  maxWidth: "60%",
                                  textStyle:
                                    "text-sm text-gray-800 font-bold leading-relaxed",
                                  zIndex: 20,
                                },
                                {
                                  content: mbtiDescriptions.david?.point
                                    ? `당신의 경우, 핵심 단어는 ${mbtiDescriptions.david.point.title}! 즉, "${mbtiDescriptions.david.point.description}"이라고 설명할 수 있어요!`
                                    : "성격 유형의 가운데 두글자를 보면 내면을 확인할 수 있어요!",
                                  position: "bottom-[-70px] left-4",
                                  bubbleStyle:
                                    "bg-purple-50 bg-opacity-95 border-3 border-purple-400 shadow-lg",
                                  tailPosition: "top",
                                  maxWidth: "70%",
                                  textStyle:
                                    "text-sm text-gray-800 font-bold leading-relaxed",
                                  zIndex: 30,
                                },
                              ]}
                            />
                          </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-bold text-purple-900 mb-3 text-lg">
                            기질별 특성
                          </h4>
                          <p className="text-xs text-purple-700 mb-3">
                            매칭된 유형:{" "}
                            {mbtiDescriptions.david.matchedFiles.join(", ")}
                          </p>
                          <ul className="space-y-2">
                            {mbtiDescriptions.david.descriptions.map(
                              (desc, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-purple-600 mr-2">
                                    •
                                  </span>
                                  <span className="text-sm text-gray-700">
                                    {desc}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </>
                    )}

                    {/* Temperament 카테고리 */}
                    {mbtiDescriptions.temperament && (
                      <>
                        {/* Webtoon Panel - Before Temperament Style Analysis */}
                        <div className="flex justify-center w-full py-6">
                          <div className="w-full max-w-lg">
                            <WebtoonPanel
                              backgroundImage="/images/characters/webtoon/ritriber_guitar_fire_space.png"
                              fitImage={true}
                              allowOverflow={false}
                              className=""
                              borderRadius="rounded-lg"
                              speechBubbles={[
                                {
                                  content:
                                    "마지막으로 당신의 기질과 판단 스타일을 분석해보겠어요!",
                                  position: "top-4 left-4",
                                  bubbleStyle:
                                    "bg-green-50 bg-opacity-95 border-3 border-green-400",
                                  tailPosition: "bottom",
                                  maxWidth: "60%",
                                  textStyle:
                                    "text-sm text-gray-800 font-bold leading-relaxed",
                                  zIndex: 20,
                                },
                              ]}
                            />
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-bold text-green-900 mb-3 text-lg">
                            기질과 판단 스타일
                          </h4>
                          <p className="text-xs text-green-700 mb-3">
                            매칭된 유형:{" "}
                            {mbtiDescriptions.temperament.matchedFiles.join(
                              ", "
                            )}
                          </p>
                          <ul className="space-y-2">
                            {mbtiDescriptions.temperament.descriptions.map(
                              (desc, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-600 mr-2">•</span>
                                  <span className="text-sm text-gray-700">
                                    {desc}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                )}
            </>
          )}

          {/* Webtoon Panel - Character Introduction */}

          {/* 성격 유형 Group Interpretation */}

          <div className="relative py-12 pb-[100px]">
            <SpeechBubble
              content={`제가 준비한 성격유형 보고서는 여기까지예요!`}
              position="top-4 left-1/3 transform -translate-x-1/2"
              borderStyle="solid"
              borderType="oval"
              backgroundColor="bg-purple-100"
              borderColor="border-purple-500"
              borderWidth="border-3"
              textStyle="text-lg font-bold text-purple-900"
              padding="p-8"
              maxWidth="400px"
              zIndex={30}
              showTail={false}
              customStyle={{
                boxShadow: "0 8px 25px rgba(147, 51, 234, 0.3)",
                background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
              }}
            />
          </div>

          {/* Final Goodbye Webtoon Panel - Ritriver */}
          <div className="flex justify-center w-full py-12 mt-8">
            <div className="w-full max-w-lg">
              <WebtoonPanel
                backgroundImage="/images/characters/ritriber/ritriber_bye.jpeg"
                fitImage={true}
                allowOverflow={false}
                className=""
                borderRadius="rounded-lg"
                speechBubbles={[
                  {
                    content:
                      "당신의 성격 유형을 좀더 깊게 알 수 있는 시간이 되었길 바라요! 🎵",
                    position: "top-4 right-4",
                    bubbleStyle:
                      "bg-gradient-to-r from-purple-50 to-pink-50 bg-opacity-95 border-3 border-purple-400",
                    tailPosition: "bottom",
                    maxWidth: "65%",
                    textStyle:
                      "text-sm text-gray-800 font-bold leading-relaxed",
                    zIndex: 20,
                  },
                ]}
                soundEffects={[
                  {
                    content: "안녕~",
                    position: "bottom-10 left-10",
                    rotation: 10,
                    textStyle: "text-3xl font-black text-purple-600",
                    stroke: "2px #fff",
                    zIndex: 25,
                  },
                ]}
              />
            </div>
          </div>
            </>
          )}

          {/* 섹션 2 컨텐츠 */}
          {currentSection === 2 && (
            <>
              {/* 말풍선 컴포넌트 - 페넥으로 돌아옴 */}
              <div className="flex justify-center w-full py-8">
                <div className="relative">
                  <SpeechBubble
                    content="눈을 감았다 다시 뜨니 페넥에게 돌아왔다."
                    position="relative"
                    borderStyle="solid"
                    borderType="oval"
                    backgroundColor="bg-purple-100"
                    borderColor="border-purple-500"
                    borderWidth="border-3"
                    textStyle="text-lg font-bold text-purple-900"
                    padding="p-8"
                    maxWidth="350px"
                    zIndex={30}
                    showTail={false}
                    customStyle={{
                      boxShadow: "0 8px 25px rgba(147, 51, 234, 0.3)",
                      background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
                    }}
                  />
                </div>
              </div>

              {/* 웹툰 패널 - 페넥의 인사 */}
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
                        content: "돌아왔구마! 리트리버의 내용은 도움이 되었냐마?",
                        position: "top-4 right-4",
                        bubbleStyle:
                          "bg-white bg-opacity-95 border-3 border-amber-400",
                        tailPosition: "bottom",
                        maxWidth: "60%",
                        textStyle:
                          "text-sm text-gray-800 font-bold leading-relaxed",
                        zIndex: 20,
                      },
                    ]}
                    soundEffects={[
                      {
                        content: "반가워!",
                        position: "bottom-20 left-8",
                        rotation: -15,
                        textStyle: "text-2xl font-black text-amber-600",
                        stroke: "2px #fff",
                        zIndex: 25,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* 추가 컨텐츠 공간 */}
              <div className="bg-amber-50 p-4 rounded-lg mt-6">
                <h4 className="font-semibold text-charcoal mb-3">추가 분석</h4>
                <p className="text-sm text-gray-700">
                  여기에 섹션 2의 추가 컨텐츠가 들어갑니다.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Fixed Bottom Purchase Section */}
        <div
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full min-w-[320px] max-w-[500px] bg-white border-t border-gray-200 p-4 shadow-lg"
          style={{ zIndex: 9999 }}
        >
          {/* Navigation and Purchase Buttons */}
          {currentSection === 1 ? (
            <button
              onClick={handleNextSection}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              다음 →
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handlePreviousSection}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                ← 이전
              </button>
              <button
                onClick={handlePurchaseClick}
                className="flex-1 bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                구매하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
