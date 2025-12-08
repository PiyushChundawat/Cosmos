import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentCode: '',
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    localStorage.setItem('studentToken', 'mock-student-token-' + Date.now());
    localStorage.setItem('studentName', formData.email.split('@')[0]);
    localStorage.setItem('studentId', 'student-' + Date.now());
    navigate("/student/dashboard");
  };

  const inputClass = (error) =>
    `w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-emerald-600`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-50 rounded-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Student Login</h1>
          <p className="text-gray-600 mt-2">Access your student portal</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@college.edu"
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
              className={inputClass(errors.studentCode)}
            />
            {errors.studentCode && <p className="text-red-500 text-sm mt-1">{errors.studentCode}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition-colors mt-6"
          >
            Login
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/student/signup" className="text-emerald-600 font-medium hover:text-emerald-700">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
