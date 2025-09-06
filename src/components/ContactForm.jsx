import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    error: null,
    isConfigError: false
  });

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    let timer;
    if (status.success || status.error) {
      timer = setTimeout(() => {
        setStatus(prev => ({ ...prev, success: null, error: null, isConfigError: false }));
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [status.success, status.error]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', message: '' };
    
    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      valid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Message validation
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) return;
    
    setStatus({ submitting: true, success: null, error: null, isConfigError: false });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({
          submitting: false,
          success: data.message,
          error: null,
          isConfigError: false
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Check if it's a configuration error
        const isConfigError = data.message && (
          data.message.includes('Email service not configured') ||
          data.message.includes('Email authentication failed')
        );
        
        setStatus({
          submitting: false,
          success: null,
          error: data.message || 'Something went wrong',
          isConfigError
        });
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: null,
        error: 'Network error. Please check your connection.',
        isConfigError: false
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
        <AnimatePresence>
          {status.success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center"
            >
              <div className="bg-green-200 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {status.success}
            </motion.div>
          )}
          
          {status.error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-4 p-3 ${status.isConfigError ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'} rounded-lg flex items-start`}
            >
              <div className={`${status.isConfigError ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-700'} p-1 rounded-full mr-2 mt-0.5 flex-shrink-0`}>
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="font-medium">{status.error}</p>
                {status.isConfigError && (
                  <p className="text-sm mt-1">
                    This is a server configuration issue. Please contact the site administrator.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className={`w-full px-3 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={status.submitting || status.isConfigError}
          className={`w-full font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${status.isConfigError ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          whileHover={!status.isConfigError ? { scale: 1.02 } : {}}
          whileTap={!status.isConfigError ? { scale: 0.98 } : {}}
        >
          {status.submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : status.isConfigError ? (
            'Contact Administrator'
          ) : (
            <>
              Send Message
              <Send size={16} />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}