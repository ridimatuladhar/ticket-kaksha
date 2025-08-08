import React, { useEffect, useState } from 'react';
import { FaSpinner, FaExclamationCircle, FaTrash, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import Addcsr from './Addcsr';
import Editcsr from './Editcsr';

const API_URL = 'http://localhost/TICKETKAKSHA/Backend/CSR/get_csr.php';
const UPDATE_URL = 'http://localhost/TICKETKAKSHA/Backend/CSR/update_csr.php';
const ADD_URL = 'http://localhost/TICKETKAKSHA/Backend/CSR/add_csr.php';
const DELETE_URL = 'http://localhost/TICKETKAKSHA/Backend/CSR/delete_csr.php';
const IMAGE_BASE_URL = 'http://localhost/TICKETKAKSHA/Backend/CSR/';
const SECTION_STATUS_URL = 'http://localhost/TICKETKAKSHA/Backend/CSR/manage_csr_section.php';
const TOGGLE_SECTION_URL = 'http://localhost/TICKETKAKSHA/Backend/CSR/toggle_csr_section.php';

// const API_URL = 'https://khemrajbahadurraut.com.np/Backend/CSR/get_csr.php';
// const UPDATE_URL = 'https://khemrajbahadurraut.com.np/Backend/CSR/update_csr.php';
// const ADD_URL = 'https://khemrajbahadurraut.com.np/Backend/CSR/add_csr.php';
// const DELETE_URL = 'https://khemrajbahadurraut.com.np/Backend/CSR/delete_csr.php';
// const IMAGE_BASE_URL = 'https://khemrajbahadurraut.com.np/Backend/CSR/';
// const SECTION_STATUS_URL = 'https://khemrajbahadurraut.com.np/Backend/CSR/manage_csr_section.php';
// const TOGGLE_SECTION_URL = 'https://khemrajbahadurraut.com.np/Backend/CSR/toggle_csr_section.php';

const CsrPanel = () => {
  const [csrs, setCsrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [csrSectionVisible, setCsrSectionVisible] = useState(null);
  const [csrToggleLoading, setCsrToggleLoading] = useState(false);
  const [sectionStatusLoading, setSectionStatusLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      await fetchSectionStatus();
      await fetchCsrs();
    } catch (err) {
      console.error('Error initializing data:', err);
      setError('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionStatus = async () => {
    setSectionStatusLoading(true);
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`${SECTION_STATUS_URL}?t=${timestamp}`, {
        method: 'GET',
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Section status response:', result);
      
      if (result.success) {
        // FIX 1: More robust boolean conversion
        const isEnabled = result.is_enabled === 1 || 
                         result.is_enabled === '1' || 
                         result.is_enabled === true;
        setCsrSectionVisible(isEnabled);
        console.log('CSR Section visibility set to:', isEnabled);
        console.log('Raw is_enabled value:', result.is_enabled, 'Type:', typeof result.is_enabled);
      } else {
        console.error('Failed to fetch section status:', result.message);
        setCsrSectionVisible(true); // Default fallback
      }
    } catch (err) {
      console.error('Error fetching section status:', err);
      setCsrSectionVisible(true); // Default fallback
    } finally {
      setSectionStatusLoading(false);
    }
  };

  const fetchCsrs = async () => {
    setError('');
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`${API_URL}?t=${timestamp}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setCsrs(data.data);
      } else {
        setError('Failed to fetch CSR records.');
      }
    } catch (err) {
      console.error('Fetch CSRs error:', err);
      setError('Error fetching CSR data.');
    }
  };

  // const handleVisibilityChange = async (id, newValue) => {
  //   try {
  //     const res = await fetch(UPDATE_URL, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ id, is_visible: newValue }),
  //     });
  //     const result = await res.json();
  //     if (result.success) {
  //       setCsrs(prev => prev.map(csr => (csr.id === id ? { ...csr, is_visible: newValue } : csr)));
  //     } else {
  //       alert('Failed to update visibility.');
  //     }
  //   } catch (err) {
  //     console.error('Visibility update error:', err);
  //     alert('Error updating visibility');
  //   }
  // };

  const toggleSectionVisibility = async () => {
    const newVisibility = !csrSectionVisible;
    const confirmMessage = newVisibility 
      ? 'Are you sure you want to make the CSR section visible to all users?'
      : 'Are you sure you want to hide the CSR section from all users?';
    
    if (!window.confirm(confirmMessage)) return;

    setCsrToggleLoading(true);
    try {
      const res = await fetch(TOGGLE_SECTION_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        // FIX 2: Send as integer (1 or 0) to match database expectation
        body: JSON.stringify({ is_enabled: newVisibility ? 1 : 0 }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Toggle response:', result);
      
      if (result.success) {
        setCsrSectionVisible(newVisibility);
        alert(`CSR section is now ${newVisibility ? 'visible' : 'hidden'}`);
        // FIX 3: Immediate refresh to confirm state
        setTimeout(() => fetchSectionStatus(), 300);
      } else {
        alert(result.message || 'Failed to toggle visibility');
        console.error('Toggle failed:', result);
      }
    } catch (err) {
      console.error('Toggle error:', err);
      alert('Error toggling visibility. Please try again.');
    } finally {
      setCsrToggleLoading(false);
    }
  };

  const handleAddCsr = async formData => {
    try {
      const res = await fetch(ADD_URL, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setShowModal(false);
        fetchCsrs();
      } else {
        alert('Failed to add CSR.');
      }
    } catch (error) {
      console.error('Add error:', error);
      alert('Error adding CSR');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this CSR?')) return;

    try {
      const res = await fetch(DELETE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (result.success) {
        setCsrs(prev => prev.filter(csr => csr.id !== id));
      } else {
        alert(result.message || 'Failed to delete CSR.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting CSR. Please try again.');
    }
  };

  if (loading || sectionStatusLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="ml-2 text-lg">Loading CSR data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* FIX 4: Enhanced debugging info */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">CSR Section Visibility</h2>
            <p className="text-sm text-gray-600">
              {csrSectionVisible === null ? (
                'Loading status...'
              ) : csrSectionVisible ? (
                'Currently visible to all users (Enabled)'
              ) : (
                'Currently hidden from all users (Disabled)'
              )}
            </p>
           
          </div>
          <button
  onClick={toggleSectionVisibility}
  disabled={csrToggleLoading || csrSectionVisible === null}
  type="button" 
  className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors
    ${csrSectionVisible ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
    ${(csrToggleLoading || csrSectionVisible === null) ? 'opacity-75 cursor-not-allowed' : ''}`}
>

            {csrToggleLoading ? (
              <FaSpinner className="animate-spin" />
            ) : csrSectionVisible ? (
              <>
                <FaEyeSlash /> Hide Section
              </>
            ) : (
              <>
                <FaEye /> Show Section
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2E6FB7]">Corporate Social Responsibility</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#245da3] hover:bg-[#3a7dc4] text-white px-4 py-2 rounded"
        >
          Add CSR
        </button>
      </div>

      {error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <div className="flex items-center">
            <FaExclamationCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : csrs.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">No CSR records found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visible</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csrs.map(csr => (
                  <tr key={csr.id}>
                    <td className="px-3 py-4 text-sm text-gray-900">{csr.title}</td>
                    <td className="px-3 py-4">
                      {csr.image ? (
                        <img 
                          src={IMAGE_BASE_URL + csr.image} 
                          alt={csr.title} 
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'inline';
                          }}
                        />
                      ) : null}
                      {!csr.image && (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700 max-w-xs truncate">{csr.description}</td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded px-2 py-1 text-sm font-medium ${
                          csr.is_visible === '1' || csr.is_visible === 1
                            ? 'text-green-600 bg-green-50'
                            : 'text-red-600 bg-red-50'
                        }`}
                      >
                        {csr.is_visible === '1' || csr.is_visible === 1 ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditData(csr)}
                        className="text-blue-600 hover:text-black p-1 rounded hover:bg-gray-200"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(csr.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && <Addcsr onClose={() => setShowModal(false)} onSubmit={handleAddCsr} />}
      {editData && (
        <Editcsr
          initialData={editData}
          onClose={() => setEditData(null)}
          onSubmit={async formData => {
            try {
              const res = await fetch(UPDATE_URL, {
                method: 'POST',
                body: formData,
              });
              const result = await res.json();
              if (result.success) {
                setEditData(null);
                fetchCsrs();
              } else {
                alert('Failed to update CSR.');
              }
            } catch (error) {
              console.error('Edit error:', error);
              alert('Error updating CSR');
            }
          }}
        />
      )}
    </div>
  );
};

export default CsrPanel;