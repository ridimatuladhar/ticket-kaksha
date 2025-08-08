import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDestinations = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: null,
    is_active: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        setForm(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('is_active', form.is_active ? 1 : 0);
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
    //const res = await fetch('http://localhost/TICKETKAKSHA/Backend/destination/add_destination.php', {
      const res = await fetch('https://ticketkaksha.com.np/Backend/destination/add_destination.php', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message || 'Destination added successfully!');
        setForm({ title: '', description: '', image: null, is_active: true });
        setImagePreview(null);
        onSubmit?.(); // callback to parent if needed
      } else {
        toast.error(data.message || 'Failed to add destination');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-auto p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            <FaTimes />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-[#2E6FB7]">Add Destination</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                placeholder="Enter destination title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="2"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter destination description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                required
              />
            </div>

            {imagePreview && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                id="is_active"
                className="w-5 h-5 text-blue-600"
              />
              <label htmlFor="is_active" className="text-gray-700 text-sm">Display on site</label>
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-colors ${loading ? 'bg-[#245da3]' : 'bg-[#245da3] hover:bg-[#3a7dc4]'}`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Destination'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDestinations;