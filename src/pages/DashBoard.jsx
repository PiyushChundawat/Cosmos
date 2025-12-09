import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollegeTable from '../components/CollegeTable';
import api from '../api/axios';

function Dashboard() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await api.get('/superadmin/colleges');
      setColleges(response.data.colleges);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-emerald-600">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-emerald-600">Super</span>Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">Welcome to the admin panel</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Logout
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 font-semibold text-lg">⚠️ {error}</p>
            <button
              onClick={fetchColleges}
              className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Enrolled Colleges ({colleges.length})
              </h2>
            </div>
            <CollegeTable colleges={colleges} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-12">
        <p>&copy; 2025 SuperAdmin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;