import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/ui/Navigation';
import { toast } from 'sonner';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('mind-reading'); // 'mind-reading' or 'monthly-fortune'
  const [mindReadingData, setMindReadingData] = useState([]);
  const [monthlyFortuneData, setMonthlyFortuneData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
      toast.error('로그인이 필요한 서비스입니다.');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab, currentPage]);

  const fetchUserContent = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');

      if (activeTab === 'mind-reading') {
        const response = await fetch(
          `${API_BASE_URL}/api/my-content/mind-reading?page=${currentPage}&limit=${itemsPerPage}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMindReadingData(data.items || []);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } else {
        const response = await fetch(
          `${API_BASE_URL}/api/my-content/monthly-fortune?page=${currentPage}&limit=${itemsPerPage}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMonthlyFortuneData(data.items || []);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast.error('콘텐츠를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCardName = (cardNumber) => {
    const cardNames = {
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
    return cardNames[cardNumber] || "알 수 없는 카드";
  };

  const getCardImageName = (cardNumber) => {
    const cardImageNames = {
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
    return cardImageNames[cardNumber] || "TheFool";
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleContentClick = (item) => {
    if (activeTab === 'mind-reading') {
      navigate(`/mind-reading-result/${item.id}`);
    } else {
      navigate(`/december-fortune-result/${item.id}`);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-offWhite flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offWhite flex justify-center relative">
      <Navigation fixed />
      <div className="w-full min-w-[320px] max-w-[500px] bg-white flex flex-col min-h-screen relative z-10">
        {/* 고정 네비게이션을 위한 여백 */}
        <div className="h-16"></div>

        {/* 헤더 */}
        <div className="bg-white shadow-sm p-6 border-b">
          <h1 className="text-2xl font-bold text-charcoal mb-2">마이페이지</h1>
          <p className="text-sm text-gray-600">
            {user?.nickname}님의 타로 기록
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b bg-white sticky top-16 z-20">
          <button
            onClick={() => handleTabChange('mind-reading')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'mind-reading'
                ? 'text-charcoal border-b-2 border-charcoal'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            그 사람의 속마음
          </button>
          <button
            onClick={() => handleTabChange('monthly-fortune')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'monthly-fortune'
                ? 'text-charcoal border-b-2 border-charcoal'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            월별 운세
          </button>
        </div>

        {/* 콘텐츠 목록 */}
        <div className="flex-1 bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {activeTab === 'mind-reading' ? (
                mindReadingData.length > 0 ? (
                  mindReadingData.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleContentClick(item)}
                      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        {/* 카드 이미지 */}
                        <div className="flex-shrink-0">
                          <img
                            src={`/documents/illustrator/${String(item.selectedCard).padStart(2, '0')}-${getCardImageName(item.selectedCard)}.jpg`}
                            alt={getCardName(item.selectedCard)}
                            className="w-16 h-24 object-cover rounded"
                            onError={(e) => {
                              e.target.src = '/images/cards/back/camp_band.jpeg';
                            }}
                          />
                        </div>

                        {/* 콘텐츠 정보 */}
                        <div className="flex-1">
                          <h3 className="font-medium text-charcoal mb-1">
                            {getCardName(item.selectedCard)}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            그 사람의 속마음 타로
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>

                        {/* 화살표 */}
                        <div className="flex-shrink-0 self-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    아직 진행한 콘텐츠가 없습니다.
                  </div>
                )
              ) : (
                monthlyFortuneData.length > 0 ? (
                  monthlyFortuneData.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleContentClick(item)}
                      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        {/* 카드 이미지 */}
                        <div className="flex-shrink-0">
                          <img
                            src={`/documents/illustrator/${String(item.selectedCardNumber).padStart(2, '0')}-${getCardImageName(item.selectedCardNumber)}.jpg`}
                            alt={getCardName(item.selectedCardNumber)}
                            className="w-16 h-24 object-cover rounded"
                            onError={(e) => {
                              e.target.src = '/images/cards/back/camp_band.jpeg';
                            }}
                          />
                        </div>

                        {/* 콘텐츠 정보 */}
                        <div className="flex-1">
                          <h3 className="font-medium text-charcoal mb-1">
                            {getCardName(item.selectedCardNumber)}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            25년 12월 운세
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>

                        {/* 화살표 */}
                        <div className="flex-shrink-0 self-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    아직 진행한 운세가 없습니다.
                  </div>
                )
              )}
            </div>
          )}

          {/* 페이지네이션 */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                이전
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        page === currentPage
                          ? 'bg-charcoal text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page}>...</span>;
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;