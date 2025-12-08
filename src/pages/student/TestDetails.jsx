import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TestDetails() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const test = {
    id: testId,
    title: 'Aptitude Test - Logical Reasoning',
    description:
      'This test evaluates your logical reasoning and problem-solving abilities. It includes questions on patterns, sequences, and analytical thinking.',
    date: '2025-12-15',
    time: '10:00 AM',
    duration: '60 min',
    totalMarks: 100,
    totalQuestions: 50,
    passingMarks: 40,
    topics: [
      'Pattern Recognition',
      'Logical Sequences',
      'Analytical Reasoning',
      'Problem Solving',
    ],
    instructions: [
      'Read each question carefully before answering.',
      'Each question carries 2 marks.',
      'There is no negative marking.',
      'You can navigate between questions using Previous/Next buttons.',
      'Submit the test before time expires.',
      'Calculators and reference materials are not allowed.',
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/student/tests')}
            className="text-emerald-600 font-medium hover:underline"
          >
            Back to Tests
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">{test.title}</h1>
          <p className="text-gray-600 mt-1">Test details and instructions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Test Description</h2>
              <p className="text-gray-700 leading-relaxed">{test.description}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Topics Covered</h2>
              <div className="grid grid-cols-2 gap-3">
                {test.topics.map((topic, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium"
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
              <ul className="space-y-3">
                {test.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-gray-900 font-semibold">{index + 1}.</span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Test Information</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">{test.date}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-900">{test.time}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{test.duration}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Marks</span>
                  <span className="font-semibold text-gray-900">{test.totalMarks}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-semibold text-gray-900">
                    {test.totalQuestions}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Passing Marks</span>
                  <span className="font-semibold text-gray-900">
                    {test.passingMarks}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/student/take-test/${test.id}`)}
                className="w-full mt-8 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700"
              >
                Start Test
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
