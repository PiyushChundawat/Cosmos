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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-600 font-semibold text-lg mb-4">⚠️ {error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {facultyName}</h1>
        <p className="mt-2 text-gray-600">Manage your tests, questions, and track student performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Tests</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{stats.countTotal}</p>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Average Score</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{stats.averageTestScore}%</p>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Upcoming Tests</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{stats.upcomingTestCount}</p>
          </div>
        </Card>
      </div>

      {/* Recent Tests Table */}
      <Card title="Recent Tests">
        {recentTests.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No recent tests available
          </div>
        ) : (
          <Table columns={recentTestColumns} data={recentTests} />
        )}
      </Card>

      {/* Upcoming Tests Table */}
      <Card title="Upcoming Tests">
        {upcomingTests.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No upcoming tests scheduled
          </div>
        ) : (
          <Table columns={upcomingTestColumns} data={upcomingTests} />
        )}
      </Card>
    </div>
  );
};

export default FacultyDashboard;