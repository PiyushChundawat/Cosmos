import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../../components/faculty/InputField';
import Button from '../../components/faculty/Button';
import api from '../../api/axios';

export default function FacultySignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    facultyCode: '',
    collegeFacultyId: '',
    department: ''
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
      const response = await api.post('/auth/faculty/signup', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        facultyCode: formData.facultyCode,
        facultyId: formData.collegeFacultyId,
        department: formData.department,
      });

      // Show success and redirect to login
      alert('Signup successful! Please login with your credentials.');
      navigate('/faculty/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Signup</h1>
          <p className="text-gray-600 mt-1">Create your faculty account</p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md p-3">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
              required
            />

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
              placeholder="Create a password"
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

            <InputField
              label="College Faculty ID"
              type="text"
              name="collegeFacultyId"
              value={formData.collegeFacultyId}
              onChange={handleChange}
              placeholder="Institution ID"
              disabled={loading}
              required
            />

            <InputField
              label="Department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Computer Science"
              disabled={loading}
              required
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already registered?
              <Link to="/faculty/login" className="text-emerald-600 font-medium ml-1 hover:text-emerald-700">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}