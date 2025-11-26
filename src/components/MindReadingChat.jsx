import React, { useState } from "react";
import { Button } from "./ui/button";
import ChatMessage from "./ChatMessage";

const MindReadingChat = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `안녕하세요 ${user?.nickname}님! 그 사람의 마음을 읽어드릴게요.`,
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "어떤 상황에서 상대방의 마음이 궁금하신가요?",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "흥미로운 상황이네요! 상대방의 MBTI와 현재 상황을 분석해서 더 정확한 답변을 드리겠습니다. 잠시만 기다려주세요...",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-offWhite flex justify-center">
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white text-black p-4 shadow-md">
          <h1 className="text-xl font-bold text-left">마음 읽기</h1>
          <p className="text-sm text-gray-600">
            {user?.nickname}님의 전용 마음 읽기 서비스
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <ChatMessage showTypingIndicator={true} />}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="상황을 자세히 설명해주세요..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-charcoal hover:bg-gray-800 text-white px-4 py-2"
            >
              전송
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindReadingChat;