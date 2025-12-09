import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ⚠️ CONFIGURE THIS
const API_BASE_URL = 'http://localhost:5000/api';

const TestAnalytics = () => {
  const { id } = useParams(); // This is testId from route
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [questionStats, setQuestionStats] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [worstPerformers, setWorstPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/faculty/login');
      return;
    }
    fetchAnalytics();
  }, [id]);

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all 3 endpoints in parallel
      const [summaryRes, questionRes, performanceRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/test-summary/${id}`, axiosConfig),
        axios.get(`${API_BASE_URL}/question-stats/${id}`, axiosConfig),
        axios.get(`${API_BASE_URL}/student-performance/${id}`, axiosConfig)
      ]);

      // Set summary
      if (summaryRes.data.data) {
        setSummary(summaryRes.data.data);
      }

      // Set question stats
      if (questionRes.data.data) {
        setQuestionStats(questionRes.data.data);
      }

      // Set top and worst performers
      if (performanceRes.data.data) {
        setTopPerformers(performanceRes.data.data.topPerformers || []);
        setWorstPerformers(performanceRes.data.data.worstPerformers || []);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Failed to load analytics');
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/faculty/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Table column definitions
  const questionColumns = [
    { 
      header: 'Question', 
      render: (row) => (
        <div className="max-w-md truncate" title={row.questionText}>
          {row.questionText}
        </div>
      )
    },
    { 
      header: 'Accuracy', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full" 
              style={{ width: `${row.accuracyRate}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{row.accuracyRate}%</span>
        </div>
      )
    },
    { 
      header: 'Difficulty',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
          row.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.difficulty}
        </span>
      )
    },
    {
      header: 'Attempts',
      accessor: 'totalAttempts'
    }
  ];

  const topPerformersColumns = [
    { 
      header: 'Rank', 
      render: (row, index) => index + 1 
    },
    { 
      header: 'Student Name', 
      accessor: 'studentName' 
    },
    { 
      header: 'Roll Number', 
      accessor: 'rollNumber' 
    },
    { 
      header: 'Score', 
      render: (row) => `${row.score}/${row.totalMarks}` 
    },
    { 
      header: 'Percentage', 
      render: (row) => `${row.percentage}%`
    }
  ];

  const worstPerformersColumns = [
    { 
      header: 'Student Name', 
      accessor: 'studentName' 
    },
    { 
      header: 'Roll Number', 
      accessor: 'rollNumber' 
    },
    { 
      header: 'Score', 
      render: (row) => `${row.score}/${row.totalMarks}` 
    },
    { 
      header: 'Percentage', 
      render: (row) => `${row.percentage}%`
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-600 text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {summary?.subject || 'Test Analytics'}
        </h1>
        <p className="text-gray-600 mt-1">Comprehensive performance analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {summary?.totalAttempts || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Average Score</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {summary?.averageScore || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Average Percentage</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {summary?.averagePercentage || 0}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Highest Score</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">
            {summary?.highestScore || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Lowest Score</p>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {summary?.lowestScore || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Pass Rate</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {summary?.passRate || 0}%
          </p>
        </div>
      </div>

      {/* Question-wise Accuracy */}
      {questionStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Question-wise Accuracy</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {questionColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questionStats.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {questionColumns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-700">
            Top 5 Performers
          </h2>
          {topPerformers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {topPerformersColumns.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topPerformers.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {topPerformersColumns.map((col, colIdx) => (
                        <td key={colIdx} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No data available</p>
          )}
        </div>

        {/* Worst Performers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-700">
            Students Needing Support
          </h2>
          {worstPerformers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {worstPerformersColumns.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {worstPerformers.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {worstPerformersColumns.map((col, colIdx) => (
                        <td key={colIdx} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAnalytics;