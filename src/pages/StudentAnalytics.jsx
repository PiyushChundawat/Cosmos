import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Chart from '../components/Chart';
import Input from '../components/Input';
import Button from '../components/Button';
import { studentAnalyticsAPI } from '../services/api';

export default function StudentAnalytics() {
  const [filters, setFilters] = useState({ testId: '', subject: '' });
  const [data, setData] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockPerformanceBands = {
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

  const mockTopPerformers = [
    { rank: 1, name: 'Aarav Sharma', score: 95, percentage: 95, attempts: 5 },
    { rank: 2, name: 'Priya Singh', score: 92, percentage: 92, attempts: 4 },
    { rank: 3, name: 'Arjun Patel', score: 89, percentage: 89, attempts: 3 },
    { rank: 4, name: 'Diya Verma', score: 87, percentage: 87, attempts: 4 },
    { rank: 5, name: 'Rohan Kumar', score: 85, percentage: 85, attempts: 3 },
  ];

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with actual API calls when backend is ready
      // const performanceRes = await studentAnalyticsAPI.getPerformanceBands(filters.testId, filters.subject);
      // const topRes = await studentAnalyticsAPI.getTopPerformers();
      // setData(performanceRes.data);
      // setTopPerformers(topRes.data);

      // Using mock data for demonstration
      setData(mockPerformanceBands);
      setTopPerformers(mockTopPerformers);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
              {data && (
                <Chart
                  type="bar"
                  data={data}
                  options={chartOptions}
                  title="Students by Performance Band"
                />
              )}
            </Card>

            <Card title="📈 Performance Pie Chart">
              {data && (
                <Chart
                  type="pie"
                  data={data}
                  title="Performance Distribution %"
                />
              )}
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
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">250</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Avg Score</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">78.5</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Pass Rate</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">92%</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Avg Attempts</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">3.8</p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}