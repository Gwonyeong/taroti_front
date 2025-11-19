import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import ChatMessage from "../components/ChatMessage";
import CardBack from "../components/CardBack";

const Landing = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    // 자동 리다이렉트 제거 - 항상 랜딩 페이지에서 시작

    // 첫 번째 메시지 자동 시작 (useRef로 중복 방지)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setTimeout(() => {
        showNextMessage();
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      // 사용자 정보 저장
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

  // 결과 페이지로 이동
  const handleNavigateToResult = async () => {
    setShowNavigateButton(false);
    setIsTyping(true);

    try {
      // 항상 새로운 사용자로 처리

      // 사용자 정보에 선택된 카드 번호 추가
      const userDataWithCard = {
        ...userInfo,
        selectedCardNumber,
      };

      console.log("Sending user data:", userDataWithCard);

      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
        }/api/landing-user-v2`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDataWithCard),
        }
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        // 로컬스토리지에 사용자 ID와 카드 번호 저장
        localStorage.setItem(
          "taroTI_landingUserIdV2",
          data.landingUserId.toString()
        );
        localStorage.setItem(
          "taroTI_selectedCardNumber",
          selectedCardNumber.toString()
        );
        navigate(
          `/result/${data.landingUserId}?cardNumber=${selectedCardNumber}&version=2`
        );
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to save user data. Status:",
          response.status,
          "Error:",
          errorText
        );
        // 에러 시에도 임시 ID로 이동
        navigate(`/result/temp?cardNumber=${selectedCardNumber}`);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      navigate(`/result/temp?cardNumber=${selectedCardNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-offWhite flex justify-center">
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white text-black p-4 shadow-md">
          <h1 className="text-xl font-bold text-left">TaroTI</h1>
        </div>

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
      </div>
    </div>
  );
};

export default Landing;
