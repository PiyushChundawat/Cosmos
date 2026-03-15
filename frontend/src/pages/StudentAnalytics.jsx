import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import Card from '../components/Card';
import Chart from '../components/Chart';
import Input from '../components/Input';
import Button from '../components/Button';
import HomeButton from '../components/HomeButton';
import { studentAnalyticsAPI } from '../services/api';

export default function StudentAnalytics() {
  const [filters, setFilters] = useState({ testId: '', subject: '' });
  const [performanceData, setPerformanceData] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgScore: 0,
    passRate: 0,
    avgAttempts: 0
  });

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('tpo_token');
    console.log('TPO Token:', token ? 'exists' : 'missing');
    if (!token) {
      console.error('No token found, redirecting to login');
      window.location.href = '/tpo/login';
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = {};
      if (filters.testId) params.testId = filters.testId;
      if (filters.subject) params.subject = filters.subject;

      // Fetch performance bands
      const performanceRes = await studentAnalyticsAPI.getPerformanceBands(params);
      const performanceBandsData = performanceRes.data.data || performanceRes.data;

      // Fetch top performers
      const topRes = await studentAnalyticsAPI.getTopPerformers(params);
      const topPerformersData = topRes.data.data || topRes.data || [];

      // Transform performance bands data for charts
      const below40Count = performanceBandsData.below_40?.length || 0;
      const between40_70Count = performanceBandsData.between_40_70?.length || 0;
      const above70Count = performanceBandsData.above_70?.length || 0;

      const chartData = {
        labels: ['Below 40%', '40-70%', 'Above 70%'],
        datasets: [
          {
            label: 'Student Count',
            data: [below40Count, between40_70Count, above70Count],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            borderColor: ['#dc2626', '#d97706', '#059669'],
            borderWidth: 2,
          },
        ],
      };

      setPerformanceData(chartData);

      // Transform top performers data for table
      const formattedTopPerformers = topPerformersData.map((performer, index) => ({
        rank: index + 1,
        name: performer.studentName || 'N/A',
        rollNumber: performer.rollNumber || 'N/A',
        score: performer.totalScore,
        percentage: performer.avgPercentage,
        attempts: performer.attemptCount
      }));

      setTopPerformers(formattedTopPerformers);

      // Calculate summary statistics
      const totalStudents = below40Count + between40_70Count + above70Count;
      const passCount = between40_70Count + above70Count; // Students with 40% or more
      const passRate = totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(0) : 0;

      // Calculate average score from top performers (or all students if available)
      const avgScore = topPerformersData.length > 0
        ? (topPerformersData.reduce((sum, p) => sum + p.avgPercentage, 0) / topPerformersData.length).toFixed(1)
        : 0;

      // Calculate average attempts
      const avgAttempts = topPerformersData.length > 0
        ? (topPerformersData.reduce((sum, p) => sum + p.attemptCount, 0) / topPerformersData.length).toFixed(1)
        : 0;

      setStats({
        totalStudents,
        avgScore,
        passRate,
        avgAttempts
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Reset to empty state on error
      setPerformanceData(null);
      setTopPerformers([]);
      setStats({
        totalStudents: 0,
        avgScore: 0,
        passRate: 0,
        avgAttempts: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

          <div className="fixed top-4 right-4 z-50">
            <HomeButton />
          </div>

          <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* FILTERS (INDIGO) */}
        <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md">
          <h2 className="text-xl font-bold text-indigo-600 mb-4">📋 Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test ID</label>
              <input
                type="text"
                name="testId"
                value={filters.testId}
                onChange={handleFilterChange}
                placeholder="Enter test ID"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                placeholder="Enter subject"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 transition"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchData}
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md font-medium"
              >
                {loading ? 'Loading...' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </section>

        {/* CHARTS (EMERALD) */}
        <section>
          <h2 className="text-xl font-bold text-emerald-600 mb-4">📊 Performance Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="font-bold text-emerald-800 text-base mb-4">Performance Distribution</h3>
              {performanceData ? (
                <Chart
                  type="bar"
                  data={performanceData}
                  options={chartOptions}
                  title="Students by Performance Band"
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  {loading ? 'Loading...' : 'No data available'}
                </div>
              )}
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="font-bold text-emerald-800 text-base mb-4">Performance Pie Chart</h3>
              {performanceData ? (
                <Chart
                  type="pie"
                  data={performanceData}
                  title="Performance Distribution %"
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  {loading ? 'Loading...' : 'No data available'}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TOP PERFORMERS (BLUE) */}
        <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md">
          <h2 className="text-xl font-bold text-blue-600 mb-4">🏆 Top 5 Performers</h2>
          <div className="overflow-x-auto">
            {topPerformers.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-50 text-gray-900">
                    <th className="px-4 py-2 text-left text-sm font-semibold">Rank</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Student Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Roll Number</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Score</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Percentage</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Attempts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topPerformers.map((performer) => (
                    <tr
                      key={performer.rank}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-block w-8 h-8 bg-blue-600 text-white rounded-full text-center text-sm font-bold leading-8">
                          {performer.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {performer.name}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {performer.rollNumber}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{performer.score}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {performer.percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{performer.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                {loading ? 'Loading...' : 'No top performers data available'}
              </div>
            )}
          </div>
        </section>

        {/* SUMMARY STATS (COLORFUL) */}
        <section>
          <h2 className="text-xl font-bold text-violet-600 mb-4">📈 Summary Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Students", value: stats.totalStudents, gradient: "from-purple-500 to-pink-600", textColor: "text-purple-100" },
              { label: "Average Score", value: stats.avgScore, gradient: "from-emerald-500 to-teal-600", textColor: "text-emerald-100" },
              { label: "Pass Rate", value: `${stats.passRate}%`, gradient: "from-orange-500 to-red-600", textColor: "text-orange-100" },
              { label: "Avg Attempts", value: stats.avgAttempts, gradient: "from-blue-500 to-indigo-600", textColor: "text-blue-100" },
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

          </main>
        </div>
      </div>
    </div>
  );
}
