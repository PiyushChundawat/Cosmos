import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Chart from '../components/Chart';
import Input from '../components/Input';
import Button from '../components/Button';
import { facultyAnalyticsAPI } from '../services/api';

export default function FacultyAnalytics() {
  const [subject, setSubject] = useState('');
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const mockPerformanceBands = {
    labels: ['Below 40%', '40-70%', 'Above 70%'],
    datasets: [
      {
        label: 'Student Count',
        data: [30, 95, 125],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: ['#dc2626', '#d97706', '#059669'],
        borderWidth: 2,
      },
    ],
  };

  const mockSummary = {
    avgScore: 82.3,
    avgPercentage: 82.3,
    totalAttempts: 1200,
    totalStudents: 250,
    topicWiseData: [
      { topic: 'Algebra', avgScore: 85, attempts: 240 },
      { topic: 'Geometry', avgScore: 78, attempts: 210 },
      { topic: 'Calculus', avgScore: 88, attempts: 300 },
      { topic: 'Statistics', avgScore: 75, attempts: 200 },
      { topic: 'Trigonometry', avgScore: 81, attempts: 250 },
    ],
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
      },
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with actual when backend is ready
      // const perfRes = await facultyAnalyticsAPI.getPerformanceBands(subject);
      // const completeRes = await facultyAnalyticsAPI.getComplete(subject);
      // setData(perfRes.data);
      // setSummary(completeRes.data);

      setData(mockPerformanceBands);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    fetchData();
  };

  const topicChartData = {
    labels: mockSummary?.topicWiseData?.map(t => t.topic) || [],
    datasets: [
      {
        label: 'Average Score',
        data: mockSummary?.topicWiseData?.map(t => t.avgScore) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: '#10b981',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <header className="bg-white shadow-sm border-b-4 border-emerald-600 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-emerald-600">Faculty</span> Analytics
            </h1>
            <p className="text-gray-600 text-sm mt-1">Subject & performance analysis</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Subject Filter */}
          <Card className="mb-8" title="🔍 Filter by Subject">
            <div className="flex gap-4">
              <Input
                label="Select Subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics"
              />
              <div className="flex items-end">
                <Button onClick={handleApplyFilter} loading={loading}>
                  Apply Filter
                </Button>
              </div>
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Average Score</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{summary?.avgScore || 0}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Avg Percentage</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{summary?.avgPercentage || 0}%</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{summary?.totalAttempts || 0}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{summary?.totalStudents || 0}</p>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card title="📊 Performance Distribution">
              {data && <Chart type="doughnut" data={data} />}
            </Card>

            <Card title="📈 Topic-wise Performance">
              {mockSummary && <Chart type="bar" data={topicChartData} options={chartOptions} />}
            </Card>
          </div>

          {/* Topic Wise Breakdown Table */}
          <Card title="📋 Topic-wise Breakdown">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Topic</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Avg Score</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total Attempts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockSummary?.topicWiseData?.map((topic) => (
                    <tr
                      key={topic.topic}
                      className="hover:bg-emerald-50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 group-hover:text-emerald-700">
                        {topic.topic}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                          {topic.avgScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">{topic.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}