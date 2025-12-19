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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SuperAdmin Dashboard
            </h1>
            <p className="text-gray-600">Welcome to the admin panel</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold transition shadow-md"
            >
              Logout
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-indigo-200 rounded-2xl shadow-md p-3 z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center">
            <p className="font-semibold mb-2">{error}</p>
            <button
              onClick={fetchColleges}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition shadow-md"
            >
              Retry
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-indigo-600 mb-4">
              Enrolled Colleges ({colleges.length})
            </h2>
            <CollegeTable colleges={colleges} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-200 text-center py-4 mt-12">
        <p>&copy; 2025 SuperAdmin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;