import React, { useEffect, useState } from "react";
import { MdTravelExplore } from "react-icons/md";
import { createPortal } from "react-dom";

//const IMAGE_BASE_URL = "http://localhost/TICKETKAKSHA/Backend/CSR/";
const IMAGE_BASE_URL = "https://ticketkaksha.com.np/Backend/CSR/";

const Modal = ({ title, description, image, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold z-10"
        >
          &times;
        </button>
        {image ? (
          <img
            src={IMAGE_BASE_URL + image}
            alt={title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#2E6FB7] mb-4">{title}</h2>
          <p className="text-gray-700 whitespace-pre-line">{description}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

const CsrCards = () => {
  const [csrData, setCsrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSectionEnabled, setIsSectionEnabled] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchSectionStatusAndData = async () => {
      try {
        setLoading(true);
        setError("");

        // Add cache busting timestamp
        const timestamp = new Date().getTime();
       //const sectionRes = await fetch(`http://localhost/TICKETKAKSHA/Backend/CSR/manage_csr_section.php?t=${timestamp}`);
        const sectionRes = await fetch(`https://ticketkaksha.com.np/Backend/CSR/manage_csr_section.php?t=${timestamp}`);
        const sectionData = await sectionRes.json();


        // FIX: Changed from is_enable to is_enabled (with 'd')
        if (sectionData.success && (sectionData.is_enabled === "1" || sectionData.is_enabled === 1 || sectionData.is_enabled === true)) {
          setIsSectionEnabled(true);

        //  const csrRes = await fetch(`http://localhost/TICKETKAKSHA/Backend/CSR/get_csr.php?t=${timestamp}`);
          const csrRes = await fetch(`https://ticketkaksha.com.np/Backend/CSR/get_csr.php?t=${timestamp}`);
          const csrJson = await csrRes.json();


          if (csrJson.success && csrJson.data) {
            const visibleCsrs = csrJson.data.filter(
              item => item.is_visible === "1" || item.is_visible === 1
            );
            setCsrData(visibleCsrs);
          } else {
            setError("Failed to load CSR data.");
          }
        } else {
          setIsSectionEnabled(false);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError("Error fetching CSR section data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSectionStatusAndData();
  }, []);

  // Enhanced loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <p className="text-blue-600 text-xl">Loading CSR initiatives...</p>
      </div>
    );
  }

  // Don't render anything if section is disabled
  if (!isSectionEnabled) {
    return null;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 flex justify-center" id="csr">
      <div className="">
        <div className="text-center justify-center items-center flex">
          <h2
            className="text-4xl text-[#2E6FB7]"
            style={{ fontFamily: "Satisfy, cursive" }}
          >
            Our
          </h2>
          &nbsp;&nbsp;
          <span className="text-3xl text-[#2E6FB7] italic" style={{ fontFamily: "outfit, cursive" }}>
            CSR
          </span>
          &nbsp;&nbsp;&nbsp;
          <h2
            className="text-4xl text-[#2E6FB7]"
            style={{ fontFamily: "Satisfy, cursive" }}
          >
            Initiatives
          </h2>
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex flex-wrap gap-8 justify-center max-w-8xl w-full">
            {csrData.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-gray-600 bg-gray-50 rounded-lg shadow-sm p-6 w-full">
                <MdTravelExplore className="text-5xl mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No CSR Found</h3>
                <p className="text-sm">
                  It looks like there are no active CSR initiatives at the moment. Please check back later!
                </p>
              </div>
            ) : (
              csrData.map((item, index) => (
                <div
                  key={item.id || index} // Use item.id if available, fallback to index
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 max-w-xs w-full cursor-pointer transform hover:scale-105"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.image ? (
                    <img
                      src={IMAGE_BASE_URL + item.image}
                      alt={item.title}
                      title={item.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {/* Fallback div for broken/missing images */}
                  <div 
                    className="w-full h-48 bg-gray-200 rounded-lg mb-4 items-center justify-center text-gray-400" 
                    style={{ display: item.image ? 'none' : 'flex' }}
                  >
                    No Image
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {item.description && item.description.length > 100
                      ? item.description.slice(0, 100) + "..."
                      : item.description || "No description available"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <Modal
          title={selectedItem.title}
          description={selectedItem.description}
          image={selectedItem.image}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
};

export default CsrCards;