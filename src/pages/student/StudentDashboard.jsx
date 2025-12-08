import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const studentName = localStorage.getItem('student_name') || 'Student';

  const stats = [
    { title: 'Tests Attempted', value: '12', icon: '✅', color: 'from-blue-500 to-blue-600' },
    { title: 'Average Score', value: '78%', icon: '📈', color: 'from-green-500 to-green-600' },
    { title: 'Resume Score', value: '85/100', icon: '📄', color: 'from-purple-500 to-purple-600' },
    { title: 'Upcoming Tests', value: '3', icon: '⏰', color: 'from-orange-500 to-orange-600' },
  ];

  const quickActions = [
    {
      title: 'View Upcoming Tests',
      description: 'Check scheduled tests and prepare',
      icon: '📝',
      color: 'from-emerald-500 to-green-500',
      path: '/student/tests',
    },
    {
      title: 'Go to Performance',
      description: 'Analyze your test results',
      icon: '📊',
      color: 'from-blue-500 to-indigo-500',
      path: '/student/performance',
    },
    {
      title: 'Resume Analysis',
      description: 'Upload and analyze your resume',
      icon: '📄',
      color: 'from-purple-500 to-pink-500',
      path: '/student/resume',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi, {studentName} 👋
          </h1>
          <p className="text-gray-600 mt-1">Welcome to your placement dashboard</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`bg-gradient-to-r ${action.color} p-6 text-center`}>
                  <div className="text-6xl mb-2">{action.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                  <button className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-2 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all">
                    Go Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl">✅</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Completed Aptitude Test</p>
                <p className="text-sm text-gray-600">Score: 85/100 • 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl">📄</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Resume Analyzed</p>
                <p className="text-sm text-gray-600">Score improved to 85/100 • 3 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl">📝</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Coding Test Scheduled</p>
                <p className="text-sm text-gray-600">Date: Dec 15, 2025 • Time: 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
