import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../../components/faculty/InputField';
import api from '../../api/axios';

export default function FacultyLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    facultyCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/faculty/login', {
        email: formData.email,
        password: formData.password,
        facultyCode: formData.facultyCode,
      });

      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('facultyId', response.data.user.id);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('facultyToken', response.data.token);
      localStorage.setItem('facultyName', response.data.user.name);
      localStorage.setItem('facultyEmail', response.data.user.email || formData.email);
      localStorage.setItem('facultyCollege', response.data.user.college);

      navigate('/faculty/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Login</h1>
          <p className="text-gray-600">Access your faculty portal</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="faculty@college.edu"
              disabled={loading}
              required
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              required
            />

            <InputField
              label="Faculty Code"
              type="text"
              name="facultyCode"
              value={formData.facultyCode}
              onChange={handleChange}
              placeholder="FAC123XYZ"
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?
              <Link to="/faculty/signup" className="text-emerald-600 ml-1 font-medium hover:text-emerald-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}