import React from "react";

// Airline data with actual logos
const airlines = [
  { name: "Emirates", src: "/src/assets/airlines/emirates.webp" },
  { name: "China Southern", src: "/src/assets/airlines/china.webp" },
  { name: "Singapore Airlines", src: "/src/assets/airlines/singapore.webp" },
  { name: "Qatar Airways", src: "/src/assets/airlines/qatar.webp" },
  { name: "Turkish Airlines", src: "/src/assets/airlines/turkish.webp" },
  { name: "Korean Air", src: "/src/assets/airlines/korean.webp" }
];

const InfiniteMarquee = ({ children, speed = 60 }) => {
  return (
    <div className="overflow-hidden">
      <div 
        className="flex animate-marquee"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          width: 'calc(200% + 240px)', 
        }}
      >
        <div className="flex items-center flex-shrink-0">
          {children}
        </div>
        {/* Duplicate content for seamless loop */}
        <div className="flex items-center flex-shrink-0">
          {children}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 120px)); }
        }
        .animate-marquee {
          animation: marquee ${speed}s linear infinite;
        }
      `}</style>
    </div>
  );
};

const Banners = () => {
  return (
    <div className="bg-white py-1">
      <h2 
        className="text-4xl text-[#2E6FB7] mb-10 text-center"
        style={{ fontFamily: 'Satisfy, cursive' }}
      >
        Airlines
      </h2>

      {/* Full-width gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
        <div className="container mx-auto px-4">
          <InfiniteMarquee speed={25}>
            {airlines.map((airline, idx) => (
              <img
                key={idx}
                src={airline.src}
                alt={airline.name}
                title={airline.name}
                style={{ width: 120, marginRight: 120 }}
                className="object-contain"
              />
            ))}
          </InfiniteMarquee>
        </div>
      </div>
    </div>
  );
};

export default Banners;