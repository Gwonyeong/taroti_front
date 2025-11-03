import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';

const Landing = () => {
  const [messages, setMessages] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [waitingForClick, setWaitingForClick] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [birthDate, setBirthDate] = useState('');
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
    { text: "반갑다냥, 나는 캐럿이다냥.", sender: "bot" },
    { text: "네가 애인을 대할 때, 좋은 행동을 알려줄거다냥.", sender: "bot" },
    { text: "나이를 알려달라냥", sender: "bot", showDateInput: true }
  ];

  useEffect(() => {
    // 첫 번째 메시지 자동 시작 (useRef로 중복 방지)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setTimeout(() => {
        showNextMessage();
      }, 500);
    }
  }, []);

  const addMessage = (text, sender = "bot") => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date()
    }]);
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
          }, 500);
        } else {
          // 다음 메시지를 위해 클릭 대기
          setWaitingForClick(true);
        }

        setCurrentStep(prev => prev + 1);
      }, 1500);
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
      setBirthDate('');
      setIsTyping(true);

      // 봇 응답
      setTimeout(() => {
        setIsTyping(false);
        addMessage("좋다냥! 이제 타로 카드를 뽑아보자냥.", "bot");
      }, 1500);
    }
  };

  // 생년월일 입력값 변경 처리
  const handleDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    if (value.length <= 6) {
      setBirthDate(value);
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
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${waitingForClick ? 'cursor-pointer' : ''}`}
          onClick={handleChatClick}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="flex flex-col items-center mr-3">
                  <div className="w-10 h-10 bg-white border-2 border-charcoal rounded-full overflow-hidden">
                    <img
                      src="/images/characters/carot.png"
                      alt="캐럿 캐릭터"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-charcoal mt-1">캐럿</span>
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-charcoal text-white rounded-br-none'
                    : 'bg-gray-100 text-charcoal rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex flex-col items-center mr-3">
                <div className="w-10 h-10 bg-white border-2 border-charcoal rounded-full overflow-hidden">
                  <img
                    src="/images/characters/carot.png"
                    alt="캐럿 캐릭터"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-charcoal mt-1">캐럿</span>
              </div>
              <div className="bg-gray-100 text-charcoal px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
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

        {/* Date Input */}
        {showDateInput && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-3">
              <p className="text-sm text-charcoal text-center">생년월일 6자리를 입력해주세요 (YYMMDD)</p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={birthDate}
                  onChange={handleDateChange}
                  placeholder="예: 951225"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-center text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
                  maxLength={6}
                />
                <Button
                  onClick={handleDateSubmit}
                  disabled={birthDate.length !== 6}
                  className="bg-charcoal hover:bg-gray-800 text-white px-6"
                >
                  입력
                </Button>
              </div>
              {birthDate.length > 0 && birthDate.length < 6 && (
                <p className="text-xs text-red-500 text-center">6자리를 모두 입력해주세요</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;