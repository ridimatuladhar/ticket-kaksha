import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// XSS Protection utilities
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove dangerous characters and patterns
  return input
    .replace(/[<>\"'&]/g, '') // Remove HTML/script injection chars
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/file:/gi, '') // Remove file: protocol
    .trim();
};

const validateName = (name) => {
  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']{1,50}$/;
  return nameRegex.test(name);
};

const validateComment = (comment) => {
  // Basic comment validation - reasonable length and no suspicious patterns
  if (comment.length > 500) return false;
  
  // Check for suspicious script patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
    /<img[^>]+src\s*=/i, // Prevent img src injections
    /data:text\/html/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(comment));
};

const validateImageFile = (file) => {
  if (!file) return { isValid: false, error: 'Image is required' };
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }
  
  // Check file name for suspicious content
  const suspiciousExtensions = /\.(php|js|html|htm|exe|bat|cmd|scr)$/i;
  if (suspiciousExtensions.test(file.name)) {
    return { isValid: false, error: 'Invalid file type detected' };
  }
  
  return { isValid: true, error: '' };
};

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

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  // Auto-clear errors after 3 seconds
  useEffect(() => {
    const timers = {};

    Object.keys(errors).forEach((field) => {
      if (errors[field] && touched[field]) {
        timers[field] = setTimeout(() => {
          setErrors((prev) => ({ ...prev, [field]: '' }));
        }, 3000);
      }
    });

    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, [errors, touched]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === 'image') {
      const file = files[0];
      
      // Clean up previous preview
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }

      if (file) {
        // Validate image file
        const validation = validateImageFile(file);
        
        if (!validation.isValid) {
          setErrors(prev => ({ ...prev, image: validation.error }));
          setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: null
          }));
          e.target.value = ''; // Clear file input
          return;
        }

        // Create safe preview URL
        const preview = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: preview
        }));
        setErrors(prev => ({ ...prev, image: '' }));
      } else {
        setFormData(prev => ({
          ...prev,
          image: null,
          imagePreview: null
        }));
      }

      setTouched(prev => ({ ...prev, image: true }));
      validateField('image', file);
    } else {
      // Sanitize text input based on field type
      let sanitizedValue = '';
      switch (id) {
        case 'name':
          // Allow only safe characters for names
          sanitizedValue = value.replace(/[^a-zA-Z\s\-']/g, '').substring(0, 50);
          break;
        case 'comment':
          // Sanitize comment content
          sanitizedValue = sanitizeInput(value).substring(0, 500);
          break;
        default:
          sanitizedValue = sanitizeInput(value);
      }

      setFormData(prev => ({ ...prev, [id]: sanitizedValue }));
      setTouched(prev => ({ ...prev, [id]: true }));
      validateField(id, sanitizedValue);
    }
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));

    // Validate on blur
    validateField(id, id === 'image' ? formData.image : formData[id]);
  };

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value || !value.trim()) {
          error = 'Name is required';
        } else if (!validateName(value)) {
          error = 'Name contains invalid characters';
        }
        break;
      case 'comment':
        if (!value || !value.trim()) {
          error = 'Feedback is required';
        } else if (!validateComment(value)) {
          error = 'Comment contains invalid content or is too long';
        }
        break;
      case 'image':
        if (!value) {
          error = 'Image is required';
        } else {
          const validation = validateImageFile(value);
          if (!validation.isValid) {
            error = validation.error;
          }
        }
        break;
      default:
        break;
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
    // Sanitize name in toast to prevent XSS
    const sanitizedName = sanitizeInput(formData.name);
    
    toast.success(
      <div>
        <p className="font-semibold">Thanks, {sanitizedName}!</p>
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
    // Sanitize error message to prevent XSS
    const sanitizedMsg = sanitizeInput(msg);
    
    toast.error(
      <div>
        <p className="font-semibold">Oops!</p>
        <p>{sanitizedMsg}</p>
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

    // Additional confirmation for security
    const isConfirmed = window.confirm('Are you sure you want to submit your testimonial?');
    if (!isConfirmed) return;

    setIsSubmitting(true);

    try {
      // Prepare sanitized data for submission
      const data = new FormData();
      data.append('name', sanitizeInput(formData.name));
      data.append('comment', sanitizeInput(formData.comment));
      
      // Validate image one more time before submission
      const imageValidation = validateImageFile(formData.image);
      if (!imageValidation.isValid) {
        showErrorToast(imageValidation.error);
        setIsSubmitting(false);
        return;
      }
      
      data.append('image', formData.image);

      const response = await fetch('https://ticketkaksha.com.np/Backend/testimonials/add_testimonials.php', {
        method: 'POST',
        headers: {
          // Add security headers (don't add Content-Type for FormData)
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: data
      });

      // Validate response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.success) {
        showSuccessToast();
        
        // Clean up form data
        if (formData.imagePreview) {
          URL.revokeObjectURL(formData.imagePreview);
        }
        
        setFormData({
          name: '',
          comment: '',
          image: null,
          imagePreview: null
        });
        setTouched({ name: false, comment: false, image: false });
        setErrors({ name: '', comment: '', image: '' });
        
        // Clear file input
        const imageInput = document.getElementById('image');
        if (imageInput) imageInput.value = '';
      } else {
        const errorMessage = result?.message || 'Submission failed. Try again.';
        showErrorToast(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      <div className="space-y-5">
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
            maxLength={50}
            autoComplete="name"
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
            maxLength={500}
            autoComplete="off"
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
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${errors.image && touched.image ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
          </p>
          {errors.image && touched.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {/* Image Preview */}
        {formData.imagePreview && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
            <div className="relative inline-block">
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="h-32 object-cover rounded-lg border"
                onError={() => {
                  // Handle broken image preview
                  setFormData(prev => ({
                    ...prev,
                    imagePreview: null
                  }));
                  setErrors(prev => ({ ...prev, image: 'Invalid image file' }));
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (formData.imagePreview) {
                    URL.revokeObjectURL(formData.imagePreview);
                  }
                  setFormData(prev => ({
                    ...prev,
                    image: null,
                    imagePreview: null
                  }));
                  const imageInput = document.getElementById('image');
                  if (imageInput) imageInput.value = '';
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-[#2F8DCC] text-white px-6 py-2 rounded-full transition duration-300 
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormTestimonials;