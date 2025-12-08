import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpcomingTests() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const tests = [
    {
      id: 1,
      title: 'Aptitude Test - Logical Reasoning',
      date: '2025-12-15',
      time: '10:00 AM',
      duration: '60 min',
      totalMarks: 100,
      status: 'upcoming',
      type: 'Aptitude',
    },
    {
      id: 2,
      title: 'Technical Assessment - DSA',
      date: '2025-12-18',
      time: '2:00 PM',
      duration: '90 min',
      totalMarks: 150,
      status: 'upcoming',
      type: 'Technical',
    },
    {
      id: 3,
      title: 'Coding Challenge - Python',
      date: '2025-12-08',
      time: '11:00 AM',
      duration: '120 min',
      totalMarks: 200,
      status: 'live',
      type: 'Coding',
    },
    {
      id: 4,
      title: 'English Communication Test',
      date: '2025-12-20',
      time: '3:00 PM',
      duration: '45 min',
      totalMarks: 50,
      status: 'upcoming',
      type: 'Communication',
    },
  ];

  const filteredTests = filter === 'all' ? tests : tests.filter(t => t.type.toLowerCase() === filter);

  const getStatusColor = (status) => {
    return status === 'live' 
      ? 'bg-green-100 text-green-800 border-green-300' 
      : 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">📝 Upcoming Tests</h1>
          <p className="text-gray-600 mt-1">View and manage your scheduled tests</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter by Type</h2>
          <div className="flex flex-wrap gap-3">
            {['all', 'aptitude', 'technical', 'coding', 'communication'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filter === type
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(test.status)}`}>
                        {test.status === 'live' ? '🔴 LIVE NOW' : '⏰ Upcoming'}
                      </span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                        {test.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">{test.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-semibold text-gray-900">{test.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⏱️</span>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">{test.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="text-xs text-gray-500">Total Marks</p>
                      <p className="font-semibold text-gray-900">{test.totalMarks}</p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/student/test-details/${test.id}`)}
                    className="flex-1 bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    View Details
                  </button>
                  {test.status === 'live' && (
                    <button
                      onClick={() => navigate(`/student/take-test/${test.id}`)}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
                    >
                      Start Test →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Tests Found</h3>
            <p className="text-gray-600">No tests match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
