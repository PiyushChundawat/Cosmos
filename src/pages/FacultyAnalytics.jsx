import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ⚠️ CONFIGURE THIS
const API_BASE_URL = 'http://localhost:5000/api';

export default function FacultyAnalytics() {
  const [subject, setSubject] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/faculty/login';
      return;
    }
  }, []);

  const fetchData = async () => {
    if (!subject.trim()) {
      alert('Please enter a subject name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/analytics/faculty/complete?subject=${encodeURIComponent(subject)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Failed to load analytics');
      
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/faculty/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    fetchData();
  };

  // Prepare chart data from API response
  const getPerformanceBandsChart = () => {
    if (!data?.performanceBands) return null;

    const below40Count = data.performanceBands.below_40?.length || 0;
    const between40_70Count = data.performanceBands.between_40_70?.length || 0;
    const above70Count = data.performanceBands.above_70?.length || 0;

    return {
      labels: ['Below 40%', '40-70%', 'Above 70%'],
      data: [below40Count, between40_70Count, above70Count],
      colors: ['#ef4444', '#f59e0b', '#10b981']
    };
  };

  const chartData = getPerformanceBandsChart();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b-4 border-emerald-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-emerald-600">Faculty</span> Analytics
          </h1>
          <p className="text-gray-600 text-sm mt-1">Subject & performance analysis</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Subject Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Filter by Subject</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Subject Name
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics, Physics, Chemistry"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleApplyFilter}
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Apply Filter'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Show results only after fetching */}
        {data && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Average Score</p>
                  <p className="text-4xl font-bold text-emerald-700 mt-2">
                    {data.overallStats?.avgScore || 0}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Avg Percentage</p>
                  <p className="text-4xl font-bold text-emerald-700 mt-2">
                    {data.overallStats?.avgPercentage || 0}%
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
                  <p className="text-4xl font-bold text-emerald-700 mt-2">
                    {data.overallStats?.totalAttempts || 0}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Total Students</p>
                  <p className="text-4xl font-bold text-emerald-700 mt-2">
                    {data.overallStats?.totalStudents || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Performance Bands Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Performance Distribution</h2>
                {chartData && (
                  <div className="space-y-4">
                    {chartData.labels.map((label, index) => (
                      <div key={label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                          <span className="text-sm font-bold text-gray-900">
                            {chartData.data[index]} students
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="h-4 rounded-full transition-all duration-500"
                            style={{
                              width: `${(chartData.data[index] / Math.max(...chartData.data)) * 100}%`,
                              backgroundColor: chartData.colors[index]
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Top 5 Performers</h2>
                {data.topPerformers && data.topPerformers.length > 0 ? (
                  <div className="space-y-3">
                    {data.topPerformers.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-600' : 'bg-emerald-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Student {student.studentId?.toString().slice(-6)}
                            </p>
                            <p className="text-xs text-gray-600">
                              Avg: {student.avgPercentage}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-700">
                            {student.totalScore}
                          </p>
                          <p className="text-xs text-gray-600">Total Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No performance data available</p>
                )}
              </div>
            </div>

            {/* Performance Bands Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Performance Bands Breakdown</h2>
              
              <div className="space-y-6">
                {/* Below 40% */}
                {data.performanceBands?.below_40 && data.performanceBands.below_40.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      Below 40% ({data.performanceBands.below_40.length} students)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {data.performanceBands.below_40.slice(0, 12).map((student, idx) => (
                        <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs text-gray-600">Student ID</p>
                          <p className="font-semibold text-gray-900 truncate">
                            {student.studentId?.toString().slice(-8)}
                          </p>
                          <p className="text-sm text-red-700 font-bold">
                            {Math.round(student.avgPercentage)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 40-70% */}
                {data.performanceBands?.between_40_70 && data.performanceBands.between_40_70.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      40-70% ({data.performanceBands.between_40_70.length} students)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {data.performanceBands.between_40_70.slice(0, 12).map((student, idx) => (
                        <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-gray-600">Student ID</p>
                          <p className="font-semibold text-gray-900 truncate">
                            {student.studentId?.toString().slice(-8)}
                          </p>
                          <p className="text-sm text-yellow-700 font-bold">
                            {Math.round(student.avgPercentage)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Above 70% */}
                {data.performanceBands?.above_70 && data.performanceBands.above_70.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      Above 70% ({data.performanceBands.above_70.length} students)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {data.performanceBands.above_70.slice(0, 12).map((student, idx) => (
                        <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs text-gray-600">Student ID</p>
                          <p className="font-semibold text-gray-900 truncate">
                            {student.studentId?.toString().slice(-8)}
                          </p>
                          <p className="text-sm text-green-700 font-bold">
                            {Math.round(student.avgPercentage)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!data && !loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h3>
            <p className="text-gray-600">Enter a subject name and click "Apply Filter" to view analytics</p>
          </div>
        )}
      </main>
    </div>
  );
}