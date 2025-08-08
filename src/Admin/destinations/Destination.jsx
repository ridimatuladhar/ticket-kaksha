import React, { useEffect, useState } from 'react';
import EditDestination from './EditDestinations';
import { FaEdit, FaTrash, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import AddDestinations from './AddDestinations';

const API_URL = 'http://localhost/TICKETKAKSHA/Backend/destination/get_destinations.php';
const IMAGE_BASE_URL = 'http://localhost/TICKETKAKSHA/Backend/destination/';


const Destination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState({ open: false, destination: null });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setDestinations(data.destinations);
      } else {
        setError('Failed to fetch destinations');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (id) => {
    const dest = destinations.find(d => d.id === id);
    if (dest) {
      setEditModal({ open: true, destination: dest });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
      //  const res = await fetch('http://localhost/TICKETKAKSHA/Backend/destination/delete_destination.php', {
        const res = await fetch('https://ticketkaksha.com.np/Backend/destination/delete_destination.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
          fetchDestinations();
        } else {
          alert(data.message || 'Failed to delete.');
        }
      } catch {
        alert('Network error');
      }
    }
  };

  const handleAddDestination = async formData => {
    try {
     // const res = await fetch('http://localhost/TICKETKAKSHA/Backend/destination/add_destination.php', {
      const res = await fetch('https://ticketkaksha.com.np/Backend/destination/add_destination.php', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setShowModal(false);
        fetchDestinations(); 
      } else {
      }
    } catch (error) {
      console.error('Add error:', error);
      alert('Network error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#2E6FB7]">Destinations</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#245da3] hover:bg-[#3a7dc4] text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Add destination
        </button>
      </div>

      {showModal && (
        <AddDestinations
          onClose={() => setShowModal(false)}
          onSubmit={handleAddDestination}
        />
      )}

      {editModal.open && (
        <EditDestination
          destination={editModal.destination}
          onClose={() => setEditModal({ open: false, destination: null })}
          onUpdated={fetchDestinations}
        />
      )}

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
      ) : destinations.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          No destinations found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Updated</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {destinations.map(dest => (
                  <tr key={dest.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{dest.title}</div>
                      </div>
                      <div className="text-xs text-gray-500 md:hidden line-clamp-2 mt-1">{dest.description}</div>
                      <div className="text-xs text-gray-500 lg:hidden">{dest.created_at}</div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600 hidden md:table-cell">
                      <div className="line-clamp-2">{dest.description}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <img
                        src={`${IMAGE_BASE_URL}${dest.image_path}`}
                        alt={dest.title}
                        className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          dest.is_active === '1' || dest.is_active === 1
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {dest.is_active === '1' || dest.is_active === 1 ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {dest.created_at}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                      {dest.updated_at}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      <button
                        onClick={() => handleEdit(dest.id)}
                        className="text-[#245da3] hover:text-[#3a7dc4] p-1 sm:p-2 rounded-full hover:bg-gray-200 transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(dest.id)}
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
    </div>
  );
};

export default Destination;