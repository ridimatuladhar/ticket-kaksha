import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaViber,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative">
      {/* Background Image Section */}
      <div
        className="pt-70 sm:pt-48 pb-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/footer/footerimage.webp')",
        }}
      >
        <div className="container mx-auto px-4">
          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
            {/* Contact Us */}
            <div className="flex flex-col items-center">
              <a href="tel:+9779851155689" title="Call us at">
                <div className="bg-[#2F8DCC] p-4 rounded-full mb-4 hover:scale-105 transition-transform text-white">
                  <FaPhoneAlt size={24} />
                </div>
              </a>
              <a
                href="tel:+9779851155689"
                className="font-semibold text-lg hover:underline"
              >
                +977 9851155689
              </a>
              <p className="text-sm opacity-90">Contact us</p>
            </div>

            {/* Visit Us */}
            <div className="flex flex-col items-center">
              <a
  href="https://www.google.com/maps/search/?api=1&query=Ticket+Kaksha+Travel+and+Tours+Pvt+Ltd"
  target="_blank"
  rel="noopener noreferrer"
  title="Visit us on Google Maps"
>
  <div className="bg-[#2F8DCC] p-4 rounded-full mb-4 hover:scale-105 transition-transform text-white">
    <FaMapMarkerAlt size={24} />
  </div>
</a>


              <h3 className="font-semibold text-lg text-center">
                  <a
  href="https://www.google.com/maps/search/?api=1&query=Ticket+Kaksha+Travel+and+Tours+Pvt+Ltd"
  target="_blank"
  rel="noopener noreferrer"
  title="Visit us on Google Maps"
>
                Boudhanath Sadak, Kathmandu, Nepal
                </a>
              </h3>
              <p className="text-sm opacity-90 mb-4">Visit us</p>

              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/ticketkaksha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 hover:text-blue-700 transition-all"
                  aria-label="Facebook"
                  title="Follow us on Facebook"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/ticketkaksha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 hover:text-pink-300 transition-all"
                  aria-label="Instagram"
                  title="Follow us on Instagram"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="viber://chat?number=+9779851155689"
                  className="opacity-80 hover:opacity-100 hover:text-purple-300 transition-all"
                  aria-label="Viber"
                  title="Chat with us on Viber"
                >
                  <FaViber size={20} />
                </a>
              </div>
            </div>

            {/* Email Us */}
            <div className="flex flex-col items-center">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=mgmt@ticketkaksha.com.np"
                target="_blank"
                rel="noopener noreferrer"
                title="Email us at"
              >
                <div className="bg-[#2F8DCC] p-4 rounded-full mb-4 hover:scale-105 transition-transform text-white">
                  <FaEnvelope size={24} />
                </div>
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=mgmt@ticketkaksha.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg hover:underline"
                title="Email us at"
              >
                mgmt@ticketkaksha.com.np
              </a>
              <p className="text-sm opacity-90">Email us</p>
            </div>
          </div>

          {/* Copyright Section */}
          <div className=" pt-2 mt-2 border-t text-white border-white border-opacity-20 text-center">
            <h4 className="text-md!">Powered By</h4>
            <a
              href="https://gr8nepal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              aria-label="GR8 Nepal"
              title="Visit GR8 Nepal"
            >
              <img
                src="/src/assets/footerlogo/GR8-Nepal-Private-Limited-Logo.webp"
                alt="GR8 Nepal Logo"
                className="h-10 w-10 object-contain mx-auto opacity-80 hover:opacity-100 transition-opacity"
                title="Visit GR8 Nepal"
              />
            </a>
            <p className=" mt-2">
              © {new Date().getFullYear()}{" "}
              <span className="font-sans">टिकट</span>{" "}
              <span className="font-sans">कक्ष</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
