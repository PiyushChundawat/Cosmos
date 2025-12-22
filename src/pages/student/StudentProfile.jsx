import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token') || localStorage.getItem('student_token');

  useEffect(() => {
    if (!token) {
      navigate('/student/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch dashboard data which contains student info and stats
      const response = await api.get('/student/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        navigate('/student/login');
        return;
      }
      
      setError(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-indigo-600 text-lg font-medium">Loading profile...</p>
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
            <h2 className="text-2xl font-bold text-red-800 mb-2">Failed to load profile</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchProfile}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-semibold transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const student = profileData?.student || {};
  const stats = profileData?.stats || {};
  const attempts = profileData?.attempts || [];

  // Calculate rank based on average percentage (simplified - in production you'd get this from backend)
  const getRank = () => {
    if (stats.avgPercentage >= 90) return 'Top 5%';
    if (stats.avgPercentage >= 80) return 'Top 15%';
    if (stats.avgPercentage >= 70) return 'Top 30%';
    if (stats.avgPercentage >= 60) return 'Top 50%';
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center sticky top-6">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl font-bold shadow-lg">
                {student.name?.charAt(0).toUpperCase() || 'S'}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {student.name || 'Student'}
              </h2>
              <p className="text-gray-600 mb-1">{student.branch || student.department || 'N/A'}</p>
              <p className="text-sm text-gray-500">{student.rollNumber || 'N/A'}</p>

              <div className="mt-6 space-y-3">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="text-xs text-gray-600 font-medium">Average Score</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {stats.avgPercentage?.toFixed(1) || '0.0'}%
                  </p>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="text-xs text-gray-600 font-medium">Resume Score</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stats.resumeScore?.toFixed(1) || '0.0'}/10
                  </p>
                </div>
              </div>

              <button 
                onClick={() => alert('Edit profile feature coming soon!')}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
              <h2 className="text-xl font-bold text-indigo-800 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Full Name</p>
                  <p className="text-lg text-gray-900">{student.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Email</p>
                  <p className="text-lg text-gray-900 break-words">{student.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">College</p>
                  <p className="text-lg text-gray-900">{student.college || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Student ID</p>
                  <p className="text-lg text-gray-900 font-mono">{student._id?.substring(0, 8) || 'N/A'}...</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
              <h2 className="text-xl font-bold text-indigo-800 mb-6">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Roll Number</p>
                  <p className="text-lg text-gray-900">{student.rollNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Department/Branch</p>
                  <p className="text-lg text-gray-900">{student.branch || student.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Year/Semester</p>
                  <p className="text-lg text-gray-900">
                    {student.year ? `Year ${student.year}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Academic Status</p>
                  <p className="text-lg text-gray-900">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center">
                <p className="text-xs text-purple-100 font-medium mb-2">Tests Completed</p>
                <p className="text-4xl font-bold">{stats.totalTestsTaken || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center">
                <p className="text-xs text-blue-100 font-medium mb-2">Average Score</p>
                <p className="text-4xl font-bold">{stats.avgPercentage?.toFixed(0) || 0}%</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center">
                <p className="text-xs text-emerald-100 font-medium mb-2">Class Rank</p>
                <p className="text-2xl font-bold mt-1">{getRank()}</p>
              </div>
            </div>

            {/* Recent Activity */}
            {attempts.length > 0 && (
              <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-indigo-800">Recent Test Activity</h2>
                  <button
                    onClick={() => navigate('/student/performance')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {attempts.slice(0, 5).map((attempt) => (
                    <div
                      key={attempt._id}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {attempt.testId?.testTitle || 'Test'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Score: {attempt.score}/{attempt.totalMarks} ({attempt.percentage?.toFixed(1)}%)
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          attempt.percentage >= 75 ? 'bg-green-100 text-green-700' :
                          attempt.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {attempt.percentage >= 75 ? 'Excellent' :
                           attempt.percentage >= 50 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/student/tests')}
                className="bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-xl hover:bg-indigo-50 transition font-semibold shadow-md"
              >
                📝 View Tests
              </button>
              <button
                onClick={() => navigate('/student/performance')}
                className="bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-xl hover:bg-indigo-50 transition font-semibold shadow-md"
              >
                📊 Performance
              </button>
              <button
                onClick={() => navigate('/student/resume')}
                className="bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-xl hover:bg-indigo-50 transition font-semibold shadow-md"
              >
                📄 Resume
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/student/login');
                }}
                className="bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transition font-semibold shadow-md"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}