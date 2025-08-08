import React, { useState, useEffect } from 'react';
import {
  FaTachometerAlt,
  FaUsers,
  FaLocationArrow,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { PiChatCircleTextLight } from "react-icons/pi";
import Contacts from './contacts/Contacts';
import Testimonials from './Testimonials/Testimonials';
import ActivityTimeline from './ActivityTimeline';
import Destination from './destinations/Destination';
import { BsTextParagraph } from "react-icons/bs";
import AdminAboutUs from './AboutUs/AdminAboutUs';
import CsrPanel from './CSR/CsrPanel';
import { TbSettingsSearch } from "react-icons/tb";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost/TICKETKAKSHA/Backend/admin/admin_logout.php', {
      //const res = await fetch('https://khemrajbahadurraut.com.np/Backend/admin/admin_logout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === 'success') {
        localStorage.removeItem('isAdminLoggedIn');
        window.location.href = '/';
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (err) {
      console.error('Logout Error:', err);
      alert('Logout error occurred.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-[#2E6FB7] text-white transition-all duration-300 fixed md:relative z-30 h-full ${isSidebarOpen ? 'w-52' : 'w-12'} flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-[#245da3]">
          {isSidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}

          <button 
            onClick={toggleSidebar} 
            className="text-white hover:bg-[#3a7dc4] rounded"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="mt-6 flex-1">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`flex items-center w-full p-4 transition-colors duration-200 ${activeTab === 'dashboard' ? 'bg-[#245da3]' : 'hover:bg-[#3a7dc4]'}`}
          >
            <FaTachometerAlt className="text-lg" />
            {isSidebarOpen && <span className="ml-4">Dashboard</span>}
          </button>

          <button
            onClick={() => handleTabClick('about')}
            className={`flex items-center w-full p-4 transition-colors duration-200 ${activeTab === 'about' ? 'bg-[#245da3]' : 'hover:bg-[#3a7dc4]'}`}
          >
           <BsTextParagraph className="text-lg"/>
            {isSidebarOpen && <span className="ml-4">About us</span>}
          </button>

          <button
            onClick={() => handleTabClick('csr')}
            className={`flex items-center w-full p-4 transition-colors duration-200 ${activeTab === 'csr' ? 'bg-[#245da3]' : 'hover:bg-[#3a7dc4]'}`}
          >
           <TbSettingsSearch className="text-lg"/>
            {isSidebarOpen && <span className="ml-4">CSR</span>}
          </button>

          <button
            onClick={() => handleTabClick('contacts')}
            className={`flex items-center w-full p-4 transition-colors duration-200 ${activeTab === 'contacts' ? 'bg-[#245da3]' : 'hover:bg-[#3a7dc4]'}`}
          >
            <FaUsers className="text-lg" />
            {isSidebarOpen && <span className="ml-4">Contact Response</span>}
          </button>

          <button
            onClick={() => handleTabClick('testimonials')}
            className={`flex items-center w-full p-4 transition-colors duration-200 ${activeTab === 'testimonials' ? 'bg-[#245da3]' : 'hover:bg-[#3a7dc4]'}`}
          >
            <PiChatCircleTextLight className="text-xl" />
            {isSidebarOpen && <span className="ml-4">Testimonials</span>}
          </button>

          {/* Destinations without dropdown */}
          <button
            onClick={() => handleTabClick('destinations.list')}
            className={`flex items-center w-full p-4 transition-colors duration-200 ${activeTab === 'destinations.list' ? 'bg-[#245da3]' : 'hover:bg-[#3a7dc4]'}`}
          >
            <FaLocationArrow className="text-lg" />
            {isSidebarOpen && <span className="ml-4">All Destinations</span>}
          </button>

          
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#245da3] hidden md:block">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to log out?')) {
              handleLogout();
            }
          }}
          className="flex items-center px-4 py-2 rounded text-white hover:bg-[#3a7dc4] w-full transition-colors duration-200"
        >
          <FaSignOutAlt />
          {isSidebarOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-12'}`}>
        <div className="md:hidden flex justify-end p-4">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to log out?')) {
              handleLogout();
            }
          }}
          className="flex items-center px-4 py-2 rounded text-white bg-[#2E6FB7] hover:bg-[#3a7dc4] transition-colors duration-200"
        >
          <FaSignOutAlt />
          <span className="ml-2">Logout</span>
        </button>
      </div>
        <div className="p-4 md:p-8">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-2xl text-[#2E6FB7] font-bold mb-6">Welcome, Admin</h1>
                <ActivityTimeline />
              </div>
            )}
            {activeTab === 'about' && <AdminAboutUs />}
            {activeTab === 'csr' && <CsrPanel />}
            {activeTab === 'contacts' && <Contacts />}
            {activeTab === 'destinations.list' && <Destination />}
            {activeTab === 'testimonials' && <Testimonials />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
