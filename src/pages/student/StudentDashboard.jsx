import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = "675a1234567890abcdef9999";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/api/student/dashboard/${studentId}`);
      console.log('Dashboard response:', response.data);

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: formatDate function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl">
            <p className="font-semibold mb-2">{error}</p>
            <p className="text-sm">
              The student ID might not exist in the database. Please create a student first or check your backend.
            </p>
            <button
              onClick={fetchDashboard}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const upcomingTests = dashboardData?.upcomingTests || [];
  const attempts = dashboardData?.attempts || [];
  const resume = dashboardData?.resume || null;
  const roadmap = dashboardData?.roadmap || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      
      
    </div>
  );
}
