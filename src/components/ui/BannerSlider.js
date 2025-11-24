import React, { useState, useEffect } from 'react';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

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

  const slides = [
    originalSlides[originalSlides.length - 1],
    ...originalSlides,
    originalSlides[0]
  ];

  const showSlide = (index) => {
    setIsTransitioning(true);
    setCurrentSlide(index + 1);
  };

  const nextSlide = () => {
    if (!isTransitioning) return;
    setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (!isTransitioning) return;
    setCurrentSlide(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentSlide === slides.length - 1) {
      setIsTransitioning(false);
      setCurrentSlide(1);
      setTimeout(() => setIsTransitioning(true), 50);
    } else if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(originalSlides.length);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  };

  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setTranslateX(-currentSlide * 100);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;

    const diff = clientX - startX;
    const dragPercentage = (diff / window.innerWidth) * 100;
    setCurrentX(clientX);
    setTranslateX(-currentSlide * 100 + dragPercentage);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const diff = currentX - startX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else {
      setTranslateX(-currentSlide * 100);
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
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
    if (!isDragging) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isDragging]);

  return (
    <section className="relative w-full h-72 md:h-96 lg:h-[500px] overflow-hidden">
      <div
        className={`flex w-full h-full ${
          isTransitioning && !isDragging ? 'transition-transform duration-500 ease-in-out' : ''
        }`}
        style={{
          transform: `translateX(${translateX}%)`,
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={`slide-${index}`}
            className="flex-shrink-0 w-full h-full"
          >
            <a href={slide.link} className="block w-full h-full">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
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
              (currentSlide === index + 1 ||
               (currentSlide === 0 && index === originalSlides.length - 1) ||
               (currentSlide === slides.length - 1 && index === 0))
                ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;