import React, { useState } from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';

const Addcsr = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    is_visible: '1',
    imageFile: null,
    imagePreview: null,
  });

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = e => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
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

    if (!form.imageFile) {
      setMsg('Please select an image.');
      return;
    }

    setMsg('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('is_visible', form.is_visible);
    if (form.imageFile) {
      formData.append('image', form.imageFile);
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Submit Error:', error);
      setMsg('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  // Format description for preview (convert line breaks to paragraphs)
  const formatPreview = (text) => {
    return text
      .split('\n\n') // Split on double line breaks for paragraphs
      .filter(paragraph => paragraph.trim()) // Remove empty paragraphs
      .map((paragraph, index) => (
        <p key={index} className="mb-3 last:mb-0">
          {paragraph.trim()}
        </p>
      ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#2E6FB7]">Add CSR Initiative</h2>

        {msg && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{msg}</div>
        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              placeholder="Enter a title for the CSR initiative"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FaInfoCircle size={12} />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            
    

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-vertical"
              required
              placeholder="Enter a detailed description. Use double line breaks (press Enter twice) to create new paragraphs.&#10;&#10;Example:&#10;This is the first paragraph about our CSR initiative.&#10;&#10;This is the second paragraph with more details.&#10;&#10;This is the third paragraph with additional information."
            />
            
            <div className="text-sm text-gray-500 mt-1">
              Characters: {form.description.length} | 
              Paragraphs: {form.description.split('\n\n').filter(p => p.trim()).length}
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && form.description && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
              <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                {formatPreview(form.description)}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              name="is_visible"
              value={form.is_visible}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="1">Visible</option>
              <option value="0">Hidden</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          {form.imagePreview && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Preview
              </label>
              <img
                src={form.imagePreview}
                alt="Preview"
                className="h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 px-4 text-white font-semibold rounded-lg transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#245da3] hover:bg-[#3a7dc4]'
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add CSR Initiative'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addcsr;