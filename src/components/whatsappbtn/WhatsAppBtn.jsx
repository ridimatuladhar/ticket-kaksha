import  { useEffect, useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaArrowUp } from "react-icons/fa"; // You can use any icon you prefer



const WhatsAppBtn = () => {
  const [showScroll, setShowScroll] = useState(false);

  // Show the button after scrolling down 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center space-y-3 z-[1000]">
      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="bg-[#2E6FB7] text-white p-3 rounded-full shadow-lg hover:bg-[#2E6FB4] transition-all duration-300 hover:scale-110"
        >
          <FaArrowUp size={20} />
        </button>
      )}

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/9779851155689"
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-[#2E6FB7] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none"
          title="Contact us on WhatsApp"
      >
        <IoLogoWhatsapp
          size={28}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
      </a>
    </div>
  );
}

export default WhatsAppBtn;
