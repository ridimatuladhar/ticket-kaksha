import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import PhoneInput from 'react-phone-number-input';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css';
import en from 'react-phone-number-input/locale/en.json';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';

// Build custom labels
const customLabels = {};
getCountries().forEach((country) => {
  customLabels[country] = `${en[country]} (+${getCountryCallingCode(country)})`;
});

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
    .trim();
};

const validateEmail = (email) => {
  // More restrictive email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validateName = (name) => {
  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']{1,50}$/;
  return nameRegex.test(name);
};

const validateMessage = (message) => {
  // Basic message validation - reasonable length and no suspicious patterns
  if (message.length > 1000) return false;
  
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
    /window\./i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(message));
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contact: '',
    message: ''
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    contact: false,
    message: false
  });
  
  const [loading, setLoading] = useState(false);

  // Realtime validation
  useEffect(() => {
    if (touched.name) validateField('name', formData.name);
    if (touched.email) validateField('email', formData.email);
    if (touched.contact) validateField('contact', formData.contact);
    if (touched.message) validateField('message', formData.message);
  }, [formData, touched]);

  // Auto-clear required field errors
  useEffect(() => {
    const timers = {};

    Object.keys(errors).forEach((field) => {
      if (
        ((field === 'message' || field === 'contact') && errors[field]) ||
        (errors[field]?.includes('required') && touched[field])
      ) {
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
    if (!e) return;

    // Handle phone number input
    if (typeof e === 'string' || typeof e === 'undefined') {
      const phone = e || '';
      // Sanitize phone input
      const sanitizedPhone = phone.replace(/[^+\d\s\-\(\)]/g, '');
      
      setFormData(prev => ({ ...prev, contact: sanitizedPhone }));
      setTouched(prev => ({ ...prev, contact: true }));
      validateField('contact', sanitizedPhone);
      return;
    }

    const { id, value } = e.target;
    
    // Sanitize input based on field type
    let sanitizedValue = '';
    switch (id) {
      case 'name':
        // Allow only safe characters for names
        sanitizedValue = value.replace(/[^a-zA-Z\s\-']/g, '').substring(0, 50);
        break;
      case 'email':
        // Allow only valid email characters
        sanitizedValue = value.replace(/[^a-zA-Z0-9._%+-@]/g, '').substring(0, 100);
        break;
      case 'message':
        // Sanitize message content
        sanitizedValue = sanitizeInput(value).substring(0, 1000);
        break;
      default:
        sanitizedValue = sanitizeInput(value);
    }

    setFormData(prev => ({ ...prev, [id]: sanitizedValue }));
    setTouched(prev => ({ ...prev, [id]: true }));
    validateField(id, sanitizedValue);
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
  };

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (!validateName(value)) {
          error = 'Name contains invalid characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Invalid email format';
        }
        break;
      case 'contact':
        if (!value || typeof value !== 'string') {
          error = 'Contact number is required';
        } else {
          const digits = value.replace(/\D/g, '');
          if (digits.length < 6 || digits.length > 15) {
            error = 'Phone number must be between 6 and 15 digits';
          }
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'Message cannot be empty';
        } else if (!validateMessage(value)) {
          error = 'Message contains invalid content or is too long';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const showErrorToast = (message) => {
    // Sanitize toast message to prevent XSS
    const sanitizedMessage = sanitizeInput(message);
    
    toast.error(
      <div className="flex items-start gap-3">
        <div>
          <p className="font-semibold text-gray-900">Oops!</p>
          <p className="text-gray-700">{sanitizedMessage}</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        className: 'rounded-lg shadow-lg',
      }
    );
  };

  const showSuccessToast = (name) => {
    // Sanitize name in toast to prevent XSS
    const sanitizedName = sanitizeInput(name);
    
    toast.success(
      <div className="flex items-start gap-3">
        <div>
          <p className="font-semibold text-gray-900">Thank you, {sanitizedName}!</p>
          <p className="text-gray-700">We've received your message and will get back to you soon.</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 6000,
        className: 'rounded-lg shadow-lg',
      }
    );
  };

  const validateForm = () => {
    let isValid = true;
    const newTouched = {
      name: true,
      email: true,
      contact: true,
      message: true
    };
    setTouched(newTouched);

    isValid = validateField('name', formData.name) && isValid;
    isValid = validateField('email', formData.email) && isValid;
    isValid = validateField('contact', formData.contact) && isValid;
    isValid = validateField('message', formData.message) && isValid;

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast('Please fix the errors in the form before submitting.');
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to submit this form?');
    if (!isConfirmed) return;

    setLoading(true);

    try {
      // Prepare sanitized data for submission
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        contact: formData.contact.replace(/[^+\d\s\-\(\)]/g, ''), // Additional phone sanitization
        message: sanitizeInput(formData.message)
      };

      const response = await fetch('https://ticketkaksha.com.np/Backend/contact/submit_contact.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Add security headers
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(sanitizedData),
      });

      // Validate response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.success) {
        showSuccessToast(formData.name);
        setFormData({ name: '', email: '', contact: '', message: '' });
        setTouched({ name: false, email: false, contact: false, message: false });
        setErrors({ name: '', email: '', contact: '', message: '' });
      } else {
        const errorMessage = result?.message || 'Submission failed. Please try again later.';
        showErrorToast(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-12 px-4 max-w-5xl mx-auto text-center" id="contactus">
      <h2 className="text-4xl text-[#2E6FB7] font-serif font-semibold mb-10" style={{ fontFamily: 'Satisfy' }}>
        Contact us
      </h2>

      <ToastContainer />

      <form className="max-w-xl mx-auto space-y-6 text-left" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            className={`w-full border-b-2 ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 outline-none py-2`}
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={50}
            autoComplete="name"
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            id="email"
            placeholder="abc@example.com"
            className={`w-full border-b-2 ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 outline-none py-2`}
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={100}
            autoComplete="email"
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact" className="block mb-1 font-medium">Contact Number</label>
          <PhoneInput
            id="contact"
            defaultCountry="NP"
            value={formData.contact}
            onChange={handleChange}
            className={`w-full border-b-2 ${errors.contact && touched.contact ? 'border-red-500' : 'border-gray-300'
              } focus-within:border-blue-500 outline-none py-2`}
            labels={customLabels}
            autoComplete="tel"
          />
          {errors.contact && touched.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block mb-1 font-medium">Message</label>
          <textarea
            id="message"
            rows="3"
            placeholder="Type your message here ..."
            className={`w-full border ${errors.message && touched.message ? 'border-red-500' : 'border-gray-400'} rounded-lg p-3 focus:outline-blue-500 resize-none`}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={1000}
            autoComplete="off"
          />
          {errors.message && touched.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#2F8DCC] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending...' : 'Send a message'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;