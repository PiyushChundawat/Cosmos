import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get token from localStorage
  const token = localStorage.getItem('token') || localStorage.getItem('student_token');
  const studentName = localStorage.getItem('student_name');
  const studentEmail = localStorage.getItem('student_email');

  useEffect(() => {
    console.log('🔵 Dashboard mounting...');
    console.log('Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('❌ No token found, redirecting to login');
      navigate('/student/login');
      return;
    }
    
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔵 Fetching dashboard...');
      
      // Your backend route: GET /student/dashboard (protected by middleware)
      const response = await api.get('/student/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Dashboard response:', response.data);
      
      // Your backend returns: { student, resume, stats, upcomingTests, attempts }
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('❌ Dashboard error:', error);
      console.error('Error response:', error.response?.data);
      
      // If token invalid or expired
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('❌ Unauthorized, clearing localStorage');
        localStorage.clear();
        navigate('/student/login');
        return;
      }
      
      setError(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

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

  const handleLogout = () => {
    console.log('🔵 Logging out...');
    localStorage.clear();
    navigate('/student/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Welcome, {studentName || 'Student'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Failed to load dashboard</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchDashboard}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition"
              >
                Retry
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Backend response structure: { student, resume, stats, upcomingTests, attempts }
  const student = dashboardData?.student || {};
  const stats = dashboardData?.stats || {};
  const upcomingTests = dashboardData?.upcomingTests || [];
  const attempts = dashboardData?.attempts || [];
  const resume = dashboardData?.resume || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {studentName || student.name || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-1">{studentEmail || student.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-blue-100 text-sm font-medium">Tests Taken</p>
            <p className="text-4xl font-bold mt-2">{stats.totalTestsTaken || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-indigo-100 text-sm font-medium">Average Score</p>
            <p className="text-4xl font-bold mt-2">{stats.avgScore?.toFixed(1) || '0.0'}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-purple-100 text-sm font-medium">Average %</p>
            <p className="text-4xl font-bold mt-2">{stats.avgPercentage?.toFixed(1) || '0.0'}%</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-pink-100 text-sm font-medium">Resume Score</p>
            <p className="text-4xl font-bold mt-2">{stats.resumeScore?.toFixed(1) || '0.0'}/10</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upcoming Tests & Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Tests */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Tests</h2>
                <button
                  onClick={() => navigate('/student/tests')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  View All →
                </button>
              </div>

              {upcomingTests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming tests scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTests.slice(0, 3).map((test) => (
                    <div
                      key={test._id}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/student/test/${test._id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{test.testTitle}</h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                          {formatDate(test.schedule?.startTime)}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>📝 {test.totalMarks} marks</span>
                        <span>⏱️ {test.duration} mins</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Test Attempts */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Test Attempts</h2>
                <button
                  onClick={() => navigate('/student/performance')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  View All →
                </button>
              </div>

              {attempts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No test attempts yet</p>
                  <button
                    onClick={() => navigate('/student/tests')}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    Take Your First Test
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {attempts.slice(0, 5).map((attempt) => (
                    <div
                      key={attempt._id}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {attempt.testId?.testTitle || 'Test'}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          attempt.percentage >= 75 ? 'bg-green-100 text-green-700' :
                          attempt.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {attempt.percentage?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Score: {attempt.score}/{attempt.totalMarks}</span>
                        <span>•</span>
                        <span>{getRelativeTime(attempt.createdAt)}</span>
                      </div>
                      {attempt.facultyFeedback && (
                        <p className="mt-2 text-sm text-gray-700 italic">
                          "{attempt.facultyFeedback}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Resume */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/student/tests')}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                  View All Tests
                </button>
                <button
                  onClick={() => navigate('/student/performance')}
                  className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl hover:bg-indigo-50 transition font-medium"
                >
                  My Performance
                </button>
                <button
                  onClick={() => navigate('/student/resume')}
                  className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl hover:bg-indigo-50 transition font-medium"
                >
                  Resume Analysis
                </button>
                <button
                  onClick={() => navigate('/student/profile')}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  My Profile
                </button>
              </div>
            </div>

            {/* Resume Score Card */}
            {resume && (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Resume Analysis</h3>
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold">{resume.score || '0'}/10</p>
                  <p className="text-indigo-100 mt-2">Overall Score</p>
                </div>
                <button
                  onClick={() => navigate('/student/resume')}
                  className="w-full bg-white text-indigo-600 py-3 rounded-xl hover:bg-indigo-50 transition font-medium"
                >
                  View Detailed Analysis
                </button>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}