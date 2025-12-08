import React from 'react';

export default function Performance() {
  const stats = [
    { title: 'Average Percentage', value: '78.5%' },
    { title: 'Tests Attempted', value: '12' },
    { title: 'Highest Score', value: '95%' },
    { title: 'Tests Passed', value: '10' },
  ];

  const recentAttempts = [
    { id: 1, testName: 'Aptitude Test', date: '2025-12-05', score: 85, total: 100, percentage: 85, status: 'Passed' },
    { id: 2, testName: 'Technical Assessment', date: '2025-12-03', score: 72, total: 100, percentage: 72, status: 'Passed' },
    { id: 3, testName: 'Coding Challenge', date: '2025-12-01', score: 65, total: 100, percentage: 65, status: 'Passed' },
    { id: 4, testName: 'English Communication', date: '2025-11-28', score: 38, total: 50, percentage: 76, status: 'Passed' },
    { id: 5, testName: 'Logical Reasoning', date: '2025-11-25', score: 90, total: 100, percentage: 90, status: 'Passed' },
  ];

  const getStatusColor = (status) =>
    status === 'Passed'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const trendScores = [65, 72, 68, 85, 78, 90, 85, 88, 95, 82, 76, 85];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Track your test results and progress</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6"
            >
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Score Trend</h2>
          <div className="h-64 flex items-end justify-between gap-3">
            {trendScores.map((score, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  {score}%
                </div>
                <div
                  className="w-full bg-emerald-600 rounded-t-lg"
                  style={{ height: `${(score / 100) * 220}px` }}
                />
                <div className="text-xs text-gray-500 mt-2">
                  T{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Recent Test Attempts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-800">
                  <th className="px-6 py-3 text-left font-semibold">#</th>
                  <th className="px-6 py-3 text-left font-semibold">Test Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Score</th>
                  <th className="px-6 py-3 text-left font-semibold">Percentage</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAttempts.map((attempt, index) => (
                  <tr key={attempt.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {attempt.testName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {attempt.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {attempt.score}/{attempt.total}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold text-lg ${getScoreColor(
                          attempt.percentage
                        )}`}
                      >
                        {attempt.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          attempt.status
                        )}`}
                      >
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-700 font-semibold">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Strong Areas</h3>
            <ul className="space-y-3 text-gray-700">
              <li>Logical Reasoning: 90% average</li>
              <li>Aptitude Tests: 85% average</li>
              <li>Problem Solving: 82% average</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Areas to Improve</h3>
            <ul className="space-y-3 text-gray-700">
              <li>Coding Challenges: 65% average</li>
              <li>Technical Assessment: 72% average</li>
              <li>Communication: 76% average</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
