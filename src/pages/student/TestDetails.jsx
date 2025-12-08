import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TestDetails() {
  const { testId } = useParams();
  const navigate = useNavigate();

  // Mock test data
  const test = {
    id: testId,
    title: 'Aptitude Test - Logical Reasoning',
    description: 'This test evaluates your logical reasoning and problem-solving abilities. It includes questions on patterns, sequences, and analytical thinking.',
    date: '2025-12-15',
    time: '10:00 AM',
    duration: '60 min',
    totalMarks: 100,
    totalQuestions: 50,
    passingMarks: 40,
    topics: ['Pattern Recognition', 'Logical Sequences', 'Analytical Reasoning', 'Problem Solving'],
    instructions: [
      'Read each question carefully before answering',
      'Each question carries 2 marks',
      'There is no negative marking',
      'You can navigate between questions using Previous/Next buttons',
      'Make sure to submit the test before time expires',
      'Calculator and reference materials are not allowed',
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/student/tests')}
            className="text-emerald-600 hover:text-emerald-700 font-semibold mb-4 flex items-center gap-2"
          >
            ← Back to Tests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{test.title}</h1>
          <p className="text-gray-600 mt-1">Complete test information and instructions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Test Description</h2>
              <p className="text-gray-700 leading-relaxed">{test.description}</p>
            </div>

            {/* Topics Covered */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Topics Covered</h2>
              <div className="grid grid-cols-2 gap-3">
                {test.topics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                    <span className="text-emerald-600">✓</span>
                    <span className="font-medium text-gray-900">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📖 Instructions</h2>
              <ul className="space-y-3">
                {test.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Test Info Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl shadow-lg p-6 text-white sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Test Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-xs text-emerald-100">Date</p>
                    <p className="font-semibold">{test.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="text-xs text-emerald-100">Time</p>
                    <p className="font-semibold">{test.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <p className="text-xs text-emerald-100">Duration</p>
                    <p className="font-semibold">{test.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-xs text-emerald-100">Total Marks</p>
                    <p className="font-semibold">{test.totalMarks}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="text-xs text-emerald-100">Total Questions</p>
                    <p className="font-semibold">{test.totalQuestions}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-xs text-emerald-100">Passing Marks</p>
                    <p className="font-semibold">{test.passingMarks}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/student/take-test/${test.id}`)}
                className="w-full mt-6 bg-white text-emerald-700 font-bold py-4 rounded-lg hover:bg-emerald-50 transition-all shadow-lg"
              >
                Start Test Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
