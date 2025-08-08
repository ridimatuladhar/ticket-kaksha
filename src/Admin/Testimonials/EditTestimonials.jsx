import React, { useState, useEffect } from 'react';

const EditTestimonials = ({ initialData, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    comment: '',
    imageFile: null,
    imagePreview: null,
  });

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name,
        comment: initialData.comment,
        imageFile: null,
        imagePreview: initialData.image
        //  ? `http://localhost/TICKETKAKSHA/Backend/testimonials/${initialData.image}`
          ? `https://ticketkaksha.com.np/Backend/testimonials/${initialData.image}`
          : null,
      });
    }
  }, [initialData]);

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
    setMsg('');
    setLoading(true);

    const formData = new FormData();
    formData.append('id', form.id);
    formData.append('name', form.name);
    formData.append('comment', form.comment);
    if (form.imageFile) {
      formData.append('image', form.imageFile);
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setMsg('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#2E6FB7]">Edit Testimonial</h2>

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
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              placeholder="Enter your feedback"
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

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-colors ${loading ? 'bg-[#2E6FB7]' : 'bg-[#2E6FB7] hover:bg-[#3a7dc4]'}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTestimonials;
