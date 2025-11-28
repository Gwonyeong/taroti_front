import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import ChatMessage from "../components/ChatMessage";
import CardBack from "../components/CardBack";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import AdBanner from "../components/AdBanner";
import Navigation from "../components/ui/Navigation";
import { toast } from "sonner";

const DecemberFortune = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // 페이지 상태
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [waitingForClick, setWaitingForClick] = useState(false);
  const [showCardSelect, setShowCardSelect] = useState(false);
  const [showSelectedCard, setShowSelectedCard] = useState(false);
  const [showNavigateButton, setShowNavigateButton] = useState(false);
  const [selectedCardNumber, setSelectedCardNumber] = useState(null);
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);

  // 로그인 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false);
  // 쿠팡 광고 모달 상태
  const [showAdModal, setShowAdModal] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 시나리오 정의
  const messageScenario = [
    { text: "12월의 운세를 봐줄거래!", sender: "bot" },
    { text: "바로 카드를 뽑아보고래!", sender: "bot", showCardSelect: true },
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

        if (currentMessage.showCardSelect) {
          // 카드 선택창 표시
          setTimeout(() => {
            setShowCardSelect(true);
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
      11: "Justice",
      12: "TheHangedMan",
      13: "Death",
      14: "Temperance",
      15: "TheDevil",
      16: "TheTower",
      17: "TheStar",
      18: "TheMoon",
      19: "TheSun",
      20: "Judgement",
      21: "TheWorld",
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
      11: "JUSTICE (정의)",
      12: "THE HANGED MAN (매달린 사람)",
      13: "DEATH (죽음)",
      14: "TEMPERANCE (절제)",
      15: "THE DEVIL (악마)",
      16: "THE TOWER (탑)",
      17: "THE STAR (별)",
      18: "THE MOON (달)",
      19: "THE SUN (태양)",
      20: "JUDGEMENT (심판)",
      21: "THE WORLD (세계)",
    };
    return displayNames[cardNumber] || "THE FOOL (바보)";
  };

  // 카드 선택 처리
  const handleCardSelect = async () => {
    // 0-21번 중 랜덤 선택
    const randomCardNumber = Math.floor(Math.random() * 22);
    setSelectedCardNumber(randomCardNumber);

    setShowCardSelect(false);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addMessage("좋은 선택이다래! 이제 결과를 확인해보고래.", "bot");

      setTimeout(() => {
        setShowSelectedCard(true);
        setShowNavigateButton(true);
      }, 300);
    }, 800);
  };

  // December Fortune 세션 생성
  const createDecemberFortuneSession = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5002"
        }/api/december-fortune`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fortuneType: "기본운",
            selectedCardNumber: selectedCardNumber,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.fortuneId;
      } else {
        throw new Error("Failed to create December fortune session");
      }
    } catch (error) {
      console.error("Error creating December fortune session:", error);
      throw error;
    }
  };

  // 결과 페이지로 이동
  const handleNavigateToResult = async () => {
    setShowNavigateButton(false);
    setIsTyping(true);

    try {
      if (!isAuthenticated) {
        // 로그인하지 않은 경우: 로컬 스토리지에 저장 후 로그인 모달
        localStorage.setItem(
          "tempDecemberFortune",
          JSON.stringify({
            fortuneType: "기본운",
            selectedCardNumber,
          })
        );
        setShowLoginModal(true);
        setIsTyping(false);
        return;
      }

      // 광고 모달 표시
      setShowAdModal(true);
      setIsTyping(false);
    } catch (error) {
      console.error("Error in handleNavigateToResult:", error);
      setIsTyping(false);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 광고 완료 후 결과 페이지로 이동
  const handleAdComplete = async () => {
    try {
      // December Fortune 세션 생성
      const fortuneId = await createDecemberFortuneSession();

      // 결과 페이지로 이동
      navigate(`/december-fortune-result/${fortuneId}`);
    } catch (error) {
      console.error("Error navigating to result:", error);
      toast.error("결과 페이지로 이동 중 오류가 발생했습니다.");
    }
  };

  // 로그인 성공 후 처리
  const handleLoginSuccess = async (userData) => {
    try {
      const tempFortune = localStorage.getItem("tempDecemberFortune");
      if (tempFortune) {
        // 로그인 후 광고 모달 표시
        setShowAdModal(true);
      }
    } catch (error) {
      console.error("Error handling login success:", error);
      toast.error("운세 저장 중 오류가 발생했습니다.");
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

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
              imageAlt="돌핀 이미지"
              imageClassName="w-64 h-auto rounded-lg mt-4"
              characterImageSrc="/images/characters/dollfin/dollfin.jpg"
              characterName="돌핀"
            />
          ))}

          {isTyping && (
            <ChatMessage
              showTypingIndicator={true}
              characterImageSrc="/images/characters/dollfin/dollfin.jpg"
              characterName="돌핀"
            />
          )}

          {waitingForClick && (
            <div className="flex justify-center">
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full animate-pulse">
                화면을 터치하여 계속하기
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>


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
              12월 운세 결과 보기
            </button>
          </div>
        )}


        {/* 로그인 모달 */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* 쿠팡 광고 모달 */}
        <AdBanner
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onComplete={handleAdComplete}
          title="12월 운세 결과"
        />
      </div>
    </div>
  );
};

export default DecemberFortune;
