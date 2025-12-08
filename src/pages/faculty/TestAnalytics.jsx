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
          row.difficulty === 'Easy' ? 'bg-gray-100 text-gray-700' :
          row.difficulty === 'Medium' ? 'bg-gray-200 text-gray-800' :
          'bg-gray-300 text-gray-900'
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
        <div className="text-gray-600 text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{summary?.testTitle || 'Test Analytics'}</h1>
        <p className="text-gray-600 mt-1">Comprehensive performance analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{summary?.totalAttempts || 0}</p>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Average Score</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{summary?.averageScore || 0}</p>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Average Percentage</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{summary?.averagePercentage || 0}%</p>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Highest Score</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{summary?.highestScore || 0}</p>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Lowest Score</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{summary?.lowestScore || 0}</p>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div>
            <p className="text-gray-600 text-sm font-medium">Pass Rate</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{summary?.passRate || 0}%</p>
          </div>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Score Distribution">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-700 font-medium">Chart: Score Distribution</p>
              <p className="text-sm text-gray-500 mt-1">Visualize student score ranges</p>
            </div>
          </div>
        </Card>

        <Card title="Question Difficulty Ranking">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-700 font-medium">Chart: Difficulty Analysis</p>
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
        <Card title="Top 5 Performers" className="bg-gray-50">
          <Table columns={topPerformersColumns} data={topPerformers} />
        </Card>

        <Card title="Students Needing Support" className="bg-gray-50">
          <Table columns={worstPerformersColumns} data={worstPerformers} />
        </Card>
      </div>
    </div>
  );
};

export default TestAnalytics;