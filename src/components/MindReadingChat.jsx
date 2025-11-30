import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import ChatMessage from "./ChatMessage";
import CardBack from "./CardBack";
import Navigation from "./ui/Navigation";
import { toast } from "sonner";

const MindReadingChat = ({ user, preselectedCard }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [waitingForClick, setWaitingForClick] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCardSelect, setShowCardSelect] = useState(false);
  const [showSelectedCard, setShowSelectedCard] = useState(false);
  const [showNavigateButton, setShowNavigateButton] = useState(false);
  const [selectedCardNumber, setSelectedCardNumber] = useState(preselectedCard);
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
    { text: "그 사람의 마음이 궁금하냐마?", sender: "bot" },
    { text: "같이 알아보자마!", sender: "bot" },
    { text: "당신의 프로필이 이게 맞는지 확인해보라마!", sender: "bot", showProfile: true },
  ];

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setTimeout(() => {
        showNextMessage();
      }, 300);
    }
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

        if (currentMessage.showProfile) {
          // 프로필 표시
          setTimeout(() => {
            setShowProfile(true);
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

  // 프로필 확인 처리
  const handleProfileConfirm = () => {
    setShowProfile(false);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // 이미 선택된 카드가 있으면 카드 선택 단계 건너뛰기
      if (preselectedCard !== null && preselectedCard !== undefined) {
        console.log("Using preselected card:", preselectedCard);
        addMessage("이미 선택하신 카드가 있네요! 결과를 확인해보자마.", "bot");

        setTimeout(() => {
          setShowSelectedCard(true);
          setShowNavigateButton(true);
        }, 300);
      } else {
        // 기존 로직: 카드 선택 진행
        addMessage("맞다면, 카드를 바로 선택해보자마!", "bot");

        setTimeout(() => {
          setShowCardSelect(true);
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }, 300);
      }
    }, 800);
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
    };
    return displayNames[cardNumber] || "THE FOOL (바보)";
  };

  // 카드 선택 처리
  const handleCardSelect = async () => {
    // 0-9번 중 랜덤 선택 (10번 이상 카드 제외)
    const randomCardNumber = Math.floor(Math.random() * 10);
    console.log("Generated random card number:", randomCardNumber);

    // 테스트: 10번 랜덤 생성해서 분포 확인
    console.log("=== Random Card Test ===");
    const testResults = [];
    for (let i = 0; i < 10; i++) {
      testResults.push(Math.floor(Math.random() * 10));
    }
    console.log("10 random tests:", testResults);
    console.log("======================");

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

  // Mind Reading 세션 생성
  const createMindReadingSession = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log("Creating MindReading session with:");
      console.log("- selectedCardNumber:", selectedCardNumber);
      console.log("- preselectedCard prop:", preselectedCard);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"}/api/mind-reading`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            birthDate: user.birthDate,
            gender: user.gender,
            mbti: user.mbti,
            selectedCard: selectedCardNumber,
          }),
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

    try {
      // Mind Reading 세션 생성
      const mindReadingId = await createMindReadingSession();

      // 결과 페이지로 이동
      navigate(`/mind-reading-result/${mindReadingId}`);
    } catch (error) {
      console.error("Error in handleNavigateToResult:", error);
      setIsTyping(false);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 성별 표시를 위한 헬퍼 함수
  const getGenderDisplay = (gender) => {
    if (gender === "남성" || gender === "남자") return "남성";
    if (gender === "여성" || gender === "여자") return "여성";
    return gender;
  };

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

        {/* Profile Display */}
        {showProfile && user && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="font-bold text-charcoal mb-3">프로필 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름:</span>
                    <span className="font-medium">{user.nickname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">생년월일:</span>
                    <span className="font-medium">
                      {user.birthDate && user.birthDate.length === 6
                        ? `${user.birthDate.substring(0, 2)}년 ${user.birthDate.substring(2, 4)}월 ${user.birthDate.substring(4, 6)}일`
                        : user.birthDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">성별:</span>
                    <span className="font-medium">{getGenderDisplay(user.gender)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">성격 유형:</span>
                    <span className="font-medium">{user.mbti}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleProfileConfirm}
                  className="flex-1 bg-charcoal hover:bg-gray-800 text-white py-3"
                >
                  확인
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-charcoal py-3"
                >
                  프로필 변경하기
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

export default MindReadingChat;