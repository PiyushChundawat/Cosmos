import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/faculty/Card';
import Table from '../../components/faculty/Table';

const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    countTotal: 0,
    averageTestScore: 0,
    upcomingTestCount: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const facultyName = localStorage.getItem('facultyName') || 'Faculty';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Using mock data (no backend)
    setStats({
      countTotal: 12,
      averageTestScore: 78.5,
      upcomingTestCount: 3
    });
    
    setRecentTests([
      { id: 1, title: 'Data Structures Mid-Term', date: '2025-12-01', attempts: 45, avgScore: 82 },
      { id: 2, title: 'Algorithms Quiz 3', date: '2025-11-28', attempts: 52, avgScore: 75 },
      { id: 3, title: 'Database Systems Final', date: '2025-11-25', attempts: 38, avgScore: 88 }
    ]);
    
    setUpcomingTests([
      { id: 4, title: 'Operating Systems Quiz', startDate: '2025-12-10', duration: '60 mins' },
      { id: 5, title: 'Computer Networks Test', startDate: '2025-12-12', duration: '90 mins' },
      { id: 6, title: 'Software Engineering Mid', startDate: '2025-12-15', duration: '120 mins' }
    ]);
    
    setLoading(false);
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
        <div className="text-emerald-600 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome, {facultyName}! 👋</h1>
        <p className="mt-2 text-emerald-50">Manage your tests, questions, and track student performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Tests</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.countTotal}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Score</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats.averageTestScore}%</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Upcoming Tests</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.upcomingTestCount}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tests Table */}
      <Card title="Recent Tests">
        <Table columns={recentTestColumns} data={recentTests} />
      </Card>

      {/* Upcoming Tests Table */}
      <Card title="Upcoming Tests">
        <Table columns={upcomingTestColumns} data={upcomingTests} />
      </Card>
    </div>
  );
};

export default FacultyDashboard;
