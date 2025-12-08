import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/faculty/Card';
import Table from '../../components/faculty/Table';

const TestAnalytics = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [questionStats, setQuestionStats] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [worstPerformers, setWorstPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    // Use mock data (no backend)
    setSummary({
      testTitle: 'Data Structures Mid-Term',
      totalAttempts: 45,
      averageScore: 78.5,
      averagePercentage: 78.5,
      highestScore: 98,
      lowestScore: 42,
      passRate: 88.9
    });

    setQuestionStats([
      { id: 1, question: 'What is the time complexity of binary search?', accuracy: 92.5, difficulty: 'Easy' },
      { id: 2, question: 'Implement a stack using arrays', accuracy: 67.8, difficulty: 'Medium' },
      { id: 3, question: 'Explain AVL tree rotations', accuracy: 45.2, difficulty: 'Hard' },
      { id: 4, question: 'What is a linked list?', accuracy: 88.3, difficulty: 'Easy' },
      { id: 5, question: 'Write code for merge sort', accuracy: 56.7, difficulty: 'Medium' }
    ]);

    setTopPerformers([
      { id: 1, name: 'Alice Johnson', score: 98, percentage: 98, rank: 1 },
      { id: 2, name: 'Bob Smith', score: 95, percentage: 95, rank: 2 },
      { id: 3, name: 'Charlie Brown', score: 92, percentage: 92, rank: 3 },
      { id: 4, name: 'Diana Prince', score: 90, percentage: 90, rank: 4 },
      { id: 5, name: 'Eve Davis', score: 88, percentage: 88, rank: 5 }
    ]);

    setWorstPerformers([
      { id: 1, name: 'Frank Miller', score: 42, percentage: 42 },
      { id: 2, name: 'Grace Lee', score: 48, percentage: 48 },
      { id: 3, name: 'Henry Wilson', score: 52, percentage: 52 },
      { id: 4, name: 'Ivy Chen', score: 55, percentage: 55 },
      { id: 5, name: 'Jack Taylor', score: 58, percentage: 58 }
    ]);
    
    setLoading(false);
  };

  const questionColumns = [
    { 
      header: 'Question', 
      accessor: 'question',
      render: (row) => (
        <div className="max-w-md truncate" title={row.question}>
          {row.question}
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
              style={{ width: `${row.accuracy}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{row.accuracy}%</span>
        </div>
      )
    },
    { 
      header: 'Difficulty',
      accessor: 'difficulty',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
          row.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.difficulty}
        </span>
      )
    }
  ];

  const topPerformersColumns = [
    { header: 'Rank', accessor: 'rank' },
    { header: 'Student Name', accessor: 'name' },
    { header: 'Score', accessor: 'score' },
    { 
      header: 'Percentage', 
      render: (row) => `${row.percentage}%`
    }
  ];

  const worstPerformersColumns = [
    { header: 'Student Name', accessor: 'name' },
    { header: 'Score', accessor: 'score' },
    { 
      header: 'Percentage', 
      render: (row) => `${row.percentage}%`
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-emerald-600 text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{summary?.testTitle || 'Test Analytics'}</h1>
        <p className="text-gray-600 mt-1">Comprehensive performance analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{summary?.totalAttempts || 0}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Score</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">{summary?.averageScore || 0}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Percentage</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{summary?.averagePercentage || 0}%</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Highest Score</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{summary?.highestScore || 0}</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Lowest Score</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{summary?.lowestScore || 0}</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pass Rate</p>
              <p className="text-4xl font-bold text-teal-600 mt-2">{summary?.passRate || 0}%</p>
            </div>
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Score Distribution">
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-dashed border-emerald-300">
            <div className="text-center">
              <svg className="w-16 h-16 text-emerald-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-emerald-600 font-medium">Chart: Score Distribution</p>
              <p className="text-sm text-gray-500 mt-1">Visualize student score ranges</p>
            </div>
          </div>
        </Card>

        <Card title="Question Difficulty Ranking">
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-dashed border-green-300">
            <div className="text-center">
              <svg className="w-16 h-16 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-green-600 font-medium">Chart: Difficulty Analysis</p>
              <p className="text-sm text-gray-500 mt-1">Question accuracy vs difficulty</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Question-wise Accuracy */}
      <Card title="Question-wise Accuracy">
        <Table columns={questionColumns} data={questionStats} />
      </Card>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Top 5 Performers" className="bg-gradient-to-br from-emerald-50 to-white">
          <Table columns={topPerformersColumns} data={topPerformers} />
        </Card>

        <Card title="Students Needing Support" className="bg-gradient-to-br from-orange-50 to-white">
          <Table columns={worstPerformersColumns} data={worstPerformers} />
        </Card>
      </div>
    </div>
  );
};

export default TestAnalytics;
