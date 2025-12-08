import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const studentName = localStorage.getItem('studentName') || 'Student';

  const stats = [
    { title: 'Tests Attempted', value: '12' },
    { title: 'Average Score', value: '78%' },
    { title: 'Resume Score', value: '85/100' },
    { title: 'Upcoming Tests', value: '3' },
  ];

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
      path: '/student/resume',
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi, {studentName}
          </h1>
          <p className="text-gray-600 mt-1">Welcome to your placement dashboard</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6"
            >
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quickActions.map((action, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 cursor-pointer"
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

          <div className="space-y-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">Completed Aptitude Test</p>
              <p className="text-sm text-gray-600">Score: 85/100 • 2 days ago</p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">Resume Analyzed</p>
              <p className="text-sm text-gray-600">Score updated to 85 • 3 days ago</p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">Coding Test Scheduled</p>
              <p className="text-sm text-gray-600">Dec 15, 2025 • 10:00 AM</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
