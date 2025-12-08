import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chart from '../../components/Chart';

export default function TPODashboard() {
  const navigate = useNavigate();
  const collegeName = localStorage.getItem('tpo_college') || 'College';
  const userName = localStorage.getItem('tpo_user') || 'User';
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Student Analytics Data
  const studentPerformanceData = {
    labels: ['Below 40%', '40-70%', 'Above 70%'],
    datasets: [
      {
        label: 'Student Count',
        data: [45, 120, 85],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: ['#dc2626', '#d97706', '#059669'],
        borderWidth: 2,
      },
    ],
  };

  const topStudents = [
    { rank: 1, name: 'Aarav Sharma', score: 95, percentage: 95, attempts: 5, subject: 'Mathematics' },
    { rank: 2, name: 'Priya Singh', score: 92, percentage: 92, attempts: 4, subject: 'Physics' },
    { rank: 3, name: 'Arjun Patel', score: 89, percentage: 89, attempts: 3, subject: 'Chemistry' },
    { rank: 4, name: 'Diya Verma', score: 87, percentage: 87, attempts: 4, subject: 'Biology' },
    { rank: 5, name: 'Rohan Kumar', score: 85, percentage: 85, attempts: 3, subject: 'English' },
  ];

  // Mock Faculty Analytics Data
  const facultyPerformanceData = {
    labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    datasets: [
      {
        label: 'Avg Student Score',
        data: [85, 78, 82, 88, 75],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: '#10b981',
        borderWidth: 2,
      },
    ],
  };

  const facultyStats = [
    { name: 'Dr. Rajesh Kumar', subject: 'Mathematics', avgScore: 85, students: 45, attempts: 180 },
    { name: 'Prof. Anjali Singh', subject: 'Physics', avgScore: 78, students: 42, attempts: 168 },
    { name: 'Dr. Vikram Patel', subject: 'Chemistry', avgScore: 82, students: 40, attempts: 160 },
    { name: 'Prof. Meera Sharma', subject: 'Biology', avgScore: 88, students: 38, attempts: 152 },
    { name: 'Dr. Arjun Mishra', subject: 'English', avgScore: 75, students: 50, attempts: 200 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('tpo_token');
    localStorage.removeItem('tpo_college');
    localStorage.removeItem('tpo_user');
    navigate('/tpo/login', { replace: true });
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 150,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b-4 border-emerald-600 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-emerald-600">TPO</span> Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">{collegeName} • Welcome, {userName}</p>
            </div>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'border-b-4 border-emerald-600 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'student'
                  ? 'border-b-4 border-emerald-600 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👨‍🎓 Student Analytics
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'faculty'
                  ? 'border-b-4 border-emerald-600 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👨‍🏫 Faculty Analytics
            </button>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome Section */}
              <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TPO Portal</h2>
                <p className="text-gray-600">
                  Manage placements, track student and faculty performance, and access detailed analytics
                </p>
              </Card>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-medium">Total Students</p>
                    <p className="text-4xl font-bold text-emerald-700 mt-2">250</p>
                    <p className="text-gray-500 text-xs mt-2">Across all programs</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-medium">Faculty Members</p>
                    <p className="text-4xl font-bold text-emerald-700 mt-2">15</p>
                    <p className="text-gray-500 text-xs mt-2">Active instructors</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-medium">Avg Score</p>
                    <p className="text-4xl font-bold text-emerald-700 mt-2">78.5</p>
                    <p className="text-gray-500 text-xs mt-2">Overall average</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-medium">Pass Rate</p>
                    <p className="text-4xl font-bold text-emerald-700 mt-2">92%</p>
                    <p className="text-gray-500 text-xs mt-2">Success rate</p>
                  </div>
                </Card>
              </div>

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card 
                  title="📊 Student Analytics" 
                  icon="📊"
                  className="cursor-pointer hover:shadow-xl transition-all"
                >
                  <p className="text-gray-600 mb-4">View performance distribution, top performers, and student insights</p>
                  <Button 
                    size="sm"
                    onClick={() => setActiveTab('student')}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </Card>

                <Card 
                  title="📈 Faculty Analytics" 
                  icon="📈"
                  className="cursor-pointer hover:shadow-xl transition-all"
                >
                  <p className="text-gray-600 mb-4">Subject-wise performance, faculty insights, and detailed breakdowns</p>
                  <Button 
                    size="sm"
                    onClick={() => setActiveTab('faculty')}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </Card>
              </div>
            </>
          )}

          {/* STUDENT ANALYTICS TAB */}
          {activeTab === 'student' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">👨‍🎓 Student Analytics</h2>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card title="📊 Performance Distribution">
                  <Chart
                    type="bar"
                    data={studentPerformanceData}
                    options={chartOptions}
                    title="Students by Performance Band"
                  />
                </Card>

                <Card title="📈 Performance Pie Chart">
                  <Chart
                    type="pie"
                    data={studentPerformanceData}
                    title="Performance Distribution %"
                  />
                </Card>
              </div>

              {/* Top Performers Table */}
              <Card title="🏆 Top 5 Performers">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                        <th className="px-6 py-3 text-left text-sm font-semibold">Rank</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Score</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Percentage</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Attempts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topStudents.map((student) => (
                        <tr key={student.rank} className="hover:bg-emerald-50 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="inline-block w-8 h-8 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full text-center text-sm font-bold leading-8">
                              {student.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 group-hover:text-emerald-700">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 text-gray-700">{student.subject}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">{student.score}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                              {student.percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{student.attempts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {/* FACULTY ANALYTICS TAB */}
          {activeTab === 'faculty' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">👨‍🏫 Faculty Analytics</h2>

              {/* Faculty Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-medium">Total Faculty</p>
                    <p className="text-4xl font-bold text-emerald-700 mt-2">15</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-medium">Avg Faculty Score</p>
                    <p className="text-4xl font-bold text-emerald-700 mt-2">81.6</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-medium">Total Students</p>
                    <p className="text-4xl font-bold text-emerald-700 mt-2">215</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
                    <p className="text-4xl font-bold text-emerald-700 mt-2">860</p>
                  </div>
                </Card>
              </div>

              {/* Subject Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card title="📊 Subject-wise Performance">
                  <Chart
                    type="bar"
                    data={facultyPerformanceData}
                    options={chartOptions}
                    title="Average Score by Subject"
                  />
                </Card>

                <Card title="📈 Subject Distribution">
                  <Chart
                    type="doughnut"
                    data={{
                      labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
                      datasets: [
                        {
                          data: [45, 42, 40, 38, 50],
                          backgroundColor: [
                            '#10b981',
                            '#3b82f6',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6',
                          ],
                          borderColor: '#fff',
                          borderWidth: 2,
                        },
                      ],
                    }}
                    title="Students per Subject"
                  />
                </Card>
              </div>

              {/* Faculty Details Table */}
              <Card title="👨‍🏫 Faculty Performance Breakdown">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                        <th className="px-6 py-3 text-left text-sm font-semibold">Faculty Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Avg Score</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Students</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Total Attempts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {facultyStats.map((faculty, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50 transition-colors group">
                          <td className="px-6 py-4 font-semibold text-gray-900 group-hover:text-emerald-700">
                            {faculty.name}
                          </td>
                          <td className="px-6 py-4 text-gray-700">{faculty.subject}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                              {faculty.avgScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">{faculty.students}</td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">{faculty.attempts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}