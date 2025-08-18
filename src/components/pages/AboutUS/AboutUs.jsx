import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";

const AboutUs = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [aboutText, setAboutText] = useState({ paragraph1: "", paragraph2: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  //const backendUrl = "http://localhost/TICKETKAKSHA/Backend/aboutus";
   const backendUrl = "https://ticketkaksha.com.np/Backend/aboutus";

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
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length === 0) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(nextSlide, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, nextSlide]);

  const getImageForPosition = useCallback(
    (position) => {
      if (images.length === 0) return "";
      const index = (activeIndex + position + images.length) % images.length;
      return `${backendUrl}/${images[index]}`;
    },
    [activeIndex, images, backendUrl]
  );

  const carouselConfig = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((pos) => {
      const translateX = isMobile ? pos * 42 : pos * 82;
      let scale = 1;
      let height = isMobile ? 190 : 300;
      let opacity = 1;

      if (Math.abs(pos) === 1) {
        scale = 0.85;
        height = isMobile ? 175 : 270;
        opacity = 1;
      } else if (Math.abs(pos) === 2) {
        scale = 0.7;
        height = isMobile ? 140 : 210;
        opacity = 1;
      }

      return {
        position: pos,
        translateX,
        scale,
        height,
        opacity,
        zIndex: pos === 0 ? 50 : 20 - Math.abs(pos),
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
        <div
          ref={containerRef}
          className="w-full md:w-1/2 relative h-[300px] flex items-center justify-center overflow-hidden"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "center center",
          }}
        >
          {carouselConfig.map(({ position, translateX, scale, height, opacity, zIndex }) => {
            const imgSrc = getImageForPosition(position);

            return (
              <div
                key={`img-${(activeIndex + position + images.length) % images.length}`}
                className="absolute overflow-hidden rounded-xl"
                style={{
                  zIndex,
                  transform: `translate3d(${translateX}px, 0, 0) scale3d(${scale}, ${scale}, 1)`,
                  width: isMobile ? "200px" : "250px",
                  height: `${height}px`,
                  opacity,
                  transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                  clipPath: "inset(0 round 16px)",
                }}
              >
                <img
                  src={imgSrc}
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: "16px",
                    transform: "scale(1.01)",
                    transition: "transform 0.8s",
                  }}
                  onError={(e) => {
                    e.target.style.opacity = "0";
                  }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            );
          })}
        </div>

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