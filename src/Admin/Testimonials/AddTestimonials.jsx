import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AddTestimonials = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    comment: '',
    imageFile: null,
    imagePreview: null,
  });

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (e.target.type === 'file') {
      const file = files[0];
      setForm(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: file ? URL.createObjectURL(file) : null,
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('comment', form.comment);
    formData.append('is_admin', '1'); // Flag this as admin submission
    if (form.imageFile) {
      formData.append('image', form.imageFile);
    }

    try {
    //  const response = await fetch('http://localhost/TICKETKAKSHA/Backend/testimonials/add_testimonials.php', {
       const response = await fetch('https://ticketkaksha.com.np/Backend/testimonials/add_testimonials.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        onSubmit(); // Refresh testimonials list
        onClose(); // Close modal
      } else {
        setMsg(result.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      setMsg('Network error. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#2E6FB7]">Add Testimonial</h2>

        {msg && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              placeholder="Enter testimonial content"
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
            />
          </div>

          {form.imagePreview && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
              <img
                src={form.imagePreview}
                alt="Preview"
                className="h-32 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">↻</span>
                  Submitting...
                </>
              ) : (
                'Submit Testimonial'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestimonials;