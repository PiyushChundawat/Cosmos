import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentCode: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!formData.studentCode.trim())
      newErrors.studentCode = 'Student code is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      setLoginSuccess(true);
      setLoading(false);
      
      // Navigate to student dashboard
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1000);
      
      // In your actual app, you would:
      // 1. Call your API
      // 2. Store the token in React state or context
      // 3. Navigate to dashboard
      console.log('Login successful with:', formData);
    }, 1500);
  };

  const inputClass = (error) =>
    `w-full px-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:border-indigo-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition`;

  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Successful!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Student Login
            </h1>
            <p className="text-gray-600 mt-2">Access your student portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
                disabled={loading}
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                className={inputClass(errors.password)}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Code</label>
              <input
                type="text"
                name="studentCode"
                value={formData.studentCode}
                onChange={handleChange}
                placeholder="STU12345"
                disabled={loading}
                className={inputClass(errors.studentCode)}
              />
              {errors.studentCode && <p className="text-red-500 text-sm mt-1">{errors.studentCode}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                <p className="text-red-600 text-sm font-semibold">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition shadow-md mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => alert('Navigate to signup page')}
                  className="text-indigo-600 font-medium hover:text-indigo-700 underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}