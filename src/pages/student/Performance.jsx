import React from 'react';
import HomeButton from '../../components/HomeButton';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => {
            const gradients = [
              "from-purple-500 to-pink-600",
              "from-emerald-500 to-teal-600", 
              "from-orange-500 to-red-600",
              "from-blue-500 to-indigo-600"
            ];
            const textColors = [
              "text-purple-100",
              "text-emerald-100",
              "text-orange-100", 
              "text-blue-100"
            ];
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${gradients[index]} rounded-2xl p-4 text-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300`}
              >
                <p className={`text-xs ${textColors[index]} font-medium`}>{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-6">Score Trend</h2>
          <div className="h-64 flex items-end justify-between gap-3">
            {trendScores.map((score, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  {score}%
                </div>
                <div
                  className="w-full bg-indigo-600 rounded-t-xl"
                  style={{ height: `${(score / 100) * 220}px` }}
                />
                <div className="text-xs text-gray-500 mt-2">
                  T{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-indigo-200">
            <h2 className="text-xl font-bold text-indigo-800">Recent Test Attempts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-indigo-50 text-indigo-800">
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Test Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Score</th>
                  <th className="px-4 py-3 text-left font-semibold">Percentage</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-200">
                {recentAttempts.map((attempt, index) => (
                  <tr key={attempt.id} className="hover:bg-indigo-50 transition">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">
                        {attempt.testName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {attempt.date}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">
                        {attempt.score}/{attempt.total}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold text-lg ${getScoreColor(
                          attempt.percentage
                        )}`}
                      >
                        {attempt.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          attempt.status
                        )}`}
                      >
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">Strong Areas</h3>
            <ul className="space-y-3 text-gray-700">
              <li>Logical Reasoning: 90% average</li>
              <li>Aptitude Tests: 85% average</li>
              <li>Problem Solving: 82% average</li>
            </ul>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">Areas to Improve</h3>
            <ul className="space-y-3 text-gray-700">
              <li>Coding Challenges: 65% average</li>
              <li>Technical Assessment: 72% average</li>
              <li>Communication: 76% average</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
