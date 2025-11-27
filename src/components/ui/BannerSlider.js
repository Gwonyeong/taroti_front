import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getBanners } from '../../lib/api';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(-100);
  const [originalSlides, setOriginalSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  // 디바이스 감지 함수
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  // DB에서 배너 데이터 가져오기
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const banners = await getBanners(true); // 활성화된 배너만 가져오기

      if (banners && banners.length > 0) {
        const formattedBanners = banners.map(banner => ({
          id: banner.id,
          image: isMobile() ? (banner.mobile_image_url || banner.pc_image_url) : banner.pc_image_url,
          link: banner.link_url || '#',
          alt: banner.title || banner.description || 'TaroTI 배너'
        }));
        setOriginalSlides(formattedBanners);
      } else {
        // 기본 배너 데이터 (fallback)
        setOriginalSlides([
          {
            id: 1,
            image: '/images/promotions/1.jpg',
            link: '#event1',
            alt: 'TaroTI 이벤트 1'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      // 에러 시 기본 배너 사용
      setOriginalSlides([
        {
          id: 1,
          image: '/images/promotions/1.jpg',
          link: '#event1',
          alt: 'TaroTI 이벤트 1'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 현재 모바일 상태를 추적하기 위한 ref
  const isMobileRef = useRef(isMobile());

  // 컴포넌트 마운트 시 배너 데이터 가져오기
  useEffect(() => {
    fetchBanners();

    // Debounce function to prevent excessive API calls
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentIsMobileState = isMobile();

        // 모바일/데스크탑 상태가 실제로 변경되었을 때만 API 호출
        if (currentIsMobileState !== isMobileRef.current) {
          isMobileRef.current = currentIsMobileState;
          fetchBanners();
        }
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // 무한 루프를 위한 복제 슬라이드
  const slides = originalSlides.length > 0 ? [
    originalSlides[originalSlides.length - 1], // 마지막 슬라이드 복제
    ...originalSlides,
    originalSlides[0] // 첫 번째 슬라이드 복제
  ] : [];

  const showSlide = (index) => {
    setIsTransitioning(true);
    setCurrentSlide(index + 1); // 복제된 슬라이드를 고려하여 +1
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => prev - 1);
  }, []);

  // 트랜지션 종료 후 무한 루프 처리
  const handleTransitionEnd = useCallback(() => {
    if (currentSlide >= slides.length - 1) {
      // 마지막 복제 슬라이드에서 실제 첫 번째로 이동
      setIsTransitioning(false);
      setCurrentSlide(1);
      setTranslateX(-100);
    } else if (currentSlide <= 0) {
      // 첫 번째 복제 슬라이드에서 실제 마지막으로 이동
      setIsTransitioning(false);
      setCurrentSlide(originalSlides.length);
      setTranslateX(-originalSlides.length * 100);
    }
  }, [currentSlide, slides.length, originalSlides.length]);

  // 트랜지션 재활성화
  useEffect(() => {
    if (!isTransitioning) {
      const timeoutId = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isTransitioning]);

  const handleStart = useCallback((clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  }, []);

  const handleMove = useCallback((clientX) => {
    if (!isDragging) return;

    const diff = clientX - startX;
    const dragPercentage = (diff / window.innerWidth) * 100;
    const newTranslateX = -currentSlide * 100 + dragPercentage;

    setCurrentX(clientX);
    setTranslateX(newTranslateX);
  }, [isDragging, startX, currentSlide]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    const diff = currentX - startX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  }, [isDragging, currentX, startX, prevSlide, nextSlide]);


  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, currentX]);

  useEffect(() => {
    if (!isDragging) {
      setTranslateX(-currentSlide * 100);
    }
  }, [currentSlide, isDragging]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleTouchMoveNative = (e) => {
      if (isDragging) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };

    const handleTouchStartNative = (e) => {
      handleStart(e.touches[0].clientX);
    };

    const handleTouchEndNative = () => {
      handleEnd();
    };

    slider.addEventListener('touchstart', handleTouchStartNative, { passive: true });
    slider.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
    slider.addEventListener('touchend', handleTouchEndNative, { passive: true });

    return () => {
      slider.removeEventListener('touchstart', handleTouchStartNative);
      slider.removeEventListener('touchmove', handleTouchMoveNative);
      slider.removeEventListener('touchend', handleTouchEndNative);
    };
  }, [isDragging, handleStart, handleMove, handleEnd]);

  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isDragging, nextSlide]);

  // 로딩 중이거나 배너가 없는 경우
  if (loading) {
    return (
      <section className="relative w-full h-72 md:h-96 lg:h-[500px] overflow-hidden touch-pan-y bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">배너를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  if (originalSlides.length === 0) {
    return (
      <section className="relative w-full h-72 md:h-96 lg:h-[500px] overflow-hidden touch-pan-y bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">표시할 배너가 없습니다</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-72 md:h-96 lg:h-[500px] overflow-hidden touch-pan-y">
      <div
        ref={sliderRef}
        className={`flex w-full h-full ${
          isTransitioning && !isDragging ? 'transition-transform duration-500 ease-in-out' : ''
        }`}
        style={{
          transform: `translateX(${translateX}%)`,
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="flex-shrink-0 w-full h-full"
          >
            <a href={slide.link} className="block w-full h-full">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                draggable="false"
              />
            </a>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {originalSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => showSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              currentSlide === index + 1 ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;