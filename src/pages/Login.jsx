import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../components/HomeButton';
import api from '../api/axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/superadmin/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      {/* Centered Login Card */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">

            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                Admin Login
              </h1>
              <p className="text-gray-600 text-sm">
                SuperAdmin Access Portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                  <p className="text-red-600 text-sm font-semibold">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="superadmin@cosmos.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-600 focus:outline-none disabled:bg-gray-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-600 focus:outline-none disabled:bg-gray-100 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold disabled:bg-gray-400 transition shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mr-2"></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Default credentials: superadmin@cosmos.com / superadmin123
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-indigo-600 text-sm py-4">
        <p>© 2025 Admin Dashboard. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Login;
