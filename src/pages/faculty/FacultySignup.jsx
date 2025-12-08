import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../../components/faculty/InputField';
import Button from '../../components/faculty/Button';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const faculties = JSON.parse(localStorage.getItem('faculties') || '[]');

      const existingFaculty = faculties.find(f => f.email === formData.email);
      if (existingFaculty) {
        setError('Email already registered. Please login.');
        setLoading(false);
        return;
      }

      faculties.push({
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem('faculties', JSON.stringify(faculties));

      navigate('/faculty/login');
    } catch {
      setError('Signup failed. Please try again.');
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

        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">

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
              required
            />

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
              placeholder="Create a password"
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

            <InputField
              label="College Faculty ID"
              type="text"
              name="collegeFacultyId"
              value={formData.collegeFacultyId}
              onChange={handleChange}
              placeholder="Institution ID"
              required
            />

            <InputField
              label="Department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Computer Science"
              required
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium"
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
