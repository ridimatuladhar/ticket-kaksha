import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormTestimonials = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    image: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState({
    name: '',
    comment: '',
    image: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    comment: false,
    image: false
  });

  // Real-time validation
  useEffect(() => {
    validateField('name', formData.name);
    validateField('comment', formData.comment);
    validateField('image', formData.image);
  }, [formData]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === 'image') {
      const file = files[0];
      if (file && !file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Only image files are allowed' }));
        return;
      }

      const preview = file ? URL.createObjectURL(file) : null;
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: preview
      }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }

    setTouched(prev => ({ ...prev, [id]: true }));
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
  };

  const validateField = (field, value) => {
    let error = '';

    if (field === 'image') {
      if (!value) error = 'Image is required';
    } else if (!value.trim()) {
      error = `${field === 'name' ? 'Name' : 'Feedback'} is required`;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const isNameValid = validateField('name', formData.name);
    const isCommentValid = validateField('comment', formData.comment);
    const isImageValid = validateField('image', formData.image);

    setTouched({ name: true, comment: true, image: true });

    return isNameValid && isCommentValid && isImageValid;
  };


  const showSuccessToast = () => {
    toast.success(
      <div>
        <p className="font-semibold">Thanks, {formData.name}!</p>
        <p>Your testimonial was submitted.</p>
      </div>,
      {
        position: 'top-right',
        autoClose: 4000,
        className: 'w-full max-w-sm text-sm py-4 px-4 rounded-lg',
      }
    );
  };

  const showErrorToast = (msg) => {
    toast.error(
      <div>
        <p className="font-semibold">Oops!</p>
        <p>{msg}</p>
      </div>,
      {
        position: 'top-right',
        autoClose: 4000,
        className: 'w-full max-w-sm text-sm py-4 px-4 rounded-lg',
      }
    );
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    showErrorToast('Please fix the errors before submitting.');
    return;
  }

  setIsSubmitting(true);  // Disable button

  const data = new FormData();
  data.append('name', formData.name);
  data.append('comment', formData.comment);
  data.append('image', formData.image);

  try {
    //const response = await fetch('http://localhost/TICKETKAKSHA/Backend/testimonials/add_testimonials.php', {
    const response = await fetch('https://ticketkaksha.com.np/Backend/testimonials/add_testimonials.php', {
      method: 'POST',
      body: data
    });

    const result = await response.json();

    if (result.success) {
      showSuccessToast();
      setFormData({
        name: '',
        comment: '',
        image: null,
        imagePreview: null
      });
      setTouched({ name: false, comment: false, image: false });
      document.getElementById('image').value = '';
    } else {
      showErrorToast(result.message || 'Submission failed. Try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorToast('Network error. Please try again.');
  } finally {
    setIsSubmitting(false);  // Re-enable button
  }
};


  return (
    <div className="bg-white rounded-lg max-w-xl mx-auto">
      <h2
        className="text-2xl text-center font-bold mb-6 text-[#2F8DCC]"
        style={{ fontFamily: 'Satisfy' }}
      >
        Leave a Testimonial
      </h2>

      <ToastContainer
  position="top-right"
  newestOnTop
  limit={2}
/>


      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border-b-2 py-2 outline-none ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block mb-1 font-medium">Feedback</label>
          <textarea
            id="comment"
            rows="2"
            placeholder="Your feedback here..."
            value={formData.comment}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border p-3 rounded-lg resize-none ${errors.comment && touched.comment ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.comment && touched.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block mb-1 font-medium">Upload Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${errors.image && touched.image ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.image && touched.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {/* Image Preview */}
        {formData.imagePreview && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
            <img
              src={formData.imagePreview}
              alt="Preview"
              className="h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#2F8DCC] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormTestimonials;
