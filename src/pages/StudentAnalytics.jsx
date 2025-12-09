import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Chart from '../components/Chart';
import Input from '../components/Input';
import Button from '../components/Button';
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
      const performanceBandsData = performanceRes.data;

      // Fetch top performers
      const topRes = await studentAnalyticsAPI.getTopPerformers(params);
      const topPerformersData = topRes.data;

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
        name: performer.studentId, // Replace with actual name if available from populated data
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <header className="bg-white shadow-sm border-b-4 border-emerald-600 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-emerald-600">Student</span> Analytics
            </h1>
            <p className="text-gray-600 text-sm mt-1">Performance insights & trends</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <Card className="mb-8" title="📋 Filters">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Test ID"
                name="testId"
                value={filters.testId}
                onChange={handleFilterChange}
                placeholder="Enter test ID"
              />
              <Input
                label="Subject"
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                placeholder="Enter subject"
              />
              <div className="flex items-end">
                <Button onClick={fetchData} loading={loading} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card title="📊 Performance Distribution">
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
            </Card>

            <Card title="📈 Performance Pie Chart">
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
            </Card>
          </div>

          {/* Top Performers Table */}
          <Card title="🏆 Top 5 Performers">
            <div className="overflow-x-auto">
              {topPerformers.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                      <th className="px-6 py-3 text-left text-sm font-semibold">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Student ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Score</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Percentage</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Attempts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topPerformers.map((performer) => (
                      <tr
                        key={performer.rank}
                        className="hover:bg-emerald-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-block w-8 h-8 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full text-center text-sm font-bold leading-8">
                            {performer.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 group-hover:text-emerald-700">
                          {performer.name}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{performer.score}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                            {performer.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{performer.attempts}</td>
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
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{stats.totalStudents}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Avg Score</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{stats.avgScore}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Pass Rate</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{stats.passRate}%</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Avg Attempts</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{stats.avgAttempts}</p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}