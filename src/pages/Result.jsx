import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import WebtoonPanel from "../components/WebtoonPanel";
import SpeechBubble from "../components/SpeechBubble";
import KeywordsBox from "../components/KeywordsBox";
import PromotionSection from "../components/PromotionSection";
import Navigation from "../components/ui/Navigation";
import ContentRecommendations from "../components/ContentRecommendations";

const Result = () => {
  const { landingUserId, mindReadingId, fortuneId } = useParams();
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
  const promotionTriggerRef = useRef(null);
  const [mbtiGroupData, setMbtiGroupData] = useState(null);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    hundredths: 0,
  });
  const [isPromotionVisible, setIsPromotionVisible] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

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

  // 마침표 후 줄바꿈을 추가하고 볼드 처리도 하는 함수
  const formatBoldTextWithLineBreaks = (text) => {
    if (!text) return null;

    // 먼저 마침표 후에 줄바꿈 추가 (마침표 다음에 공백이 있고 문자가 오는 경우)
    const textWithBreaks = text.replace(/\.\s+(?=[가-힣A-Za-z])/g, ".\n");

    // **텍스트** 패턴을 찾아서 <strong> 태그로 변환
    const parts = textWithBreaks.split(/\*\*(.*?)\*\*/g);

    return parts.map((part, index) => {
      // 홀수 인덱스는 **로 감싸진 텍스트
      if (index % 2 === 1) {
        return (
          <strong key={index} className="font-bold">
            {part}
          </strong>
        );
      }
      // 줄바꿈 문자를 <br> 태그로 변환 (한 줄의 빈 줄을 위해 <br><br> 사용)
      return part.split("\n").map((line, lineIndex, arr) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < arr.length - 1 && (
            <>
              <br />
              <br />
            </>
          )}
        </React.Fragment>
      ));
    });
  };

  // 첫 문장만 추출하는 함수
  const getFirstSentence = (text) => {
    if (!text) return "";
    const sentences = text.split(".");
    return sentences[0] + ".";
  };

  // MBTI에 따른 조언 타입 매핑
  const getMbtiAdviceType = (mbti) => {
    if (!mbti || mbti === "UNKNOWN") return null;

    // NF 타입 (직관-감정)
    if (mbti.includes("N") && mbti.includes("F")) return "nf";
    // NT 타입 (직관-사고)
    if (mbti.includes("N") && mbti.includes("T")) return "nt";
    // SJ 타입 (감각-판단)
    if (mbti.includes("S") && mbti.includes("J")) return "sj";
    // SP 타입 (감각-인식)
    if (mbti.includes("S") && mbti.includes("P")) return "sp";

    return null;
  };

  // 카드 데이터 로드 함수
  const loadCardData = async (cardNumber) => {
    try {
      console.log('📥 카드 데이터 로딩 시작, 카드 번호:', cardNumber);
      const response = await fetch(
        "/documents/cardDescription/3cardSpread/1.current.json"
      );
      if (response.ok) {
        const data = await response.json();
        const cardInfo = data.TarotInterpretations.find(
          (card) => card.CardNumber === cardNumber.toString()
        );
        console.log('📥 카드 데이터 로딩 완료:', cardInfo ? '성공' : '실패');
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
    // 페이지 진입 시 스크롤 위치와 배경 상태 초기화
    window.scrollTo(0, 0);
    setBackgroundOpacity(0);

    const fetchUserData = async () => {
      // 버전 확인
      const version = searchParams.get("version");
      const isVersion2 = version === "2";
      setIsV2(isVersion2);

      try {
        if (mindReadingId) {
          // Mind Reading 데이터 가져오기
          const response = await fetch(
            `${
              process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
            }/api/mind-reading/${mindReadingId}`
          );

          if (response.ok) {
            const data = await response.json();
            setUserData(data);

            // 카드 번호가 있다면 설정, 없다면 기본값 사용
            if (data.selectedCard !== null && data.selectedCard !== undefined) {
              console.log('🃏 mind-reading: selectedCard 있음:', data.selectedCard);
              setSelectedCardNumber(data.selectedCard);
              await loadCardData(data.selectedCard);
            } else {
              // mind-reading에서도 기본 카드 데이터를 로딩하도록 보장
              console.log('🃏 mind-reading: selectedCard 없음, 기본 카드 로딩');
              setSelectedCardNumber(0);
              await loadCardData(0);
            }

            // 성격 유형 정보 로드
            await loadMbtiDetailFiles(data.mbti);
            // MBTI 그룹 데이터 로드
            await loadMbtiGroupData(data.mbti);
            setLoading(false);
          } else {
            setError("마인드 리딩 데이터를 불러올 수 없습니다.");
          }
        } else if (fortuneId) {
          // December Fortune 데이터 가져오기
          const response = await fetch(
            `${
              process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
            }/api/december-fortune/${fortuneId}`
          );
          if (response.ok) {
            const data = await response.json();
            setUserData({
              ...data,
              isDecemberFortune: true,
              resultMessage: `결과페이지입니다! 선택된 카드: ${data.selectedCard}`
            });
            // 카드 번호 설정
            if (data.selectedCard !== null && data.selectedCard !== undefined) {
              setSelectedCardNumber(data.selectedCard);
              await loadCardData(data.selectedCard);
            } else {
              setSelectedCardNumber(0);
              await loadCardData(0);
            }
            setLoading(false);
          } else {
            setError("12월 운세 데이터를 불러올 수 없습니다.");
          }
        } else if (landingUserId === "temp") {
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
        } else if (landingUserId) {
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

          // V2와 V1 API 구분하여 호출 (기존 로직 유지)
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
            setLoading(false);
          } else {
            setError("사용자 데이터를 불러올 수 없습니다.");
          }
        } else {
          setError("유효하지 않은 요청입니다.");
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
  }, [landingUserId, mindReadingId, fortuneId, searchParams]);


  // 스크롤 기반 배경색 변경 효과
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.5;

      // 로딩 중이면 배경 투명도만 0으로 설정
      if (loading) {
        setBackgroundOpacity(0);
        return;
      }

      if (currentSection === 1) {
        // 섹션 1: 기존 로직
        if (!triggerPanelRef.current) {
          setBackgroundOpacity(0);
          return;
        }

        const triggerElement = triggerPanelRef.current;
        const triggerRect = triggerElement.getBoundingClientRect();
        const triggerTop = triggerRect.top;

        if (triggerTop <= triggerPoint) {
          const scrollDistance = triggerPoint - triggerTop;
          const maxDistance = windowHeight * 1.5;
          const opacity = Math.min(scrollDistance / maxDistance, 0.92);
          setBackgroundOpacity(opacity);
        } else {
          setBackgroundOpacity(0);
        }
      } else if (currentSection === 2) {
        // 섹션 2: 프로모션 섹션에 도달하면 배경 어둡게
        if (!promotionTriggerRef.current) {
          setBackgroundOpacity(0);
          return;
        }

        const promotionElement = promotionTriggerRef.current;
        const promotionRect = promotionElement.getBoundingClientRect();
        const promotionTop = promotionRect.top;

        if (promotionTop <= triggerPoint) {
          const scrollDistance = triggerPoint - promotionTop;
          const maxDistance = windowHeight * 0.5;
          const opacity = Math.min(scrollDistance / maxDistance, 0.85);
          setBackgroundOpacity(opacity);
        } else {
          setBackgroundOpacity(0);
        }
      } else {
        // 다른 섹션에서는 배경 투명도 0으로 설정
        setBackgroundOpacity(0);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 초기 상태 확인
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      setBackgroundOpacity(0);
    };
  }, [currentSection, loading]);

  // 스크롤 방향에 따른 하단바 표시/숨김
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const documentHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;
          const scrollPercentage =
            (currentScrollY + windowHeight) / documentHeight;

          // 프로모션 섹션 체크 (실시간으로)
          const promotionElement = document.querySelector(".promotion-section");
          let isCurrentlyInPromotion = false;

          if (currentSection === 2 && promotionElement) {
            const rect = promotionElement.getBoundingClientRect();
            isCurrentlyInPromotion = rect.top < windowHeight && rect.bottom > 0;
          }

          // 프로모션 섹션에서는 항상 하단바를 보여줌
          if (isCurrentlyInPromotion) {
            setIsBottomBarVisible(true);
          } else {
            // 스크롤이 95% 이상이면 하단바 표시
            if (scrollPercentage >= 0.95) {
              setIsBottomBarVisible(true);
            }
            // 스크롤을 아래로 내릴 때 (스크롤 값이 증가)
            else if (
              currentScrollY > lastScrollY.current &&
              currentScrollY > 100
            ) {
              setIsBottomBarVisible(false);
            }
            // 스크롤을 위로 올릴 때 (스크롤 값이 감소)
            else if (currentScrollY < lastScrollY.current) {
              setIsBottomBarVisible(true);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentSection]);

  // 할인 종료 타이머 - 오늘 자정까지 남은 시간 (0.01초 단위)
  useEffect(() => {
    const updateTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // 다음 자정

      const diff = midnight - now;

      if (diff <= 0) {
        // 자정이 지났으면 다음 자정까지의 시간
        const nextMidnight = new Date();
        nextMidnight.setDate(nextMidnight.getDate() + 1);
        nextMidnight.setHours(0, 0, 0, 0);
        const newDiff = nextMidnight - now;

        const hours = Math.floor(newDiff / (1000 * 60 * 60));
        const minutes = Math.floor((newDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((newDiff % (1000 * 60)) / 1000);
        const hundredths = Math.floor((newDiff % 1000) / 10);

        setTimeRemaining({ hours, minutes, seconds, hundredths });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const hundredths = Math.floor((diff % 1000) / 10);

        setTimeRemaining({ hours, minutes, seconds, hundredths });
      }
    };

    // 초기 설정
    updateTimeUntilMidnight();

    // 10ms마다 업데이트
    const timer = setInterval(updateTimeUntilMidnight, 10);

    return () => clearInterval(timer);
  }, []);

  // 프로모션 섹션 가시성 체크
  useEffect(() => {
    const checkPromotionVisibility = () => {
      if (currentSection !== 2) {
        setIsPromotionVisible(false);
        return;
      }

      const promotionElement = document.querySelector(".promotion-section");
      if (promotionElement) {
        const rect = promotionElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // 프로모션 섹션이 화면에 조금이라도 보이면 true
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        setIsPromotionVisible(isVisible);
      }
    };

    window.addEventListener("scroll", checkPromotionVisibility, {
      passive: true,
    });
    checkPromotionVisibility(); // 초기 체크

    return () => {
      window.removeEventListener("scroll", checkPromotionVisibility);
    };
  }, [currentSection]);

  const handleNextSection = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("section", "2");
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  };

  const handlePreviousSection = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("section", "1");
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  };

  const handlePurchaseClick = async () => {
    // Mind Reading 세션인 경우
    if (mindReadingId) {
      try {
        const token = localStorage.getItem('authToken');
        // 구매 버튼 클릭 추적
        await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
          }/api/mind-reading/${mindReadingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ paymentClicked: true }),
          }
        );
      } catch (error) {
        console.error("Error recording purchase click:", error);
      }
      // Feedback 페이지로 이동 (mind-reading용)
      navigate(`/feedback/mind-reading?id=${mindReadingId}`);
    }
    // 기존 Landing User인 경우
    else if (landingUserId && landingUserId !== "temp") {
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
      // Feedback 페이지로 이동
      const cardNumber = searchParams.get("cardNumber") || selectedCardNumber;
      const versionParam = isV2 ? "&version=2" : "&version=1";
      navigate(
        `/feedback/${landingUserId}?cardNumber=${cardNumber}${versionParam}`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <Navigation fixed />
        <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
          <div className="h-16"></div>
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
        <Navigation fixed />
        <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
          <div className="h-16"></div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => {
                  localStorage.removeItem("taroTI_landingUserId");
                  window.location.href = "/mind-reading";
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

  // December Fortune 결과 페이지
  if (userData?.isDecemberFortune) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center">
        <Navigation fixed />
        <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col min-h-screen">
          {/* 고정 네비게이션을 위한 여백 */}
          <div className="h-16"></div>

          {/* 결과 내용 */}
          <div className="flex-1 p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-charcoal mb-4">12월 운세 결과</h1>
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-medium text-charcoal mb-4">
                  {userData.fortuneType} 결과
                </h2>

                {/* 선택된 카드 표시 */}
                {selectedCardNumber !== null && (
                  <div className="mb-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-lg shadow-lg">
                        <img
                          src={`/documents/illustrator/${String(
                            selectedCardNumber
                          ).padStart(2, "0")}-${getCardName(selectedCardNumber)}.jpg`}
                          alt={`${getCardName(selectedCardNumber)} 카드`}
                          className="w-32 h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/images/cards/back/camp_band.jpeg";
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-center font-medium text-charcoal">
                      {getCardDisplayName(selectedCardNumber)}
                    </p>
                  </div>
                )}

                {/* 결과 메시지 */}
                <p className="text-charcoal text-center">{userData.resultMessage}</p>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="p-6 bg-white border-t border-gray-200">
            <button
              onClick={() => navigate('/december-fortune')}
              className="w-full bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              다시 해보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center relative"
      style={{
        backgroundColor: backgroundOpacity > 0
          ? `rgb(${Math.round(255 - (255 - 31) * backgroundOpacity)}, ${Math.round(255 - (255 - 41) * backgroundOpacity)}, ${Math.round(255 - (255 - 55) * backgroundOpacity)})`
          : '#fafafa', // offWhite와 동일한 색상
        transition: 'background-color 300ms ease-out'
      }}
    >
      <Navigation fixed />
      <div
        className="w-full min-w-[320px] max-w-[500px] flex flex-col min-h-screen relative"
        style={{
          zIndex: 10,
          backgroundColor: backgroundOpacity > 0
            ? `rgb(${Math.round(255 - (255 - 31) * backgroundOpacity)}, ${Math.round(255 - (255 - 41) * backgroundOpacity)}, ${Math.round(255 - (255 - 55) * backgroundOpacity)})`
            : 'white',
          transition: 'background-color 300ms ease-out'
        }}
      >
        {/* 고정 네비게이션을 위한 여백 */}
        <div className="h-16"></div>

        {/* Content */}
        <div
          className="flex-1 p-6 space-y-6 pb-40 bg-inherit"
          style={{ position: "relative", zIndex: 20 }}
        >
          {/* 섹션 1 컨텐츠 */}
          {currentSection === 1 && (
            <>
              {/* Webtoon Panel - 타로 마법사 여우 소개 */}
              <div className="flex justify-center w-full">
                <div className="w-full max-w-lg">
                  <WebtoonPanel
                    backgroundImage="/images/characters/webtoon/desert_fox_taro.png"
                    fitImage={true}
                    allowOverflow={true}
                    className=""
                    borderRadius="rounded-lg"
                    speechBubbles={[
                      {
                        content: "카드를 잘 골랐다마!",
                        position: "top-4 left-4",

                        bubbleStyle:
                          "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
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
                          "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
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
                <h4 className="font-semibold text-charcoal mb-3">
                  입력하신 정보
                </h4>
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
                          "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
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
                      ).padStart(2, "0")}-${getCardName(
                        selectedCardNumber
                      )}.jpg`}
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
                  <h4 className="font-semibold text-charcoal mb-3">
                    카드 해석
                  </h4>
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
                    allowOverflow={true}
                    className=""
                    borderRadius="rounded-lg"
                    speechBubbles={[
                      {
                        content:
                          "카드의 의미를 이해했다마!\n이제 진짜 해석을 시작하겠다마!",
                        position: "top-4 right-4",
                        bubbleStyle:
                          "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
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
                      그 사람이 나를 어떻게 생각하는지
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
                              "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
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
                          "성격유형 조언으로 그 사람과 더 좋은 관계로 발전할 수 있을거에요!",
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
                                  allowOverflow={true}
                                  className=""
                                  borderRadius="rounded-lg"
                                  speechBubbles={[
                                    {
                                      content:
                                        "성격 유형의 바깥쪽 글자로 '행동'을 알아볼 수 있어요!",
                                      position: "top-4 left-4",
                                      bubbleStyle:
                                        "bg-yellow-50 bg-opacity-95 border-3 border-purple-400",
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
                                {mbtiDescriptions.action.matchedFiles.join(
                                  ", "
                                )}
                              </p>
                              <ul className="space-y-2">
                                {mbtiDescriptions.action.descriptions.map(
                                  (desc, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="text-blue-600 mr-2">
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
                                        "bg-yellow-50 bg-opacity-95 border-3 border-purple-400",
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
                                        "bg-yellow-50 bg-opacity-95 border-3 border-purple-400 shadow-lg",
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
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
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
                                  allowOverflow={true}
                                  className=""
                                  borderRadius="rounded-lg"
                                  speechBubbles={[
                                    {
                                      content:
                                        "마지막으로 당신의 기질과 판단 스타일을 분석해보겠어요!",
                                      position: "top-4 left-4",
                                      bubbleStyle:
                                        "bg-yellow-50 bg-opacity-95 border-3 border-purple-400",
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
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="text-green-600 mr-2">
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
                    background:
                      "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
                  }}
                />
              </div>

              {/* Final Goodbye Webtoon Panel - Ritriver */}
              <div className="flex justify-center w-full py-12 mt-8">
                <div className="w-full max-w-lg">
                  <WebtoonPanel
                    backgroundImage="/images/characters/ritriber/ritriber_bye.jpeg"
                    fitImage={true}
                    allowOverflow={true}
                    className=""
                    borderRadius="rounded-lg"
                    speechBubbles={[
                      {
                        content:
                          "당신의 성격 유형을 좀더 깊게 알 수 있는 시간이 되었길 바라요! 🎵",
                        position: "top-4 right-4",
                        bubbleStyle:
                          "bg-yellow-50 bg-opacity-95 border-3 border-purple-400",
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
                      background:
                        "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
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
                    allowOverflow={true}
                    className=""
                    borderRadius="rounded-lg"
                    speechBubbles={[
                      {
                        content:
                          "돌아왔구마! 리트리버의 내용은 도움이 되었냐마?",
                        position: "top-4 right-4",
                        bubbleStyle:
                          "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
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

              {/* 카드 재소개 섹션 */}
              {selectedCardNumber !== null && cardData && (
                <>
                  {/* 웹툰 패널 - 카드 재소개 시작 */}
                  <div className="flex justify-center w-full py-8">
                    <div className="w-full max-w-lg">
                      <WebtoonPanel
                        backgroundImage="/images/characters/webtoon/desert_fox_taro.png"
                        fitImage={true}
                        allowOverflow={true}
                        className=""
                        borderRadius="rounded-lg"
                        speechBubbles={[
                          {
                            content:
                              "아, 그전에 네가 뽑은 카드를 다시 한번 살펴보겠다마!",
                            position: "top-4 right-4",
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

                  {/* 카드 재소개 박스 */}
                  <div className="flex justify-center pt-8">
                    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg shadow-lg border-2 border-amber-200">
                      <img
                        src={`/documents/illustrator/${String(
                          selectedCardNumber
                        ).padStart(2, "0")}-${getCardName(
                          selectedCardNumber
                        )}.jpg`}
                        alt={`${getCardName(selectedCardNumber)} 카드`}
                        className="w-32 h-48 object-cover rounded-lg mx-auto mb-4"
                        onError={(e) => {
                          e.target.src = "/images/cards/back/camp_band.jpeg";
                        }}
                      />
                      <h3 className="text-center text-lg font-bold text-amber-900 mb-2">
                        {getCardDisplayName(selectedCardNumber)}
                      </h3>

                      {/* CardFeature/Concept 키워드들 */}
                      {cardData?.["CardFeature/Concept"] && (
                        <div className="text-center mb-3">
                          <h4 className="text-sm font-semibold text-amber-800 mb-2">
                            카드의 핵심 키워드
                          </h4>
                          <div className="flex flex-wrap justify-center gap-2">
                            {cardData["CardFeature/Concept"].map(
                              (keyword, index) => (
                                <span
                                  key={index}
                                  className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium border border-amber-300"
                                >
                                  {keyword}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* 간단한 카드 설명 */}
                      <div className="bg-white p-3 rounded border border-amber-200">
                        <p className="text-xs text-gray-700 text-center leading-relaxed">
                          {formatBoldText(
                            getFirstSentence(cardData["Lover'sPerception"])
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 성격 유형별 조언 섹션 */}
              {cardData &&
                userData?.mbti &&
                userData.mbti !== "UNKNOWN" &&
                (() => {
                  const userAdviceType = getMbtiAdviceType(userData.mbti);
                  const userAdviceKey = `${userAdviceType}Advice`;

                  return userAdviceType && cardData[userAdviceKey] ? (
                    <>
                      {/* 웹툰 패널 - 성격 분석 시작 */}
                      <div className="flex justify-center w-full">
                        <div className="w-full max-w-lg">
                          <WebtoonPanel
                            backgroundImage="/images/characters/webtoon/desert_fox_taro.png"
                            fitImage={true}
                            allowOverflow={true}
                            className=""
                            borderRadius="rounded-lg"
                            speechBubbles={[
                              {
                                content:
                                  "이제 네 성격 유형에 맞는 특별한 조언을 해주겠다마!",
                                position: "top-4 right-4",
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

                      {/* 사용자 성격 유형에 맞는 조언 */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-charcoal mb-3 whitespace-pre-line">
                          {getCardDisplayName(selectedCardNumber)}
                          {"\n"}
                          {userAdviceType?.toUpperCase()} 기질인 당신을 위한
                          조언
                        </h4>
                        <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                          {/* 전체 조언 내용 (모두 공개) */}
                          <div className="bg-white p-3 rounded border-l-4 border-green-400">
                            <p className="leading-relaxed">
                              {formatBoldTextWithLineBreaks(
                                cardData[userAdviceKey]
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 페넥의 마지막 유혹 */}
                      <div className="flex justify-center w-full">
                        <div className="w-full max-w-lg  ">
                          <WebtoonPanel
                            backgroundImage="/images/characters/webtoon/desert_fox_watching_card.jpeg"
                            fitImage={true}
                            allowOverflow={true}
                            className=""
                            borderRadius="rounded-lg"
                            speechBubbles={[
                              {
                                content:
                                  "이 조언대로면 분명 연인과의 관계에 도움이 될것이다마..",
                                position: "top-4 left-2",
                                bubbleStyle:
                                  "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
                                tailPosition: "bottom",
                                maxWidth: "75%",
                                textStyle:
                                  "text-sm text-gray-800 font-bold leading-relaxed",
                                zIndex: 20,
                              },
                            ]}
                            soundEffects={[
                              {
                                content: "하지만..",
                                position: "bottom-16 right-8",
                                rotation: -10,
                                textStyle: "text-xl font-black text-amber-600",
                                stroke: "2px #fff",
                                zIndex: 25,
                              },
                            ]}
                          />
                        </div>
                      </div>
                      <div className="flex justify-center w-full">
                        <div className="w-full max-w-lg mr-20">
                          <WebtoonPanel
                            backgroundImage="/images/characters/webtoon/desert_fox_anger_hilighting.png"
                            fitImage={true}
                            allowOverflow={true}
                            className="h-64"
                            borderRadius="rounded-lg"
                            speechBubbles={[]}
                            soundEffects={[]}
                          />
                        </div>
                      </div>
                      <div className="flex justify-center w-full">
                        <div className="w-full max-w-lg">
                          <WebtoonPanel
                            backgroundImage="/images/characters/webtoon/desert_fox_angry.jpg"
                            fitImage={true}
                            allowOverflow={true}
                            className=""
                            borderRadius="rounded-lg"
                            speechBubbles={[
                              {
                                content:
                                  "하지만, 서로 다른 사람이 항상 잘 맞을수는 없는 법이다마!",
                                position: "bottom-4 right-2",
                                bubbleStyle:
                                  "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
                                tailPosition: "top",
                                maxWidth: "75%",
                                textStyle:
                                  "text-sm text-gray-800 font-bold leading-relaxed",
                                zIndex: 20,
                              },
                            ]}
                            soundEffects={[
                              {
                                content: "심각!",
                                position: "top-24 right-10",
                                rotation: -10,
                                textStyle: "text-xl font-black text-amber-600",
                                stroke: "2px #fff",
                                zIndex: 25,
                              },
                            ]}
                          />
                        </div>
                      </div>

                      {/* 방해되는 요소 설명 박스 */}
                      <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200 shadow-md mt-8">
                        <h4 className="font-bold text-red-900 mb-3 text-lg flex items-center">
                          <span className="mr-2"></span>그 사람과 당신이
                          가까워지는데 방해되는 요소
                        </h4>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          <p className="text-red-800 mb-3 font-medium">
                            이런 점들이 관계 발전에 걸림돌이 될 수 있어요:
                          </p>
                          {cardData?.NegativeKeywords && (
                            <ul className="space-y-2">
                              {cardData.NegativeKeywords.map(
                                (keyword, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start bg-white p-3 rounded border border-red-200"
                                  >
                                    <span className="text-red-600 mr-3 mt-0.5">
                                      •
                                    </span>
                                    <span className="text-gray-800 leading-relaxed">
                                      {keyword}
                                    </span>
                                  </li>
                                )
                              )}

                              {/* 블러 처리된 추가 항목들 */}
                              <li className="flex items-start bg-white p-3 rounded border border-red-200 relative">
                                <span className="text-red-600 mr-3 mt-0.5">
                                  •
                                </span>
                                <span className="text-gray-800 leading-relaxed blur-sm select-none">
                                  상대방이 당신에게 느끼는 숨겨진 불안감과 관계
                                  지속에 대한 의구심
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                              </li>

                              <li className="flex items-start bg-white p-3 rounded border border-red-200 relative">
                                <span className="text-red-600 mr-3 mt-0.5">
                                  •
                                </span>
                                <span className="text-gray-800 leading-relaxed blur-sm select-none">
                                  당신의 성격 유형이 가진 연애 패턴상 발생할 수
                                  있는 근본적 문제점
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                              </li>

                              <li className="flex items-start bg-white p-3 rounded border border-red-200 relative">
                                <span className="text-red-600 mr-3 mt-0.5">
                                  •
                                </span>
                                <span className="text-gray-800 leading-relaxed blur-sm select-none">
                                  두 사람의 궁합에서 나타나는 핵심적인 갈등
                                  요소와 해결 방안
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                              </li>
                            </ul>
                          )}

                          {/* 결제 후 확인 가능 메시지 */}

                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                            <p className="text-amber-800 text-xs font-medium">
                              💡 하지만 걱정하지 마세요! 위의 조언을 참고하여
                              이런 요소들을 극복할 수 있어요.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 단독 말풍선 - 카드 두 장 더 뽑기 예고 */}
                      <div className="flex justify-center w-full py-12">
                        <div className="relative">
                          <SpeechBubble
                            content="지금 뽑은 카드를 봤을 때, 미래가 나쁘지만은 않아보인다마!"
                            position="relative"
                            borderStyle="solid"
                            borderType="oval"
                            backgroundColor="bg-amber-50"
                            borderColor="border-amber-400"
                            borderWidth="border-3"
                            textStyle="text-lg font-bold text-gray-800"
                            padding="p-8"
                            maxWidth="380px"
                            zIndex={30}
                            showTail={false}
                            edgeImage="/images/characters/desert_fox/desert_fox_non_bg_watch_card.jpeg"
                            edgeImagePosition="bottom-left"
                            edgeImageSize="w-16 h-16"
                            customStyle={{
                              boxShadow: "0 8px 25px rgba(245, 158, 11, 0.3)",
                              background:
                                "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
                            }}
                          />
                        </div>
                      </div>

                      {/* 첫 번째 추가 웹툰 패널 - 페넥의 반응 */}
                      <div className="flex justify-center w-full py-8">
                        <div className="w-full max-w-lg mb-32">
                          <WebtoonPanel
                            backgroundImage="/images/characters/webtoon/desert_fox_taro.png"
                            fitImage={true}
                            allowOverflow={true}
                            className=""
                            borderRadius="rounded-lg"
                            speechBubbles={[
                              {
                                content: "우리는 카드를 두장 더 뽑을거다마!",
                                position: "top-4 right-4",
                                bubbleStyle:
                                  "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
                                tailPosition: "bottom",
                                maxWidth: "70%",
                                textStyle:
                                  "text-sm text-gray-800 font-bold leading-relaxed",
                                zIndex: 20,
                              },
                            ]}
                            soundEffects={[
                              {
                                content: "더 남았어!",
                                position: "bottom-16 left-16",
                                rotation: -15,
                                textStyle: "text-xl font-black text-amber-600",
                                stroke: "2px #fff",
                                zIndex: 25,
                              },
                            ]}
                          />
                        </div>
                      </div>
                      <WebtoonPanel
                        backgroundImage="/images/characters/webtoon/desert_fox_watching_card.jpeg"
                        fitImage={true}
                        allowOverflow={true}
                        className=""
                        borderRadius="rounded-lg"
                        speechBubbles={[
                          {
                            content:
                              "지금까지 그 사람이 당신을 어떻게 생각하는지 알아봤다면..",
                            position: "top-2 left-4",
                            bubbleStyle:
                              "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
                            tailPosition: "bottom",
                            maxWidth: "75%",
                            textStyle:
                              "text-sm text-gray-800 font-bold leading-relaxed",
                            zIndex: 20,
                          },
                          {
                            content:
                              "남은 카드는 그 사람과의 미래를 볼 것이다마!",
                            position: "bottom-2 right-4",
                            bubbleStyle:
                              "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
                            tailPosition: "top",
                            maxWidth: "75%",
                            textStyle:
                              "text-sm text-gray-800 font-bold leading-relaxed",
                            zIndex: 20,
                          },
                        ]}
                      />
                      <div className="flex justify-center w-full py-12">
                        <div className="relative">
                          <SpeechBubble
                            content="약간의 복채가 필요하지만... 지금 구매하면 그 사람과의 궁합을 추가로 봐주겠다마!"
                            position="relative"
                            borderStyle="solid"
                            borderType="oval"
                            backgroundColor="bg-blue-100"
                            borderColor="border-blue-500"
                            borderWidth="border-3"
                            textStyle="text-lg font-bold text-blue-900"
                            padding="p-8"
                            maxWidth="350px"
                            zIndex={30}
                            showTail={false}
                            edgeImage="/images/characters/desert_fox/desert_fox_non_bg_watch_card.jpeg"
                            edgeImagePosition="bottom-right"
                            edgeImageSize="w-16 h-16"
                            customStyle={{
                              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                              background:
                                "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                            }}
                          />
                        </div>
                      </div>
                      {/* 두 번째 추가 웹툰 패널 - 토끼의 등장 */}
                      <div className="flex justify-center w-full py-8">
                        <div className="w-full max-w-lg">
                          <WebtoonPanel
                            backgroundImage="/images/characters/webtoon/rabbit_watching_desert_fox.png"
                            fitImage={true}
                            allowOverflow={true}
                            className=""
                            borderRadius="rounded-lg"
                            speechBubbles={[
                              {
                                content: "그 사람과 제가 잘 맞을까요..?",
                                position: "top-4 left-4",
                                bubbleStyle:
                                  "bg-pink-50 bg-opacity-95 border-3 border-pink-400",
                                tailPosition: "bottom",
                                maxWidth: "65%",
                                textStyle:
                                  "text-sm text-gray-800 font-bold leading-relaxed",
                                zIndex: 20,
                              },
                            ]}
                            soundEffects={[
                              {
                                content: "확인해줄게!",
                                position: "bottom-12 right-6",
                                rotation: 0,
                                textStyle: "text-xl font-black text-pink-600",
                                stroke: "2px #fff",
                                zIndex: 25,
                              },
                            ]}
                          />
                        </div>
                      </div>

                      <SpeechBubble
                        content="아직 확신이 없냐마? 앞으로 진행할 이야기를 아래에서 확인해보라마!"
                        position="relative"
                        borderStyle="solid"
                        borderType="oval"
                        backgroundColor="bg-blue-100"
                        borderColor="border-blue-500"
                        borderWidth="border-3"
                        textStyle="text-lg font-bold text-blue-900"
                        padding="p-8"
                        maxWidth="350px"
                        zIndex={30}
                        showTail={false}
                        edgeImage="/images/characters/desert_fox/desert_fox_non_bg_watch_card.jpeg"
                        edgeImagePosition="bottom-right"
                        edgeImageSize="w-16 h-16"
                        customStyle={{
                          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                          background:
                            "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                        }}
                      />
                      {/* 단독 말풍선 - 페넥의 궁합 제안 */}
                    </>
                  ) : null;
                })()}

              {/* 프로모션 섹션 진입 전 웹툰 패널 */}
              <div
                ref={promotionTriggerRef}
                className="flex justify-center w-full py-8"
              >
                <div className="w-full max-w-lg relative">
                  <WebtoonPanel
                    backgroundImage="/images/characters/webtoon/desert_fox_watching_card.jpeg"
                    fitImage={true}
                    allowOverflow={true}
                    className=""
                    borderRadius="rounded-lg"
                    speechBubbles={[
                      {
                        content: "설명을 들어보라마..",
                        position: "top-4 left-4",
                        bubbleStyle:
                          "bg-blue-50 bg-opacity-95 border-3 border-blue-400",
                        tailPosition: "bottom",
                        maxWidth: "75%",
                        textStyle:
                          "text-sm text-gray-800 font-bold leading-relaxed",
                        zIndex: 20,
                      },
                    ]}
                  />

                  {/* 전등 버튼 - 웹툰 패널 영역 내에서만 보이도록 클리핑 */}
                  {isPromotionVisible && (
                    <div
                      className="absolute inset-0 overflow-hidden z-30"
                      style={{ clipPath: 'inset(0)' }}
                    >
                      <button
                        onClick={() => setShowContentModal(true)}
                        className="fixed w-12 h-12 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
                        style={{
                          top: '1rem',
                          right: 'max(1rem, calc(50% - 200px))', // 웹툰 패널 max-width 기준으로 조정
                        }}
                      >
                        {/* 전등 아이콘 */}
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 프로모션 섹션 */}
              <div className="mt-[1500px] pt-32 promotion-section">
                <PromotionSection />
              </div>
            </>
          )}
        </div>

        {/* Fixed Bottom Purchase Section */}
        <div
          className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full min-w-[320px] max-w-[500px] bg-black bg-opacity-85 backdrop-blur-sm border-t border-gray-600 p-4 shadow-2xl transition-transform duration-300 ease-in-out ${
            isBottomBarVisible ? "translate-y-0" : "translate-y-full"
          }`}
          style={{
            zIndex: 9999,
            transform: `translateX(-50%) ${
              isBottomBarVisible ? "translateY(0)" : "translateY(100%)"
            }`,
          }}
        >
          {/* Navigation and Purchase Buttons */}
          {currentSection === 1 ? (
            <button
              onClick={handleNextSection}
              className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              다음 →
            </button>
          ) : (
            <>
              {isPromotionVisible ? (
                <div className="flex flex-col w-full">
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-400 line-through text-sm">
                        ₩6,900
                      </span>
                      <span className="text-2xl font-bold text-red-400">
                        ₩2,900
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs text-gray-300">
                        할인 종료까지:
                      </span>
                      <div className="bg-gray-800 bg-opacity-60 text-white px-2 py-1 rounded flex items-center gap-1 text-sm font-mono border border-gray-500">
                        <span className="font-bold">
                          {String(timeRemaining.hours).padStart(2, "0")}
                        </span>
                        <span>:</span>
                        <span className="font-bold">
                          {String(timeRemaining.minutes).padStart(2, "0")}
                        </span>
                        <span>:</span>
                        <span className="font-bold text-red-400">
                          {String(timeRemaining.seconds).padStart(2, "0")}
                        </span>
                        <span className="text-red-400">.</span>
                        <span className="font-bold text-red-400">
                          {String(timeRemaining.hundredths).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePurchaseClick}
                    className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    지금 구매하기
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePreviousSection}
                  className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                >
                  ← 이전
                </button>
              )}
            </>
          )}
        </div>


        {/* 콘텐츠 추천 모달 */}
        {showContentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-hidden transform transition-transform duration-300 ease-out">
              {/* 모달 헤더 */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-black">
                    ✨ 이런 콘텐츠도 있어요!
                  </h3>
                  <button
                    onClick={() => setShowContentModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-2">더 많은 재미있는 콘텐츠를 확인해보세요</p>
              </div>

              {/* 콘텐츠 목록 */}
              <div className="p-6 overflow-y-auto">
                <ContentRecommendations pageType="mind-reading" limit={6} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
