import React, { useEffect, useState, useCallback, useMemo } from "react";

const AboutUs = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [aboutText, setAboutText] = useState({ paragraph1: "", paragraph2: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTransitioning, setIsTransitioning] = useState(false);

  //const backendUrl = "http://localhost/TICKETKAKSHA/Backend/aboutus";
  const backendUrl = "https://khemrajbahadurraut.com.np/Backend/aboutus";

  useEffect(() => {
    fetch(`${backendUrl}/get_about_us.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.images || []);
          setAboutText({
            paragraph1: data?.text?.paragraph1 || "",
            paragraph2: data?.text?.paragraph2 || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching About Us:", err));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % images.length);
    // Reset transition flag after animation completes
    setTimeout(() => setIsTransitioning(false), 800);
  }, [images.length, isTransitioning]);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [images.length, nextSlide]);

  const getImageForPosition = useCallback((position) => {
    if (images.length === 0) return "";
    const index = (activeIndex + position + images.length) % images.length;
    return `${backendUrl}/${images[index]}`;
  }, [activeIndex, images, backendUrl]);

  // Memoize carousel configuration for better performance
  const carouselConfig = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((pos) => {
      const translateX = isMobile ? pos * 40 : pos * 80;
      let scale = 1;
      let height = isMobile ? 190 : 300;
      let opacity = 1;
      
      if (Math.abs(pos) === 1) {
        scale = 0.85;
        height = isMobile ? 175 : 270;
        opacity = 0.8;
      } else if (Math.abs(pos) === 2) {
        scale = 0.7;
        height = isMobile ? 140 : 210;
        opacity = 0.5;
      }

      return {
        position: pos,
        translateX,
        scale,
        height,
        opacity,
        zIndex: pos === 0 ? 50 : 20 - Math.abs(pos)
      };
    });
  }, [isMobile]);

  return (
    <div id="aboutus">
      <h3
        className="text-4xl text-[#2E6FB7] font-semibold text-center mt-10"
        style={{ fontFamily: "Satisfy" }}
      >
        About Us
      </h3>

      <div className="max-w-6xl mx-auto px-4 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left - Image Carousel */}
        <div className="w-full md:w-1/2 relative h-[300px] flex items-center justify-center overflow-hidden">
          {carouselConfig.map(({ position, translateX, scale, height, opacity, zIndex }) => {
            const imgSrc = getImageForPosition(position);
            
            return (
              <img
                key={`${activeIndex}-${position}`}
                src={imgSrc}
                alt={imgSrc}
                className={`absolute rounded-xl transition-all duration-[800ms] ease-out will-change-transform ${
                  position === 0 ? "shadow-2xl" : "shadow-md"
                }`}
                style={{
                  zIndex,
                  transform: `translateX(${translateX}px) scale(${scale}) translateZ(0)`,
                  width: isMobile ? "200px" : "250px",
                  height: `${height}px`,
                  objectFit: "cover",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);
                  e.target.style.display = "none";
                }}
                onLoad={(e) => {
                  // Ensure smooth rendering after load
                  e.target.style.willChange = "transform";
                }}
              />
            );
          })}
        </div>

        {/* Right - Text Content */}
        <div className="w-full md:w-1/2 pb-5">
          <div className="space-y-5 text-gray-600 text-justify text-sm md:text-base">
            <p>
              {aboutText.paragraph1 || (
                <span className="text-gray-400 italic">Loading content...</span>
              )}
            </p>
            <p>{aboutText.paragraph2}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;