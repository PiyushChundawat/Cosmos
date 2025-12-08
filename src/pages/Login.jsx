import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Simulate login success and navigate to dashboard
      navigate('/dashboard', { state: { userName: formData.name } });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-emerald-100">SuperAdmin Access Portal</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                  errors.name
                    ? 'border-red-500 focus:border-red-600 bg-red-50'
                    : 'border-emerald-200 focus:border-emerald-500 hover:border-emerald-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                  errors.email
                    ? 'border-red-500 focus:border-red-600 bg-red-50'
                    : 'border-emerald-200 focus:border-emerald-500 hover:border-emerald-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                  errors.password
                    ? 'border-red-500 focus:border-red-600 bg-red-50'
                    : 'border-emerald-200 focus:border-emerald-500 hover:border-emerald-300'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg active:scale-95 transform"
            >
              Login
            </button>

            {/* Footer Info */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Use any credentials to access the dashboard
              </p>
            </div>
          </form>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Admin Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;