import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ⚠️ CONFIGURE THIS
const API_BASE_URL = 'http://localhost:5000/api';

export default function TestDetails() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!token || !studentId) {
      navigate('/student/login');
      return;
    }
    fetchTestDetails();
  }, [testId]);

  const fetchTestDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/test/${testId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setTest(response.data.data.test);
        setQuestionCount(response.data.data.questions.length);
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      setError(error.response?.data?.message || 'Failed to load test details');
      
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/student/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading test details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
          <button
            onClick={() => navigate('/student/tests')}
            className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  if (!test) return null;

  // Calculate passing marks (40% of total)
  const passingMarks = Math.round(test.totalMarks * 0.4);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/student/tests')}
            className="text-emerald-600 font-medium hover:underline flex items-center gap-2"
          >
            ← Back to Tests
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">{test.testTitle}</h1>
          <p className="text-gray-600 mt-1">Review test details before starting</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Test Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Test Description (if available from backend, otherwise generic) */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Test Description</h2>
              <p className="text-gray-700 leading-relaxed">
                This test evaluates your knowledge and skills. Make sure you have a stable internet connection and complete the test in one sitting. The timer will start as soon as you begin.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-semibold">1.</span>
                  <span className="text-gray-700">Read each question carefully before answering.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-semibold">2.</span>
                  <span className="text-gray-700">Each question carries equal marks.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-semibold">3.</span>
                  <span className="text-gray-700">There is no negative marking for incorrect answers.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-semibold">4.</span>
                  <span className="text-gray-700">You can navigate between questions using Previous/Next buttons.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-semibold">5.</span>
                  <span className="text-gray-700">The test will be auto-submitted when time expires.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-semibold">6.</span>
                  <span className="text-gray-700">Once submitted, you cannot retake the test.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-semibold">7.</span>
                  <span className="text-gray-700">Ensure you have a stable internet connection throughout the test.</span>
                </li>
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Important Notes
              </h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Make sure you're in a quiet environment before starting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Do not refresh the page during the test.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Your answers are saved automatically as you proceed.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Test Info Card */}
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Test Information</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(test.schedule?.startTime)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-900">
                    {formatTime(test.schedule?.startTime)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{test.duration} mins</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Marks</span>
                  <span className="font-semibold text-gray-900">{test.totalMarks}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-semibold text-gray-900">{questionCount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Passing Marks</span>
                  <span className="font-semibold text-gray-900">{passingMarks}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/student/take-test/${testId}`)}
                className="w-full mt-8 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Start Test Now
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By starting this test, you agree to follow all instructions and complete it within the given time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}