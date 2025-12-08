import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../../components/faculty/InputField';

export default function FacultyLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    facultyCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('facultyToken', 'temp-token-' + Date.now());
      localStorage.setItem('facultyName', formData.email.split('@')[0] || 'Faculty');
      localStorage.setItem('facultyEmail', formData.email);
      navigate('/faculty/dashboard');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Login</h1>
          <p className="text-gray-600">Access your faculty portal</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">

            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <InputField
              label="Faculty Code"
              type="text"
              name="facultyCode"
              value={formData.facultyCode}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don’t have an account?
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
