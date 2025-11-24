import React, { useState, useEffect, useRef, useCallback } from 'react';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(-100);
  const sliderRef = useRef(null);

  const originalSlides = [
    {
      id: 1,
      image: '/images/promotions/1.jpg',
      link: '#event1',
      alt: 'TaroTI 이벤트 1'
    },
    {
      id: 2,
      image: '/images/promotions/2.jpg',
      link: '#event2',
      alt: 'TaroTI 이벤트 2'
    },
    {
      id: 3,
      image: '/images/promotions/3.jpg',
      link: '#event3',
      alt: 'TaroTI 이벤트 3'
    },
    {
      id: 4,
      image: '/images/promotions/4.jpg',
      link: '#event4',
      alt: 'TaroTI 이벤트 4'
    },
    {
      id: 5,
      image: '/images/promotions/5.jpg',
      link: '#event5',
      alt: 'TaroTI 이벤트 5'
    }
  ];

  // 무한 루프를 위한 복제 슬라이드
  const slides = [
    originalSlides[originalSlides.length - 1], // 마지막 슬라이드 복제
    ...originalSlides,
    originalSlides[0] // 첫 번째 슬라이드 복제
  ];

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
                className="w-full h-full object-cover"
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