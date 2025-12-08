import React from 'react';

export default function Performance() {
  const stats = [
    { title: 'Average Percentage', value: '78.5%', icon: '📊', color: 'emerald' },
    { title: 'Tests Attempted', value: '12', icon: '✅', color: 'blue' },
    { title: 'Highest Score', value: '95%', icon: '🏆', color: 'yellow' },
    { title: 'Tests Passed', value: '10', icon: '✔️', color: 'green' },
  ];

  const recentAttempts = [
    { id: 1, testName: 'Aptitude Test', date: '2025-12-05', score: 85, total: 100, percentage: 85, status: 'Passed' },
    { id: 2, testName: 'Technical Assessment', date: '2025-12-03', score: 72, total: 100, percentage: 72, status: 'Passed' },
    { id: 3, testName: 'Coding Challenge', date: '2025-12-01', score: 65, total: 100, percentage: 65, status: 'Passed' },
    { id: 4, testName: 'English Communication', date: '2025-11-28', score: 38, total: 50, percentage: 76, status: 'Passed' },
    { id: 5, testName: 'Logical Reasoning', date: '2025-11-25', score: 90, total: 100, percentage: 90, status: 'Passed' },
  ];

  const getStatusColor = (status) => {
    return status === 'Passed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">📊 Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Track your test results and progress</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
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

        {/* Graph Placeholder */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Score Trend</h2>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-12 border-2 border-emerald-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Performance Graph</h3>
              <p className="text-gray-600">Your score progression over time</p>
              <div className="mt-8 h-64 flex items-end justify-around gap-4">
                {[65, 72, 68, 85, 78, 90, 85, 88, 95, 82, 76, 85].map((score, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="text-xs font-semibold text-emerald-700 mb-1">{score}%</div>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-green-500 rounded-t-lg transition-all hover:from-emerald-700 hover:to-green-600"
                      style={{ height: `${(score / 100) * 240}px` }}
                    />
                    <div className="text-xs text-gray-500 mt-2">T{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Attempts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Recent Test Attempts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Test Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Percentage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAttempts.map((attempt, index) => (
                  <tr key={attempt.id} className="hover:bg-emerald-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{attempt.testName}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{attempt.date}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {attempt.score}/{attempt.total}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                        {attempt.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(attempt.status)}`}>
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">🎯 Strong Areas</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <span className="text-lg">Logical Reasoning (90% avg)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <span className="text-lg">Aptitude Tests (85% avg)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <span className="text-lg">Problem Solving (82% avg)</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">📚 Areas to Improve</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-2xl">!</span>
                <span className="text-lg">Coding Challenges (65% avg)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">!</span>
                <span className="text-lg">Technical Assessment (72% avg)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">!</span>
                <span className="text-lg">Communication (76% avg)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
