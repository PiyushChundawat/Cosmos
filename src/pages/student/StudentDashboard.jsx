import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {(dashboardData?.student?.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hi, {dashboardData?.student?.name || 'Student'}
            </h1>
            <p className="text-sm text-gray-600">
              Placement Dashboard
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* STATS (COLORFUL) */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Tests Attempted", value: stats.totalTestsTaken || 0, gradient: "from-purple-500 to-pink-600", textColor: "text-purple-100" },
              { label: "Average Score", value: stats.avgScore ? Math.round(stats.avgScore) : 0, gradient: "from-emerald-500 to-teal-600", textColor: "text-emerald-100" },
              { label: "Average %", value: `${stats.avgPercentage ? Math.round(stats.avgPercentage) : 0}%`, gradient: "from-orange-500 to-red-600", textColor: "text-orange-100" },
              { label: "Resume Score", value: stats.resumeScore || 0, gradient: "from-blue-500 to-indigo-600", textColor: "text-blue-100" },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-4 text-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer`}
              >
                <p className={`text-xs ${item.textColor} font-medium`}>{item.label}</p>
                <p className="text-2xl font-bold mt-2">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RESUME & ROADMAP (INDIGO) */}
        {(resume || roadmap) && (
          <section className="grid md:grid-cols-2 gap-3">
            {resume && (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <h3 className="font-bold text-indigo-800 text-base">
                  Resume Analysis
                </h3>
                <p className="text-xs text-gray-600 mb-3 mt-1">
                  Last analyzed: {new Date(resume.analyzedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
                <button 
                  onClick={() => navigate('/student/resume-upload')}
                  className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-md"
                >
                  View Details
                </button>
              </div>
            )}

            {roadmap && (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <h3 className="font-bold text-indigo-800 text-base">
                  Learning Roadmap
                </h3>
                <p className="text-xs text-gray-600 mb-3 mt-1">
                  Created: {new Date(roadmap.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
                <button 
                  onClick={() => navigate('/student/roadmap')}
                  className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-md"
                >
                  View Details
                </button>
              </div>
            )}
          </section>
        )}

        {/* UPCOMING TESTS (EMERALD) */}
        {upcomingTests.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-emerald-600 mb-4">
              Upcoming Tests
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {upcomingTests.map((test) => (
                <div
                  key={test._id}
                  className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <h3 className="font-bold text-emerald-800 text-base">
                    {test.testTitle}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{test.duration || 'N/A'} mins · {test.numberOfQuestions || 'N/A'} Qs</p>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">{formatDate(test.schedule?.startTime)}</p>
                  <button 
                    onClick={() => navigate(`/student/test/${test._id}`)}
                    className="mt-3 w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-md"
                  >
                    Start Preparation
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QUICK ACTIONS (VIOLET) */}
        <section>
          <h2 className="text-xl font-bold text-violet-600 mb-4">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { title: "Upcoming Tests", desc: "View and prepare for assessments", path: "/student/tests" },
              { title: "Performance", desc: "Track your progress", path: "/student/performance" },
              { title: "Resume", desc: "Improve your score", path: "/student/resume-upload" }
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="bg-white border-2 border-violet-200 rounded-2xl p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <h3 className="font-bold text-gray-800 text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3">{item.desc}</p>
                <button className="w-full bg-violet-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-violet-700 transition shadow-md">
                  Open
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT ACTIVITY (BLUE) */}
        <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md">
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            Recent Activity
          </h2>

          {attempts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No recent activity. Start taking tests to see your progress!</p>
              <button
                onClick={() => navigate('/student/tests')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
              >
                View Upcoming Tests
              </button>
            </div>
          ) : (
            attempts.slice(0, 5).map((attempt, i) => (
              <div
                key={i}
                className={`mb-3 last:mb-0 bg-blue-50 border-2 border-blue-200 rounded-xl p-3 hover:shadow-md transition-all duration-300 cursor-pointer`}
                onClick={() => navigate(`/student/attempt/${attempt._id}`)}
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">{attempt.testId?.testTitle || 'Test'}</span>
                    <p className="text-xs text-gray-500 mt-1">{getRelativeTime(attempt.createdAt)}</p>
                  </div>
                  <span className="font-bold text-blue-600">
                    {attempt.percentage ? Math.round(attempt.percentage) : 0}%
                  </span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${attempt.percentage || 0}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </section>

      </main>
    </div>
  );
}