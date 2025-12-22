import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentCode: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
    try {
      console.log('🔵 Login attempt:', formData.email);
      
      // Your backend route: POST /auth/student/login
      const response = await api.post('/auth/student/login', {
        email: formData.email,
        password: formData.password,
        studentCode: formData.studentCode,
      });

      console.log('✅ Backend response:', response.data);

      // Your backend returns: { message, token, user: { id, name, role, college } }
      if (response.data.token && response.data.user) {
        // Store token - backend expects it in Authorization: Bearer <token>
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('student_token', response.data.token);
        
        // Store user info
        localStorage.setItem('studentId', response.data.user.id);
        localStorage.setItem('student_id', response.data.user.id);
        localStorage.setItem('student_name', response.data.user.name);
        localStorage.setItem('student_email', formData.email);
        localStorage.setItem('student_role', response.data.user.role);
        localStorage.setItem('student_college', response.data.user.college);
        
        console.log('✅ Stored data:', {
          token: response.data.token.substring(0, 20) + '...',
          id: response.data.user.id,
          name: response.data.user.name
        });

        navigate('/student/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      setErrors({
        submit: error.response?.data?.message || 'Login failed. Please check your credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (error) =>
    `w-full px-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:border-indigo-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              COSMOS
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800">Student Login</h2>
            <p className="text-gray-600 mt-2">Access your placement portal</p>
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
                placeholder="Get from your TPO"
                disabled={loading}
                className={inputClass(errors.studentCode)}
              />
              {errors.studentCode && <p className="text-red-500 text-sm mt-1">{errors.studentCode}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <p className="text-red-600 text-sm font-semibold">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/student/signup" className="text-indigo-600 font-semibold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}