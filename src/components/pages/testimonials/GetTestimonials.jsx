import React, { useEffect, useState } from "react";
import FormTestimonials from "./FormTestimonials";
import { FaTimes } from 'react-icons/fa';

const API_URL = "http://localhost/TICKETKAKSHA/Backend/testimonials/get_testimonials.php";
const IMAGE_BASE_URL = "http://localhost/TICKETKAKSHA/Backend/testimonials/";

const GetTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTestimonials(data.testimonials.filter(t => t.is_approved === 1 || t.is_approved === "1"));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  if (loading) {
    return (
      <div className="py-10 bg-[#f8fafc] text-center">
        <h1 className="text-4xl text-center font-bold mb-10 text-[#2E6FB7]" style={{ fontFamily: "Satisfy" }}>
          Testimonials
        </h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#f8fafc] overflow-hidden relative">
      <h3 className="text-4xl text-center font-bold mb-10 text-[#2E6FB7]" style={{ fontFamily: "Satisfy" }}>
        Testimonials
      </h3>

      {/* Desktop View */}
      <div className="relative w-full overflow-hidden hidden md:block">
        <div
          className="flex gap-6 animate-scroll"
          style={{
            width: `${duplicatedTestimonials.length * 318}px`,
            animation: "scroll 60s linear infinite",
          }}
        >
          {duplicatedTestimonials.map((item, index) => (
            <div
              key={index}
              className="min-w-[450px] max-w-md bg-white shadow-md border border-[#2F8DCC] rounded-xl p-6 flex flex-col justify-between"
            >
              <p className="text-gray-700 text-md mb-6 leading-relaxed">"{item.comment}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={item.image ? (item.image.startsWith("http") ? item.image : IMAGE_BASE_URL + item.image) : "https://via.placeholder.com/40"}
                  alt="Testimonial"
                  title="Testimonial Image"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-gray-500 text-sm">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden px-4">
        <div className="grid gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="w-full bg-white shadow-md border border-[#2F8DCC] rounded-xl p-6 flex flex-col justify-between"
            >
              <p className="text-gray-700 text-md mb-6 leading-relaxed">"{item.comment}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={item.image ? (item.image.startsWith("http") ? item.image : IMAGE_BASE_URL + item.image) : "https://via.placeholder.com/40"}
                  alt={item.name}
                  title="Testimonial Image"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-gray-500 text-sm">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Your Review Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2F8DCC] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
        >
          Leave Your Review
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 text-gray-600 hover:text-red-600 text-xl font-bold"
            >
             <FaTimes />
            </button>
            <FormTestimonials />
          </div>
        </div>
      )}

      {/* Scrolling animation keyframes */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${testimonials.length * 318}px);
          }
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default GetTestimonials;
