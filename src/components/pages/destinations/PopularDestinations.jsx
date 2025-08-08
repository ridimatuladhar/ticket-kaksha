import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdTravelExplore } from 'react-icons/md';

//const API_URL = "http://localhost/TICKETKAKSHA/Backend/destination/get_destinations.php";
const API_URL = "https://ticketkaksha.com.np/Backend/destination/get_destinations.php";

const DestinationCard = ({ title, description, image, index }) => (
  <motion.div
    className="w-full sm:w-[300px] bg-white rounded-xl shadow-md p-4 m-3 cursor-pointer"
    initial="hidden"
    animate="visible"
    exit="exit"
    whileHover={{
      scale: 1.03,
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    custom={index}
    layout
  >
    <div className="overflow-hidden rounded-md mb-3">
      <motion.img
        src={image}
        alt={title}
        title={title}
        className="h-48 w-full object-cover rounded-md"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4 }}
      />
    </div>

    <h3 className="text-xl font-semibold mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>

    <div className="flex justify-center items-center mt-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-[#2F8DCC] text-white px-10 py-1 rounded-xl hover:bg-blue-600 transition"
        onClick={() => {
          const contactSection = document.getElementById("contactus");
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        Contact Us
      </motion.button>
    </div>
  </motion.div>
);

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        const activeDestinations = data.destinations.filter(
          (d) => d.is_active === '1' || d.is_active === 1
        );
        setDestinations(activeDestinations);
      }
    } catch (err) {
      console.error("Failed to load destinations", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc]">
    <div className="px-6 py-10 text-center max-w-screen-xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-[#2E6FB7] font-serif mb-2"
        style={{ fontFamily: 'Satisfy' }}
      >
        Popular Destinations
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-gray-600 max-w-xl mx-auto mb-8"
      >
        Explore our curated list of global destinations known for their beauty, history, and culture.
      </motion.p>

      {loading ? (
        <div className="text-gray-600">Loading destinations...</div>
    
) : destinations.length === 0 ? (
  <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-gray-600 bg-gray-50 rounded-lg shadow-sm p-6 w-full">
    <MdTravelExplore className="text-5xl mb-4 text-gray-400" />
    <h3 className="text-xl font-semibold mb-2">No Destinations Found</h3>
    <p className="text-sm">It looks like there are no active destinations at the moment. Please check back later!</p>
  </div>
      ) : (
        <motion.div layout className="flex flex-wrap justify-center items-stretch">
          <AnimatePresence>
            {destinations.map((dest, index) => (
              <DestinationCard
                key={dest.id}
                title={dest.title}
                description={dest.description}
               // image={`http://localhost/TICKETKAKSHA/Backend/destination/${dest.image_path}`}
                image={`https://ticketkaksha.com.np/Backend/destination/${dest.image_path}`}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
    </div>
  );
};

export default PopularDestinations;
