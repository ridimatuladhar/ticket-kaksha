import React, { useEffect, useState } from 'react';
import AddTestimonials from './AddTestimonials';
import { FaSpinner, FaExclamationCircle, FaTrash, FaEdit } from 'react-icons/fa';
import EditTestimonials from './EditTestimonials';

// const API_URL = 'http://localhost/TICKETKAKSHA/Backend/testimonials/get_testimonials.php';
// const UPDATE_URL = 'http://localhost/TICKETKAKSHA/Backend/testimonials/update_approval.php';
// const ADD_URL = 'http://localhost/TICKETKAKSHA/Backend/testimonials/add_testimonials.php';
// const DELETE_URL = 'http://localhost/TICKETKAKSHA/Backend/testimonials/delete_testimonials.php';
// const IMAGE_BASE_URL = 'http://localhost/TICKETKAKSHA/Backend/testimonials/';

const API_URL = 'https://khemrajbahadurraut.com.np/Backend/testimonials/get_testimonials.php';
const UPDATE_URL = 'https://khemrajbahadurraut.com.np/Backend/testimonials/update_approval.php';
const ADD_URL = 'https://khemrajbahadurraut.com.np/Backend/testimonials/add_testimonials.php';
const DELETE_URL = 'https://khemrajbahadurraut.com.np/Backend/testimonials/delete_testimonials.php';
const IMAGE_BASE_URL = 'https://khemrajbahadurraut.com.np/Backend/testimonials/';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
      } else {
        setError('Failed to fetch testimonials.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching testimonials.');
    }
    setLoading(false);
  };

  const handleApprovalChange = async (id, newValue) => {
    try {
      const res = await fetch(UPDATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_approved: newValue }),
      });

      const result = await res.json();
      if (result.success) {
        setTestimonials(prev =>
          prev.map(t => (t.id === id ? { ...t, is_approved: newValue } : t))
        );
      } else {
        alert('Failed to update approval status.');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };
  const handleAddTestimonial = async formData => {
    try {
      const res = await fetch(ADD_URL, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setShowModal(false);
        fetchTestimonials();
      } else {
        alert('Failed to add testimonial.');
      }
    } catch (error) {
      console.error('Add error:', error);
    }
  };

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

  try {
    const res = await fetch(DELETE_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    
    if (result.success) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } else {
      alert(result.message || 'Failed to delete testimonial.');
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Error deleting testimonial. Please check console for details.');
  }
};

return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#2E6FB7]">Testimonials</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#245da3] hover:bg-[#3a7dc4] text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Add Testimonial
        </button>
      </div>

      {/* Loading, error, and empty states remain the same */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <div className="flex items-center">
            <FaExclamationCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          No testimonials found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Image</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Comment</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created At</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 sm:hidden">
                          {t.image ? (
                            <img
                              src={IMAGE_BASE_URL + t.image}
                              alt={t.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-2 sm:ml-0">
                          <div className="text-sm font-medium text-gray-900">{t.name}</div>
                          <div className="text-sm text-gray-500 md:hidden line-clamp-2">{t.comment}</div>
                          <div className="text-xs text-gray-500 lg:hidden">{t.created_at}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                      {t.image ? (
                        <img
                          src={IMAGE_BASE_URL + t.image}
                          alt={t.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600 hidden md:table-cell">
                      <div className="line-clamp-2">{t.comment}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {t.created_at}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <select
                        className={`rounded px-2 py-1 text-sm font-medium
                          ${t.is_approved === '1' || t.is_approved === 1 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
                        value={t.is_approved === 1 || t.is_approved === '1' ? '1' : '0'}
                        onChange={e => handleApprovalChange(t.id, e.target.value)}
                      >
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditData(t)}
                        className="text-[#245da3] hover:text-black p-1 sm:p-2 rounded-full hover:bg-gray-200 transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-800 p-1 sm:p-2 rounded-full hover:bg-red-100 transition"
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

      {/* Keep your modals the same */}
      {showModal && (
        <AddTestimonials
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTestimonial}
        />
      )}
      {editData && (
        <EditTestimonials
          initialData={editData}
          onClose={() => setEditData(null)}
          onSubmit={async (formData) => {
            try {
             // const res = await fetch('http://localhost/TICKETKAKSHA/Backend/testimonials/edit_testimonials.php', {
              const res = await fetch('https://khemrajbahadurraut.com.np/Backend/testimonials/edit_testimonials.php', {
                method: 'POST',
                body: formData,
              });
              const result = await res.json();
              if (result.success) {
                setEditData(null);
                fetchTestimonials();
              } else {
                alert('Failed to update testimonial.');
              }
            } catch (error) {
              console.error('Edit error:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default Testimonials;