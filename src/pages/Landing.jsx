import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import ChatMessage from "../components/ChatMessage";
import CardBack from "../components/CardBack";
import { useAuth } from "../context/AuthContext";
import MindReadingChat from "../components/MindReadingChat";
import LoginModal from "../components/LoginModal";
import Navigation from "../components/ui/Navigation";
import { toast } from "sonner";

const Landing = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, isLoading } = useAuth();

  // 페이지 상태: 'loading', 'profile-setup', 'chat'
  const [pageState, setPageState] = useState('loading');
  const [isNavigatingToResult, setIsNavigatingToResult] = useState(false);

  // 기존 states
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [waitingForClick, setWaitingForClick] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [showGenderSelect, setShowGenderSelect] = useState(false);
  const [showMbtiInput, setShowMbtiInput] = useState(false);
  const [showCardSelect, setShowCardSelect] = useState(false);
  const [showSelectedCard, setShowSelectedCard] = useState(false);
  const [showNavigateButton, setShowNavigateButton] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [mbtiSelections, setMbtiSelections] = useState({
    EI: "", // E or I
    SN: "", // S or N
    TF: "", // T or F
    JP: "", // J or P
  });
  const [userInfo, setUserInfo] = useState({});
  const [selectedCardNumber, setSelectedCardNumber] = useState(null);
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);

  // 로그인 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 시나리오 정의
  const messageScenario = [
    { text: "반갑다마, 나는 페넥이다마.", sender: "bot" },
    { text: "그 사람의 속마음이 궁금하냐마!?", sender: "bot" },
    {
      text: "타로 카드로 한 번 알아보자마!",
      sender: "bot",
    },
    {
      text: "당신의 성격유형과 카드 결과에 따라 맞춤 조언도 해주겠다마.",
      sender: "bot",
    },
    {
      text: "그 사람과의 관계가 깊어지는데 도움이 될거다마!",
      sender: "bot",
    },
    {
      text: "준비됐냐마!?",
      sender: "bot",
    },
    { text: "나이를 알려달라마", sender: "bot", showDateInput: true },
  ];

  // 페이지 상태 결정
  useEffect(() => {
    if (isLoading) {
      setPageState('loading');
      return;
    }

    // 결과 페이지로 이동 중인 경우 상태 변경 방지
    if (isNavigatingToResult) {
      return;
    }

    // 로그인하지 않았거나 프로필이 완성되지 않은 경우
    if (!isAuthenticated || !user?.hasCompleteProfile) {
      setPageState('profile-setup');

      // 프로필 설정 페이지에서는 기존 로직 실행
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        setTimeout(() => {
          showNextMessage();
        }, 300);
      }
    } else {
      // 로그인했고 프로필이 완성된 경우 - 새로운 채팅 페이지
      setPageState('chat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, user, isNavigatingToResult]);

  const addMessage = (text, sender = "bot", imageUrl = null) => {
    const messageId = Date.now() + Math.random();
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        text,
        sender,
        timestamp: new Date(),
        image: imageUrl,
      },
    ]);
    return messageId;
  };

  const showNextMessage = () => {
    if (currentStep < messageScenario.length) {
      const currentMessage = messageScenario[currentStep];
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        addMessage(currentMessage.text, currentMessage.sender);

        if (currentMessage.showDateInput) {
          // 생년월일 입력창 표시
          setTimeout(() => {
            setShowDateInput(true);
            setTimeout(() => {
              scrollToBottom();
            }, 100);
          }, 300);
        } else {
          // 다음 메시지를 위해 클릭 대기
          setWaitingForClick(true);
        }

        setCurrentStep((prev) => prev + 1);
      }, 800);
    }
  };

  // 채팅 영역 클릭 시 다음 메시지 표시
  const handleChatClick = () => {
    if (waitingForClick && currentStep < messageScenario.length) {
      setWaitingForClick(false);
      showNextMessage();
    }
  };

  // 생년월일 입력 처리
  const handleDateSubmit = () => {
    if (birthDate.length === 6 && /^\d{6}$/.test(birthDate)) {
      // 사용자 입력 추가
      const year = birthDate.substring(0, 2);
      const month = birthDate.substring(2, 4);
      const day = birthDate.substring(4, 6);
      const formattedDate = `${year}년 ${month}월 ${day}일`;

      addMessage(formattedDate, "user");
      setShowDateInput(false);
      // birthDate를 초기화하지 않고 유지
      setIsTyping(true);

      // 봇 응답
      setTimeout(() => {
        setIsTyping(false);
        addMessage("좋다마!", "bot");

        // 성별 질문
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage("성별은 뭐다마?", "bot");
            setTimeout(() => {
              setShowGenderSelect(true);
              setTimeout(() => {
                scrollToBottom();
              }, 100);
            }, 300);
          }, 600);
        }, 600);
      }, 800);
    }
  };

  // 생년월일 입력값 변경 처리
  const handleDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // 숫자만 허용
    if (value.length <= 6) {
      setBirthDate(value);
    }
  };

  // 성별 선택 처리
  const handleGenderClick = (gender) => {
    setSelectedGender(gender);
  };

  // 성별 확정 처리
  const handleGenderConfirm = () => {
    if (selectedGender) {
      addMessage(selectedGender, "user");
      setShowGenderSelect(false);
      // selectedGender를 초기화하지 않고 유지
      setIsTyping(true);

      // 봇 응답
      setTimeout(() => {
        setIsTyping(false);
        addMessage("좋다마!", "bot");

        // MBTI 질문
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage("성격 유형은 뭐다마?", "bot");
            setTimeout(() => {
              setShowMbtiInput(true);
              setTimeout(() => {
                scrollToBottom();
              }, 100);
            }, 300);
          }, 600);
        }, 600);
      }, 800);
    }
  };

  // MBTI 선택 처리
  const handleMbtiSelect = (category, value) => {
    setMbtiSelections((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // MBTI 확정 처리
  const handleMbtiConfirm = () => {
    const { EI, SN, TF, JP } = mbtiSelections;
    if (EI && SN && TF && JP) {
      const mbtiType = EI + SN + TF + JP;
      addMessage(mbtiType, "user");
      setShowMbtiInput(false);
      setIsTyping(true);

      // 사용자 정보 저장 (로컬 상태에만 저장, 서버에는 저장하지 않음)
      const userData = {
        birthDate,
        gender: selectedGender,
        mbti: mbtiType,
      };
      setUserInfo(userData);

      // 봇 응답
      setTimeout(() => {
        setIsTyping(false);
        addMessage("완벽하다마! 페넥의 노트에 기록하겠다마!", "bot");

        // 이미지 메시지 추가 (먼저 GIF)
        setTimeout(() => {
          const gifMessageId = addMessage(
            "",
            "bot",
            "/images/characters/desert_fox/desert_fox_write_with_pen_square.gif"
          );

          // 3초 후 이미지 교체
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === gifMessageId
                  ? {
                      ...msg,
                      image:
                        "/images/characters/desert_fox/desert_fox_sit_desk.jpeg",
                    }
                  : msg
              )
            );

            // 카드 선택 메시지
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addMessage("이제 타로 카드를 뽑아보자마.", "bot");

                // 카드 선택 화면 표시
                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setIsTyping(false);
                    addMessage("3장의 카드 중 하나를 선택해달라마!", "bot");
                    setTimeout(() => {
                      setShowCardSelect(true);
                      setTimeout(() => {
                        scrollToBottom();
                      }, 100);
                    }, 300);
                  }, 600);
                }, 600);
              }, 600);
            }, 600);
          }, 3000);
        }, 400);
      }, 800);
    }
  };

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

  // 카드 선택 처리
  const handleCardSelect = async () => {
    // 0-10번 중 랜덤 선택
    const randomCardNumber = Math.floor(Math.random() * 11); // 0부터 10까지
    setSelectedCardNumber(randomCardNumber);

    setShowCardSelect(false);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addMessage("좋은 선택이다마! 이제 결과를 확인해보자마.", "bot");

      setTimeout(() => {
        setShowSelectedCard(true);
        setShowNavigateButton(true);
      }, 300);
    }, 800);
  };

  // 로컬 스토리지에 프로필 정보 저장
  const saveProfileToLocalStorage = () => {
    localStorage.setItem("tempProfile", JSON.stringify({
      birthDate,
      gender: selectedGender,
      mbti: Object.values(mbtiSelections).join(""),
      selectedCardNumber,
    }));
  };

  // 로컬 스토리지에서 프로필 정보 불러오기 및 삭제
  const loadAndClearTempProfile = () => {
    const tempProfile = localStorage.getItem("tempProfile");
    if (tempProfile) {
      localStorage.removeItem("tempProfile");
      return JSON.parse(tempProfile);
    }
    return null;
  };

  // Mind Reading 세션 생성
  const createMindReadingSession = async (profileData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"}/api/mind-reading`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.mindReadingId;
      } else {
        throw new Error('Failed to create mind reading session');
      }
    } catch (error) {
      console.error("Error creating mind reading session:", error);
      throw error;
    }
  };

  // 결과 페이지로 이동
  const handleNavigateToResult = async () => {
    setShowNavigateButton(false);
    setIsTyping(true);
    setIsNavigatingToResult(true); // 페이지 상태 변경 방지

    const profileData = {
      birthDate,
      gender: selectedGender,
      mbti: Object.values(mbtiSelections).join(""),
      selectedCardNumber,
    };

    try {
      if (!isAuthenticated) {
        // 1. 로그인하지 않은 경우: 로컬 스토리지에 저장 후 로그인 모달
        saveProfileToLocalStorage();
        setShowLoginModal(true);
        setIsTyping(false);
        setIsNavigatingToResult(false);
        return;
      }

      if (!user?.hasCompleteProfile) {
        // 2. 로그인했지만 프로필 미완성: 프로필 업데이트 후 결과 페이지
        toast.success("입력한 프로필 정보를 저장할게요!");
        await updateProfile({
          birthDate: profileData.birthDate,
          gender: profileData.gender,
          mbti: profileData.mbti,
        });
      }

      // Mind Reading 세션 생성
      const mindReadingId = await createMindReadingSession(profileData);

      // 새로운 결과 페이지로 이동 (mind-reading 기반)
      navigate(`/mind-reading-result/${mindReadingId}`);

    } catch (error) {
      console.error("Error in handleNavigateToResult:", error);
      setIsTyping(false);
      setIsNavigatingToResult(false);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 로그인 성공 후 처리
  const handleLoginSuccess = async (userData) => {
    setIsNavigatingToResult(true); // 페이지 상태 변경 방지
    try {
      const tempProfile = loadAndClearTempProfile();
      if (tempProfile) {
        // 임시 저장된 프로필로 사용자 프로필 업데이트
        await updateProfile({
          birthDate: tempProfile.birthDate,
          gender: tempProfile.gender,
          mbti: tempProfile.mbti,
        });

        toast.success("프로필 정보가 저장되었습니다!");

        // Mind Reading 세션 생성
        const mindReadingId = await createMindReadingSession(tempProfile);

        // 결과 페이지로 이동
        navigate(`/mind-reading-result/${mindReadingId}`);
      }
    } catch (error) {
      console.error("Error handling login success:", error);
      setIsNavigatingToResult(false);
      toast.error("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  // 로딩 상태
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 새로운 채팅 페이지 (로그인했고 프로필 완성된 경우)
  if (pageState === 'chat') {
    return <MindReadingChat user={user} />;
  }

  // 프로필 설정 페이지 (기존 로직)
  return (
    <div className="min-h-screen bg-offWhite flex justify-center">
      <Navigation fixed />
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
        {/* 고정 네비게이션을 위한 여백 */}
        <div className="h-16"></div>

        {/* Chat Messages */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            waitingForClick ? "cursor-pointer" : ""
          }`}
          onClick={handleChatClick}
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              displayImage={message.image}
              imageAlt="페넥 이미지"
              imageClassName="w-64 h-auto rounded-lg mt-4"
            />
          ))}

          {isTyping && <ChatMessage showTypingIndicator={true} />}

          {waitingForClick && (
            <div className="flex justify-center">
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full animate-pulse">
                화면을 터치하여 계속하기
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Date Input */}
        {showDateInput && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-3">
              <p className="text-sm text-charcoal text-center">
                생년월일 6자리를 입력해주세요 (YYMMDD)
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={birthDate}
                  onChange={handleDateChange}
                  placeholder="예: 951225"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
                  maxLength={6}
                />
                <Button
                  onClick={handleDateSubmit}
                  disabled={birthDate.length !== 6}
                  className="w-full bg-charcoal hover:bg-gray-800 text-white py-3"
                >
                  입력
                </Button>
              </div>
              {birthDate.length > 0 && birthDate.length < 6 && (
                <p className="text-xs text-red-500 text-center">
                  6자리를 모두 입력해주세요
                </p>
              )}
            </div>
          </div>
        )}

        {/* Gender Selection */}
        {showGenderSelect && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-3">
              <p className="text-sm text-charcoal text-center">
                성별을 선택해주세요
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleGenderClick("남자")}
                  className={`w-20 h-20 border-2 border-charcoal rounded-lg flex items-center justify-center text-charcoal font-medium transition-colors ${
                    selectedGender === "남자"
                      ? "bg-charcoal text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  남자
                </button>
                <button
                  onClick={() => handleGenderClick("여자")}
                  className={`w-20 h-20 border-2 border-charcoal rounded-lg flex items-center justify-center text-charcoal font-medium transition-colors ${
                    selectedGender === "여자"
                      ? "bg-charcoal text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  여자
                </button>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleGenderConfirm}
                  disabled={!selectedGender}
                  className={`px-6 transition-colors ${
                    selectedGender
                      ? "bg-charcoal hover:bg-gray-800 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  확인
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MBTI Selection */}
        {showMbtiInput && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              <p className="text-sm text-charcoal text-center">
                성격 유형을 선택해주세요
              </p>

              {/* E/I Selection */}
              <div className="space-y-2">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleMbtiSelect("EI", "E")}
                    className={`w-16 h-16 border-2 border-charcoal rounded-lg flex items-center justify-center font-bold transition-colors ${
                      mbtiSelections.EI === "E"
                        ? "bg-charcoal text-white"
                        : "bg-white text-charcoal hover:bg-gray-100"
                    }`}
                  >
                    E
                  </button>
                  <button
                    onClick={() => handleMbtiSelect("EI", "I")}
                    className={`w-16 h-16 border-2 border-charcoal rounded-lg flex items-center justify-center font-bold transition-colors ${
                      mbtiSelections.EI === "I"
                        ? "bg-charcoal text-white"
                        : "bg-white text-charcoal hover:bg-gray-100"
                    }`}
                  >
                    I
                  </button>
                </div>
              </div>

              {/* S/N Selection */}
              <div className="space-y-2">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleMbtiSelect("SN", "S")}
                    className={`w-16 h-16 border-2 border-charcoal rounded-lg flex items-center justify-center font-bold transition-colors ${
                      mbtiSelections.SN === "S"
                        ? "bg-charcoal text-white"
                        : "bg-white text-charcoal hover:bg-gray-100"
                    }`}
                  >
                    S
                  </button>
                  <button
                    onClick={() => handleMbtiSelect("SN", "N")}
                    className={`w-16 h-16 border-2 border-charcoal rounded-lg flex items-center justify-center font-bold transition-colors ${
                      mbtiSelections.SN === "N"
                        ? "bg-charcoal text-white"
                        : "bg-white text-charcoal hover:bg-gray-100"
                    }`}
                  >
                    N
                  </button>
                </div>
              </div>

              {/* T/F Selection */}
              <div className="space-y-2">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleMbtiSelect("TF", "T")}
                    className={`w-16 h-16 border-2 border-charcoal rounded-lg flex items-center justify-center font-bold transition-colors ${
                      mbtiSelections.TF === "T"
                        ? "bg-charcoal text-white"
                        : "bg-white text-charcoal hover:bg-gray-100"
                    }`}
                  >
                    T
                  </button>
                  <button
                    onClick={() => handleMbtiSelect("TF", "F")}
                    className={`w-16 h-16 border-2 border-charcoal rounded-lg flex items-center justify-center font-bold transition-colors ${
                      mbtiSelections.TF === "F"
                        ? "bg-charcoal text-white"
                        : "bg-white text-charcoal hover:bg-gray-100"
                    }`}
                  >
                    F
                  </button>
                </div>
              </div>

              {/* J/P Selection */}
              <div className="space-y-2">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleMbtiSelect("JP", "J")}
                    className={`w-16 h-16 border-2 border-charcoal rounded-lg flex items-center justify-center font-bold transition-colors ${
                      mbtiSelections.JP === "J"
                        ? "bg-charcoal text-white"
                        : "bg-white text-charcoal hover:bg-gray-100"
                    }`}
                  >
                    J
                  </button>
                  <button
                    onClick={() => handleMbtiSelect("JP", "P")}
                    className={`w-16 h-16 border-2 border-charcoal rounded-lg flex items-center justify-center font-bold transition-colors ${
                      mbtiSelections.JP === "P"
                        ? "bg-charcoal text-white"
                        : "bg-white text-charcoal hover:bg-gray-100"
                    }`}
                  >
                    P
                  </button>
                </div>
              </div>

              {/* 확인 버튼 */}
              <div className="flex justify-center pt-2">
                <Button
                  onClick={handleMbtiConfirm}
                  disabled={
                    !Object.values(mbtiSelections).every(
                      (value) => value !== ""
                    )
                  }
                  className={`px-6 transition-colors ${
                    Object.values(mbtiSelections).every((value) => value !== "")
                      ? "bg-charcoal hover:bg-gray-800 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  확인
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Card Selection */}
        {showCardSelect && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              <p className="text-sm text-charcoal text-center">
                마음에 끌리는 카드를 선택해주세요
              </p>
              <div className="flex justify-center space-x-4">
                {[1, 2, 3].map((cardIndex) => (
                  <CardBack
                    key={cardIndex}
                    onClick={() => handleCardSelect()}
                    centerImage="/images/cards/back/camp_band.jpeg"
                    alt={`카드 ${cardIndex}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Card Display */}
        {showSelectedCard && selectedCardNumber !== null && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              <p className="text-sm text-charcoal text-center">
                선택하신 카드입니다
              </p>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <img
                    src={`/documents/illustrator/${String(
                      selectedCardNumber
                    ).padStart(2, "0")}-${getCardName(selectedCardNumber)}.jpg`}
                    alt={`${getCardName(selectedCardNumber)} 카드`}
                    className="w-32 h-48 object-cover rounded-lg"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 이미지로 대체
                      e.target.src = "/images/cards/back/camp_band.jpeg";
                    }}
                  />
                  <p className="text-center mt-2 font-medium text-charcoal">
                    {getCardDisplayName(selectedCardNumber)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigate Button */}
        {showNavigateButton && (
          <div className="p-4 bg-white border-t border-gray-200">
            <button
              onClick={handleNavigateToResult}
              className="w-full bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              결과 페이지로 이동하기
            </button>
          </div>
        )}

        {/* 사업자 정보 푸터 */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-6 pb-20">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-xs text-gray-500 mb-2">
              사업자등록번호: 467-15-02791
            </p>
            <p className="text-xs text-gray-500 mb-2">
              통신판매업 신고번호: 2025-서울마포-2857
            </p>
            <p className="text-xs text-gray-500 mb-2">
              상호명: 파드켓 | 대표자명: 조권영
            </p>
            <p className="text-xs text-gray-500 mb-2">
              주소: 서울특별시 마포구 월드컵북로 6길 19-10
            </p>
            <p className="text-xs text-gray-500 mb-4">전화번호: 010-5418-3486</p>
          </div>
        </div>

        {/* 로그인 모달 */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
};

export default Landing;
