import React, { useEffect, useState } from 'react';
import { FaTrash, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const LOCAL_STORAGE_KEY = 'hiddenContacts';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getHiddenContacts = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  const setHiddenContacts = (ids) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
     // const response = await fetch('http://localhost/TICKETKAKSHA/Backend/contact/get_contact.php');
      const response = await fetch('https://khemrajbahadurraut.com.np/Backend/contact/get_contact.php');
      const data = await response.json();

      if (data.success) {
        const hiddenIds = getHiddenContacts();
        setContacts(data.contacts.filter(contact => !hiddenIds.includes(contact.id)));
      } else {
        setError(data.message || 'Failed to fetch contacts');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to hide this contact?')) {
      const hiddenIds = getHiddenContacts();
      const updatedHidden = [...hiddenIds, id];
      setHiddenContacts(updatedHidden);
      setContacts(prev => prev.filter(contact => contact.id !== id));
    }
  };

  return (
    <div className="p-2 sm:p-6 max-w-full mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-[#2E6FB7] text-center sm:text-left">
        Contact Submissions
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <div className="flex items-center">
            <FaExclamationCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          No contacts found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {contacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">{contact.name}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[180px]">{contact.email}</td>
                    <td className="px-4 py-3 text-gray-500">{contact.contact}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs break-words">{contact.message}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(contact.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-red-600">
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="hover:text-red-800"
                      >
                        <FaTrash />
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

export default Contacts;
