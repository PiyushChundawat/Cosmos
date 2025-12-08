import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Allow ANY credentials
    localStorage.setItem("admin_name", formData.name);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          
          <div className="bg-gray-900 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-1">Admin Login</h1>
            <p className="text-gray-300 text-sm">SuperAdmin Access Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black active:scale-95 transition"
            >
              Login
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Use any credentials to access the dashboard
              </p>
            </div>

          </form>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Admin Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
