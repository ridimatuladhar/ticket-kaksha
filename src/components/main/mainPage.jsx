import { useState, useEffect, useCallback } from 'react';
import WhatsAppBtn from '../whatsappbtn/WhatsAppBtn';

const TravelAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText1, setTypedText1] = useState('');
  const [typedText2, setTypedText2] = useState('');
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [typingCycle, setTypingCycle] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Desktop animation timers
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 2000);
    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (isAnimating) {
      const closeTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 5000);
      return () => clearTimeout(closeTimer);
    } else {
      const openTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 2500);
      return () => clearTimeout(openTimer);
    }
  }, [isAnimating]);

  // Smooth carousel auto-advance with transition state management
  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % imageConfigs.length);
      setIsTransitioning(false);
    }, 50); // Small delay to ensure smooth transition
  }, []);

  useEffect(() => {
    const carouselTimer = setInterval(nextSlide, 4000); // Slightly longer for smoother experience
    return () => clearInterval(carouselTimer);
  }, [nextSlide]);

  // Manual slide change with smooth transition
  const goToSlide = useCallback((index) => {
    if (index !== currentSlide && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 50);
    }
  }, [currentSlide, isTransitioning]);

  // Looping typing effect
  useEffect(() => {
    const text1 = 'Globally.';
    const text2 = 'Travel';
    let index1 = 0;
    let index2 = 0;

    const resetTyping = () => {
      setTypedText1('');
      setTypedText2('');
      setShowCursor1(true);
      setShowCursor2(false);
      setIsTypingComplete(false);
      index1 = 0;
      index2 = 0;
    };

    const typeFirstWord = () => {
      if (index1 <= text1.length) {
        setTypedText1(text1.slice(0, index1));
        index1++;
        const delay = index1 === text1.length ? 200 : Math.random() * 100 + 80;
        setTimeout(typeFirstWord, delay);
      } else {
        setTimeout(() => {
          setShowCursor1(false);
          setShowCursor2(true);
          typeSecondWord();
        }, 800);
      }
    };

    const typeSecondWord = () => {
      if (index2 <= text2.length) {
        setTypedText2(text2.slice(0, index2));
        index2++;
        const delay = index2 === text2.length ? 200 : Math.random() * 100 + 80;
        setTimeout(typeSecondWord, delay);
      } else {
        setTimeout(() => {
          setShowCursor2(false);
          setIsTypingComplete(true);
          setTimeout(() => {
            setTypingCycle(prev => prev + 1);
          }, 3000);
        }, 1200);
      }
    };

    const startTyping = setTimeout(() => {
      resetTyping();
      typeFirstWord();
    }, 1500);

    return () => clearTimeout(startTyping);
  }, [typingCycle]);

  const imageConfigs = [
    { 
      name: 'Swoyambhu', 
      src: '/src/assets/main/kaksh_bg12.png',
      width: '300px',
      height: '350px'
    },
    { 
      name: 'Dubai Frame', 
      src: '/src/assets/main/kaksh_bg8.png',
      width: '300px',
      height: '300px'
    },
    { 
      name: 'Bali Gate', 
      src: '/src/assets/main/kaksh_bg11.png',
      width: '300px',
      height: '360px'
    },
    { 
      name: 'Taj Mahal', 
            src: '/src/assets/main/kaksh_bg9.png',
      width: '300px',
      height: '230px'
    },
    { 
      name: 'Sydney Opera', 
      src: '/src/assets/main/kaksh_bg7.png',
      width: '300px',
      height: '230px'
    },
    { 
      name: 'Burj Al Arab', 
      src: '/src/assets/main/kaksh_bg13.png',
      width: '300px',
      height: '290px'
    },
    { 
      name: 'Romania Castle', 
      src: '/src/assets/main/kaksh_bg6.png',
      width: '300px',
      height: '230px'
    },
    { 
      name: 'Eiffel Tower', 
      src: '/src/assets/main/kaksh_bg15.png',
      width: '300px',
      height: '350px'
    }
  ];

  return (
    <div className="flex items-center justify-center" id='home' >
      <div className="relative w-full max-w-6xl bg-white overflow-hidden">
        
        {/* Mobile/Tablet Carousel (up to 1128px) */}
        <div className="mobile-carousel">
          <div className="relative w-full h-screen overflow-hidden">
            <div 
              className="flex h-full will-change-transform"
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: isTransitioning ? 'none' : 'transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {imageConfigs.map((config, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 relative">
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={config.src}
                      alt={config.name}
                      title={config.name}
                      className="w-full h-full object-cover transform transition-transform duration-[800ms] ease-out hover:scale-105"
                      onError={(e) => {
                        e.target.src = createFallbackSvg(config.name);
                      }}
                      loading={Math.abs(index - currentSlide) <= 1 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="absolute bottom-6 left-6 bg-black/40 text-white px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 transition-all duration-300">
                    <span className="font-medium text-lg">{config.name}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
              <div className={`
                backdrop-blur-[2px] rounded-2xl px-6 py-2 
                transition-all duration-1000 ease-out
                ${isTypingComplete ? 'scale-105 shadow-3xl' : 'scale-100'}
              `}>
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-wide">
                    <span className="text-white drop-shadow-2xl font-light" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)' }}>Book</span>{' '}
                    <span 
                      className="italic text-[#FF6B35] font-bold tracking-wider"
                      style={{ fontFamily: "Satisfy, cursive"}}
                    >
                      {typedText1}
                      {showCursor1 && (
                        <span className="text-[#FF6B35] animate-pulse ml-1 font-bold">|</span>
                      )}
                    </span>
                  </h1>
                  
                  <h2 className="text-3xl md:text-5xl font-bold tracking-wide">
                    <span 
                      className="italic text-[#FF6B35] font-bold tracking-wider"
                      style={{ fontFamily: "Satisfy, cursive", textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                    >
                      {typedText2}
                      {showCursor2 && (
                        <span className="text-[#FF6B35] animate-pulse ml-1 font-bold">|</span>
                      )}
                    </span>{' '}
                    <span className="text-white drop-shadow-2xl font-light"  >Freely.</span>
                  </h2>
                </div>
                
                {/* Enhanced animated underline */}
                <div className={`
                  mt-8 h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent rounded-full
                  transition-all duration-1000 ease-out
                  ${isTypingComplete ? 'w-full opacity-100 shadow-lg shadow-[#FF6B35]/50' : 'w-0 opacity-0'}
                `}></div>
              </div>
            </div>
            
            {/* Enhanced carousel indicators */}
            <div className="absolute bottom-6 right-6 flex space-x-3 z-20">
              {imageConfigs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125
                    ${currentSlide === index 
                      ? 'bg-white shadow-lg shadow-white/50 scale-110' 
                      : 'bg-white/60 hover:bg-white/80'
                    }
                    ${isTransitioning ? 'pointer-events-none' : 'cursor-pointer'}
                  `}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => goToSlide((currentSlide - 1 + imageConfigs.length) % imageConfigs.length)}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => goToSlide((currentSlide + 1) % imageConfigs.length)}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout (1128px and above) - unchanged for desktop experience */}
        <div className="desktop-layout">
          {/* Top Row */}
          <div className="flex w-full justify-center items-end gap-3 p-3">
            
            {imageConfigs.slice(0, 4).map((config, index) => (
              <div 
                key={index}
                className={`
                  relative overflow-hidden transition-all duration-[3500ms] ease-in-out
                  ${index === 0 ? 'rounded-tl-[50px]' : ''}
                  ${index === 1 ? 'top-[-50px] animate-clip-top' : ''}
                  ${index === 2 ? 'top-[10px] animate-clip-top' : ''}
                  ${index === 3 ? 'top-[-120px] rounded-tr-[50px]' : ''}
                  ${isAnimating && (index === 1 || index === 2) ? 'animate-clip-top' : ''}
                `}
                style={{
                  width: config.width,
                  height: config.height,
                  clipPath: (isAnimating && (index === 1 || index === 2)) ? 'inset(0 0 10% 0)' : 'inset(0 0 0 0)',
                  transition: 'clip-path 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <img
                  src={config.src}
                  alt={config.name}
                  title={config.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = createFallbackSvg(config.name);
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Bottom Row */}
          <div className="flex w-full justify-center items-start gap-3 p-3">
            
            {imageConfigs.slice(4).map((config, index) => (
              <div 
                key={index + 4}
                className={`
                  relative overflow-hidden transition-all duration-[3500ms] ease-in-out
                  ${index === 0 ? 'rounded-bl-[50px]' : ''}
                  ${index === 1 ? 'top-[-60px] animate-clip-bottom' : ''}
                  ${index === 2 ? 'animate-clip-bottom' : ''}
                  ${index === 3 ? 'top-[-120px] rounded-br-[50px]' : ''}
                  ${isAnimating && (index === 1 || index === 2) ? 'animate-clip-bottom' : ''}
                `}
                style={{
                  width: config.width,
                  height: config.height,
                  clipPath: (isAnimating && (index === 1 || index === 2)) ? 'inset(10% 0 0 0)' : 'inset(0 0 0 0)',
                  transition: 'clip-path 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <img
                  src={config.src}
                  alt={config.name}
                  title={config.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = createFallbackSvg(config.name);
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Desktop Text Overlays */}
          <div 
            className={`
              absolute top-[325px] left-[435px] transform -translate-x-1/2 -translate-y-1/2 
              text-center transition-all duration-[500ms] ease-in-out z-10 pointer-events-none
              ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
            style={{ 
              transitionDelay: isAnimating ? '1s' : '0s',
              transition: 'opacity 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <h2 className="text-5xl font-bold m-0">
              <span className="text-gray-800">Book</span>{' '}
              <span className="italic text-[#2E6FB7]" style={{ fontFamily: "Satisfy, cursive" }}>Globally.</span>      
            </h2>
          </div>
          
          <div 
            className={`
              absolute top-1/2 left-[720px] transform -translate-x-1/2 -translate-y-1/2 
              text-center transition-all duration-[1500ms] ease-in-out z-10 pointer-events-none
              ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
            style={{ 
              transitionDelay: isAnimating ? '1.8s' : '0s',
              transition: 'opacity 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <h2 className="text-5xl font-bold m-0">        
               <span className="italic text-[#2E6FB7]" style={{ fontFamily: "Satisfy, cursive" }}>Travel</span>{' '}
              <span className="text-gray-800">Freely.</span>
            </h2>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animate-clip-top {
          transform-origin: top center;
        }
        
        .animate-clip-bottom {
          transform-origin: bottom center;
        }
        
        .mobile-carousel {
          display: block;
        }
        
        .desktop-layout {
          display: none;
        }
        
        @media (min-width: 1128px) {
          .mobile-carousel {
            display: none;
          }
          
          .desktop-layout {
            display: block;
          }
        }

        .will-change-transform {
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

        <WhatsAppBtn/>
    </div>
  );
};

export default TravelAnimation;