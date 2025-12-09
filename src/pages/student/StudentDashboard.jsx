import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // TODO: replace with dynamic ID after student login
  const studentId = "675a1234567890abcdef9999";
  const studentName = "Student";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      // ⭐ FIXED API URL → Correct backend route:
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
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

  const quickActions = [
    {
      title: 'View Upcoming Tests',
      description: 'Check scheduled placement tests',
      path: '/student/tests',
    },
    {
      title: 'Performance Overview',
      description: 'Track your performance analytics',
      path: '/student/performance',
    },
    {
      title: 'Resume Analysis',
      description: 'Upload and analyze your resume',
      path: '/student/resume-upload',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold mb-2">⚠️ {error}</p>
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
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi, {dashboardData?.student?.name || studentName}
          </h1>
          <p className="text-gray-600 mt-1">Welcome to your placement dashboard</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm">Tests Attempted</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalTestsTaken || 0}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm">Average Score</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.avgScore ? Math.round(stats.avgScore) : 0}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm">Average Percentage</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.avgPercentage ? Math.round(stats.avgPercentage) : 0}%
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm">Resume Score</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.resumeScore || 0}
            </p>
          </div>
        </div>

        {/* Resume & Roadmap Section */}
        {(resume || roadmap) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {resume && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">📄 Resume Analysis</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Last analyzed: {new Date(resume.analyzedAt).toLocaleDateString('en-IN')}
                </p>
                <button
                  onClick={() => navigate('/student/resume-upload')}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            )}

            {roadmap && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">🗺️ Learning Roadmap</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Created: {new Date(roadmap.createdAt).toLocaleDateString('en-IN')}
                </p>
                <button
                  onClick={() => navigate('/student/roadmap')}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  View Roadmap
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Tests */}
        {upcomingTests.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTests.map((test) => (
                <div key={test._id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {test.testTitle}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>📅 {formatDate(test.schedule?.startTime)}</p>
                    <p>⏱️ Duration: {test.duration || 'N/A'} mins</p>
                    <p>❓ Questions: {test.numberOfQuestions || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/student/test/${test._id}`)}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                  >
                    View Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quickActions.map((action, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(action.path)}
            >
              <h3 className="text-xl font-bold text-gray-900">{action.title}</h3>
              <p className="text-gray-600 mt-2">{action.description}</p>
              <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition">
                Continue
              </button>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

          {attempts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No recent activity. Start taking tests to see your progress!</p>
              <button
                onClick={() => navigate('/student/tests')}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                View Upcoming Tests
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.slice(0, 5).map((attempt, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {attempt.testId?.testTitle || 'Test'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {getRelativeTime(attempt.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        {attempt.percentage ? Math.round(attempt.percentage) : 0}%
                      </p>
                      <p className="text-sm text-gray-500">
                        {attempt.score || 0}/{attempt.totalMarks || 0}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${attempt.percentage || 0}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => navigate(`/student/attempt/${attempt._id}`)}
                    className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View Details →
                  </button>
                </div>
              ))}

              {attempts.length > 5 && (
                <button
                  onClick={() => navigate('/student/performance')}
                  className="w-full mt-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All Activity →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}