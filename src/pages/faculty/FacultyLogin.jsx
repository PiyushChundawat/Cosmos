import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import InputField from '../../components/faculty/InputField';
import Button from '../../components/faculty/Button';

const FacultyLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    facultyCode: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock login - check localStorage
      const faculties = JSON.parse(localStorage.getItem('faculties') || '[]');
      
      const faculty = faculties.find(
        f => f.email === formData.email && 
             f.password === formData.password && 
             f.facultyCode === formData.facultyCode
      );

      if (faculty) {
        // Save token and faculty info
        localStorage.setItem('facultyToken', 'mock-faculty-token-' + Date.now());
        localStorage.setItem('facultyName', faculty.fullName);
        localStorage.setItem('facultyId', faculty.id);
        
        // Redirect to dashboard
        navigate('/faculty/dashboard');
      } else {
        setError('Invalid credentials. Please check your email, password, and faculty code.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Faculty Login</h1>
          <p className="text-gray-600 mt-2">Access your faculty portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="faculty@college.edu"
              required
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <InputField
              label="Faculty Code"
              type="text"
              name="facultyCode"
              value={formData.facultyCode}
              onChange={handleChange}
              placeholder="FAC123XYZ"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/faculty/signup" className="text-emerald-600 font-medium hover:text-emerald-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;
