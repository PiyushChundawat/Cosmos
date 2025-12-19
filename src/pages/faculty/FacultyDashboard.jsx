import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/faculty/Card';
import Table from '../../components/faculty/Table';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
              ⚠️ {error}
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {facultyName}</h1>
          <p className="text-gray-600">Manage your tests, questions, and track student performance</p>
        </div>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tests</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.countTotal}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Score</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.averageTestScore}%</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Tests</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.upcomingTestCount}</p>
              </div>
            </div>
          </div>

          {/* Recent Tests Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Tests</h2>
            {recentTests.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No recent tests available
              </div>
            ) : (
              <Table columns={recentTestColumns} data={recentTests} />
            )}
          </div>

          {/* Upcoming Tests Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tests</h2>
            {upcomingTests.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No upcoming tests scheduled
              </div>
            ) : (
              <Table columns={upcomingTestColumns} data={upcomingTests} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;