import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [csrEnabled, setCsrEnabled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", optimizedScroll, { passive: true });
    return () => window.removeEventListener("scroll", optimizedScroll);
  }, []);

  // Fetch CSR section visibility
  useEffect(() => {
    const fetchCsrVisibility = async () => {
      try {
        // const res = await fetch("http://localhost/TICKETKAKSHA/Backend/CSR/manage_csr_section.php");
        const res = await fetch(
          "https://ticketkaksha.com.np/Backend/CSR/manage_csr_section.php"
        );
        const data = await res.json();
        if (
          data.success &&
          (data.is_enabled === "1" || data.is_enabled === 1)
        ) {
          setCsrEnabled(true);
        }
      } catch (err) {
        console.error("Failed to fetch CSR visibility", err);
      }
    };

    fetchCsrVisibility();
  }, []);

  // Base nav items
  const navItems = [
    { name: "Home", id: "home" },
    { name: "About us", id: "aboutus" },
    { name: "Services", id: "services" },
    // Conditionally include CSR
    ...(csrEnabled ? [{ name: "CSR", id: "csr" }] : []),
    { name: "Contact us", id: "contactus" },
  ];

  return (
    <div className="bg-[#DCE9F5] sticky top-0 z-[100] shadow-sm pb-8 md:pb-0 transition-shadow duration-300 ">
      <div className="relative py-5 container mx-auto px-4 pl-5 ">
        {/* Logo  */}
        <div
          onClick={() => {
            const el = document.getElementById("home");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
          className={`cursor-pointer flex items-center gap-2 transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]
    ${
      isScrolled
        ? "fixed top-2 -translate-x-1/2 w-14 h-14 md:w-20 md:h-14"
        : "absolute top-6 left-4 w-25 h-20 md:w-28 md:h-24"
    } 
    rounded-b-4xl bg-[#DCE9F5] z-50 px-2`}
        >
          <img
            src="/src/assets/navlogo/ticketkakshalogo.png"
            alt="logo"
            className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
            title="Ticket Kaksha Logo"
          />
        </div>
        {/* Inline Text on scroll */}
        <span
          className={` absolute  left-15 top-7 md:top-5 transition-transform duration-900 ease-in-out origin-left whitespace-nowrap
      text-[#3258a7] font-semibold text-sm md:text-base
      ${
        isScrolled
          ? "opacity-100 scale-100 translate-x-0"
          : "opacity-0 scale-95  pointer-events-none"
      }`}
        >
          <span style={{ fontFamily: "gotu" }}>टिकट</span>{" "}
          <span style={{ fontFamily: "gotu" }}>कक्ष</span>
        </span>

        {/* Hamburger Menu */}
        <div className="md:hidden  absolute top-6 right-4 z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-3xl text-[#3159A8]"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div
          className={`hidden md:flex justify-center md:justify-end transition-all duration-300 ${
            isScrolled ? "pt-0" : "pt-24 md:pt-0"
          }`}
        >
          <ul className="flex flex-col md:flex-row text-[#3159A8]">
            <li className="flex flex-col md:flex-row gap-4 md:gap-14 text-lg">
              {navItems.map(({ name, id }) => (
                <button
                  key={id}
                  onClick={() => {
                    const el = document.getElementById(id);
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                    setMenuOpen(false);
                  }}
                  className="flex items-center text-[15px] py-2 md:py-0 transition-all duration-300 hover:text-[#1e3a8a] hover:scale-95"
                  style={{ fontFamily: "opensans" }}
                >
                  {name}
                </button>
              ))}
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden fixed top-0 left-0 w-full py-6 bg-[#DCE9F5] flex flex-col justify-center items-center z-40 space-y-10 text-[#3159A8] text-xl font-medium">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="hover:text-[#1e3a8a] hover:scale-105 transition-all text-[#2E6FB7]"
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "opensans" }}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
