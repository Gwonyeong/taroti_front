import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import ChatMessage from "../ChatMessage";
import CardBack from "../CardBack";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../LoginModal";
import AdBanner from "../AdBanner";
import Navigation from "../ui/Navigation";
import { toast } from "sonner";

/**
 * 동적 운세 채팅 컴포넌트 - 템플릿 데이터 기반으로 동작
 *
 * @param {Object} props
 * @param {Object} props.template - 운세 템플릿 데이터
 */
const DynamicChatFortune = ({ template, onSessionCreated }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

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

  // 사용자 입력 상태
  const [userInputs, setUserInputs] = useState({
    birthDate: '',
    gender: '',
    mbti: ''
  });
  const [currentInputField, setCurrentInputField] = useState(null);
  const [tempInputValue, setTempInputValue] = useState(''); // 임시 입력값
  const [mbtiSelections, setMbtiSelections] = useState({
    EI: '',
    SN: '',
    TF: '',
    JP: ''
  }); // MBTI 단계별 선택

  // 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdBanner, setShowAdBanner] = useState(false);

  // 사용자 상태 확인
  const needsProfile = () => {
    if (!isAuthenticated) return true;
    if (!user) return true;

    const requiredFields = template.requiredFields || ['birthDate', 'gender', 'mbti'];
    return requiredFields.some(field => !user[field]);
  };

  // 메시지 시나리오 선택
  const getMessageScenario = () => {
    if (!template) {
      return [];
    }

    if (!template.messageScenarios) {
      return [];
    }

    if (needsProfile()) {
      return template.messageScenarios?.needsProfile || [];
    }
    return template.messageScenarios?.withProfile || [];
  };

  // 메시지를 자동으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 추가
  const addMessage = (text, sender = "bot") => {
    const messageId = Date.now() + Math.random();
    const newMessage = {
      id: messageId,
      text,
      sender,
      timestamp: new Date(),
      characterName: sender === 'bot' ? template?.characterInfo?.name : null,
      characterImage: sender === 'bot' ? template?.characterInfo?.imageSrc : null
    };
    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];
      return updatedMessages;
    });
    return messageId;
  };

  // 임시 값 저장
  const handleTempInput = (value) => {
    setTempInputValue(value);
  };

  // MBTI 선택 처리
  const handleMbtiSelect = (category, value) => {
    setMbtiSelections(prev => ({ ...prev, [category]: value }));
  };

  // MBTI 확인 처리
  const handleMbtiConfirm = () => {
    const { EI, SN, TF, JP } = mbtiSelections;
    if (!EI || !SN || !TF || !JP) return;

    const mbtiResult = EI + SN + TF + JP;
    setUserInputs(prev => ({ ...prev, mbti: mbtiResult }));
    addMessage(mbtiResult, 'user');

    setCurrentInputField(null);
    setMbtiSelections({ EI: '', SN: '', TF: '', JP: '' });

    // 다음 메시지 표시
    setTimeout(() => {
      showNextMessage();
    }, 500);
  };

  // 확인 버튼 클릭 처리
  const handleInputConfirm = () => {
    if (!currentInputField || !tempInputValue) return;

    setUserInputs(prev => ({ ...prev, [currentInputField]: tempInputValue }));

    // 사용자 메시지 추가 (생년월일의 경우 포맷팅)
    let displayValue = tempInputValue;
    if (currentInputField === 'birthDate' && tempInputValue.length === 6) {
      displayValue = `${tempInputValue.substring(0, 2)}년 ${tempInputValue.substring(2, 4)}월 ${tempInputValue.substring(4, 6)}일`;
    }
    addMessage(displayValue, 'user');

    setCurrentInputField(null);
    setTempInputValue('');

    // 다음 메시지 표시
    setTimeout(() => {
      showNextMessage();
    }, 500);
  };


  // 다음 메시지 표시
  const showNextMessage = () => {
    const scenario = getMessageScenario();

    if (currentStep < scenario.length) {
      const currentMessage = scenario[currentStep];
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        addMessage(currentMessage.text, currentMessage.sender || 'bot');

        if (currentMessage.showUserInput) {
          // 사용자 입력 필요
          setTimeout(() => {
            setCurrentInputField(currentMessage.showUserInput);
            setTempInputValue(''); // 새로운 입력 시작 시 임시값 초기화
            if (currentMessage.showUserInput === 'mbti') {
              setMbtiSelections({ EI: '', SN: '', TF: '', JP: '' }); // MBTI 선택 초기화
            }
          }, 300);
        } else if (currentMessage.showCardSelect) {
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
    if (waitingForClick && currentStep < getMessageScenario().length) {
      setWaitingForClick(false);
      showNextMessage();
    }
  };

  // 카드 선택 처리
  const handleCardSelect = async (cardIndex) => {
    // 카드 설정에서 사용 가능한 카드 번호 배열 가져오기
    const availableCards = template.cardConfig?.cardNumbers || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

    // 랜덤하게 카드 선택
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCardNumber = availableCards[randomIndex];

    setSelectedCardNumber(selectedCardNumber);
    setShowCardSelect(false);
    setShowSelectedCard(true);

    // 선택한 카드 메시지 추가
    addMessage(`카드를 선택했습니다!`, 'user');

    // 세션 생성
    try {
      const fortuneSettings = getFortuneSettings();
      const sessionData = {
        selectedCard: selectedCardNumber,
        userProfileData: needsProfile() ? userInputs : null,
        fortuneType: fortuneSettings.fortuneType || template.title
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/fortune-sessions/template/${template.templateKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        },
        body: JSON.stringify(sessionData)
      });

      const data = await response.json();

      if (data.success) {
        setShowNavigateButton(true);
        if (onSessionCreated) {
          onSessionCreated(data.sessionId);
        }
      }
    } catch (error) {
      // 세션 생성 실패
    }
  };

  // fortuneSettings 파싱
  const getFortuneSettings = () => {
    if (!template.fortuneSettings) return {};
    if (typeof template.fortuneSettings === 'string') {
      try {
        return JSON.parse(template.fortuneSettings);
      } catch (e) {
        return {};
      }
    }
    return template.fortuneSettings;
  };

  // 임시 데이터 세션 스토리지에 저장
  const saveTempFortuneData = () => {
    const tempData = {
      templateKey: template.templateKey,
      selectedCard: selectedCardNumber,
      userProfileData: userInputs,
      timestamp: Date.now()
    };
    sessionStorage.setItem('temp_fortune_data', JSON.stringify(tempData));
  };

  // 결과 페이지로 이동
  const handleNavigateToResult = () => {
    if (!isAuthenticated) {
      // 비로그인 사용자 - 임시 데이터 저장 후 로그인 모달 표시
      saveTempFortuneData();
      setShowLoginModal(true);
    } else {
      // 로그인 사용자 - 바로 광고 표시 후 결과 페이지로 이동
      setShowAdBanner(true);
    }
  };

  // 로그인 성공 후 처리
  const handleLoginSuccess = async () => {
    try {
      // 토큰이 제대로 설정될 때까지 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 100));

      // 임시 저장된 데이터 가져오기
      const tempDataStr = sessionStorage.getItem('temp_fortune_data');
      if (!tempDataStr) {
        return;
      }

      const tempData = JSON.parse(tempDataStr);

      // 토큰 존재 확인
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast.error('로그인 정보를 확인할 수 없습니다.');
        return;
      }

      // 사용자 프로필 업데이트
      const updateResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(tempData.userProfileData)
      });

      if (!updateResponse.ok) {
        toast.error('프로필 업데이트에 실패했습니다.');
        return;
      }

      // 세션 생성
      const fortuneSettings = getFortuneSettings();
      const sessionData = {
        selectedCard: tempData.selectedCard,
        userProfileData: tempData.userProfileData,
        fortuneType: fortuneSettings.fortuneType || template.title
      };

      const sessionResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/fortune-sessions/template/${template.templateKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(sessionData)
      });

      const sessionData_result = await sessionResponse.json();

      if (sessionData_result.success) {
        // 임시 데이터 삭제
        sessionStorage.removeItem('temp_fortune_data');

        // 세션 ID 저장
        localStorage.setItem(`fortune_session_${template.templateKey}`, sessionData_result.sessionId);

        // 로그인 모달 닫기
        setShowLoginModal(false);

        // 성공 알림
        toast.success('로그인이 완료되었습니다! 운세 결과를 확인해보세요.');

        // 광고 표시 후 결과 페이지로 이동
        setShowAdBanner(true);
      } else {
        toast.error('운세 세션 생성에 실패했습니다.');
      }
    } catch (error) {
      toast.error('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleAdComplete = () => {
    // localStorage에 저장된 sessionId 가져오기
    const sessionId = localStorage.getItem(`fortune_session_${template.templateKey}`);
    if (sessionId) {
      // sessionId를 URL에 포함시켜 결과 페이지로 이동
      navigate(`/fortune/${template.templateKey}/result/${sessionId}`);
    } else {
      // sessionId가 없는 경우 에러 처리
      setShowAdBanner(false);
    }
  };

  // 초기화 및 첫 메시지 시작
  useEffect(() => {
    if (!template || hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    setTimeout(() => {
      showNextMessage();
    }, 300);
  }, [template]);

  if (isLoading || !template) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-offWhite flex justify-center relative">
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen relative z-10">
        <Navigation fixed />
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
              characterImageSrc={message.characterImage || template.characterInfo?.imageSrc}
              characterName={message.characterName || template.characterInfo?.name}
            />
          ))}

          {isTyping && (
            <ChatMessage
              showTypingIndicator={true}
              characterImageSrc={template.characterInfo?.imageSrc}
              characterName={template.characterInfo?.name}
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

        {/* 사용자 입력 UI */}
        {currentInputField === 'birthDate' && (
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="space-y-4">
              <p className="text-sm text-charcoal text-center">생년월일을 입력해주세요</p>
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="YYMMDD (예: 951215)"
                  maxLength={6}
                  value={tempInputValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
                    handleTempInput(value);
                  }}
                  className="w-48 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent text-center"
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                6자리 숫자로 입력해주세요 (예: 951215)
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleInputConfirm}
                  disabled={tempInputValue.length !== 6}
                  className="px-8 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {currentInputField === 'gender' && (
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="space-y-4">
              <p className="text-sm text-charcoal text-center">성별을 선택해주세요</p>
              <div className="grid grid-cols-2 gap-3 max-w-64 mx-auto">
                <button
                  onClick={() => handleTempInput('남성')}
                  className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                    tempInputValue === '남성'
                      ? 'border-charcoal bg-charcoal text-white'
                      : 'border-gray-300 bg-white text-charcoal hover:border-gray-400'
                  }`}
                >
                  남성
                </button>
                <button
                  onClick={() => handleTempInput('여성')}
                  className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                    tempInputValue === '여성'
                      ? 'border-charcoal bg-charcoal text-white'
                      : 'border-gray-300 bg-white text-charcoal hover:border-gray-400'
                  }`}
                >
                  여성
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleInputConfirm}
                  disabled={!tempInputValue}
                  className="px-8 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {currentInputField === 'mbti' && (
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="space-y-4">
              <p className="text-sm text-charcoal text-center">성격 유형을 선택해주세요</p>

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
                <button
                  onClick={handleMbtiConfirm}
                  disabled={!Object.values(mbtiSelections).every(value => value !== '')}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    Object.values(mbtiSelections).every(value => value !== '')
                      ? "bg-charcoal hover:bg-gray-800 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  확인
                </button>
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
                {Array.from({ length: template.cardConfig?.cardSelectCount || 3 }, (_, index) => (
                  <CardBack
                    key={index}
                    onClick={() => handleCardSelect(index)}
                    centerImage={template.cardConfig?.cardBackImage || "/images/cards/back/camp_band.jpeg"}
                    alt={`카드 ${index + 1}`}
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
                  <CardBack
                    cardNumber={selectedCardNumber}
                    isFlipped={true}
                    customBackImage={template.cardConfig?.cardBackImage}
                  />
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
              {getFortuneSettings().resultButtonText || '운세 결과 보기'}
            </button>
          </div>
        )}

        {/* 로그인 모달 */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* 광고 배너 */}
        <AdBanner
          isOpen={showAdBanner}
          onClose={() => setShowAdBanner(false)}
          onComplete={handleAdComplete}
          title={getFortuneSettings().adTitle || '운세 결과'}
        />
      </div>

    </div>
  );
};

export default DynamicChatFortune;