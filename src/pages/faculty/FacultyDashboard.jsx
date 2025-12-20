import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/faculty/Card';
import Table from '../../components/faculty/Table';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    countTotal: 0,
    averageTestScore: 0,
    upcomingTestCount: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const facultyName = localStorage.getItem('facultyName') || 'Faculty';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [statsRes, recentRes, upcomingRes] = await Promise.all([
        api.get('/faculty/dashboard/stats'),
        api.get('/faculty/dashboard/recentTest'),
        api.get('/faculty/dashboard/upcoming-test')
      ]);

      // Set stats
      setStats({
        countTotal: statsRes.data.countTotal || 0,
        averageTestScore: Math.round(statsRes.data.averageTestScore || 0),
        upcomingTestCount: statsRes.data.upcomingTestCount || 0
      });

      // Set recent tests - format the data
      const formattedRecentTests = recentRes.data.data?.map(test => ({
        id: test._id,
        title: test.testTitle || test.title || 'Untitled Test',
        date: test.createdAt ? new Date(test.createdAt).toLocaleDateString('en-IN') : 'N/A',
        attempts: test.attempts || 0,
        avgScore: test.avgScore || 0
      })) || [];
      setRecentTests(formattedRecentTests);

      // Set upcoming tests - format the data
      const formattedUpcomingTests = upcomingRes.data.data?.map(test => ({
        id: test._id,
        title: test.testTitle || test.title || 'Untitled Test',
        startDate: test.schedule?.startDate 
          ? new Date(test.schedule.startDate).toLocaleDateString('en-IN')
          : 'Not scheduled',
        duration: test.duration ? `${test.duration} mins` : 'N/A'
      })) || [];
      setUpcomingTests(formattedUpcomingTests);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const recentTestColumns = [
    { header: 'Test Title', accessor: 'title' },
    { header: 'Date', accessor: 'date' },
    { header: 'Attempts', accessor: 'attempts' },
    { header: 'Avg Score', render: (row) => `${row.avgScore}%` }
  ];

  const upcomingTestColumns = [
    { header: 'Test Title', accessor: 'title' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'Duration', accessor: 'duration' }
  ];

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
            <button
              onClick={fetchDashboardData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* STATS (COLORFUL) */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: "Total Tests", value: stats.countTotal, gradient: "from-purple-500 to-pink-600", textColor: "text-purple-100" },
              { label: "Average Score", value: `${stats.averageTestScore}%`, gradient: "from-emerald-500 to-teal-600", textColor: "text-emerald-100" },
              { label: "Upcoming Tests", value: stats.upcomingTestCount, gradient: "from-orange-500 to-red-600", textColor: "text-orange-100" },
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

        {/* RECENT TESTS (BLUE) */}
        <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md">
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            Recent Tests
          </h2>

          {recentTests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No recent tests available. Create your first test!</p>
              <button
                onClick={() => navigate('/faculty/tests')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
              >
                Create Test
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTests.map((test, i) => (
                <div
                  key={i}
                  className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/faculty/tests/${test.id}/analytics`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-800 text-base">{test.title}</span>
                      <p className="text-xs text-gray-500 mt-1">{test.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-600 text-lg">{test.attempts}</span>
                      <p className="text-xs text-gray-600">attempts</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Score: {Math.round(test.avgScore)}%</span>
                    <div className="h-2 bg-gray-200 rounded-full w-24 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${test.avgScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* UPCOMING TESTS (EMERALD) */}
        <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md">
          <h2 className="text-xl font-bold text-emerald-600 mb-4">
            Upcoming Tests
          </h2>

          {upcomingTests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No upcoming tests scheduled.</p>
              <button
                onClick={() => navigate('/faculty/tests')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
              >
                Schedule Test
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTests.map((test, i) => (
                <div
                  key={i}
                  className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/faculty/tests')}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-gray-800 text-base">{test.title}</span>
                      <p className="text-xs text-gray-500 mt-1">{test.startDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 text-lg">{test.duration}</span>
                      <p className="text-xs text-gray-600">minutes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* QUICK ACTIONS (VIOLET) */}
        <section>
          <h2 className="text-xl font-bold text-violet-600 mb-4">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { title: "Create Test", desc: "Design new assessments", path: "/faculty/tests", color: "violet" },
              { title: "Manage Questions", desc: "Add and organize questions", path: "/faculty/questions", color: "violet" },
              { title: "View Analytics", desc: "Track student performance", path: "/faculty/analytics", color: "violet" }
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

      </main>
    </div>
  );
};

export default FacultyDashboard;