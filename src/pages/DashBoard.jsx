import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollegeTable from '../components/CollegeTable';
import api from '../api/axios';
import HomeButton from '../components/HomeButton';

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
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>
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