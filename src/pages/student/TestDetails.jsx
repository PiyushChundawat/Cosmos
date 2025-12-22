import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function TestDetails() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testStatus, setTestStatus] = useState(null);

  const token = localStorage.getItem('token') || localStorage.getItem('student_token');
  const studentId = localStorage.getItem('studentId') || localStorage.getItem('student_id');

  useEffect(() => {
    if (!token || !studentId) {
      navigate('/student/login');
      return;
    }
    fetchTestDetails();
    
    // Refresh status every 30 seconds
    const interval = setInterval(() => {
      if (test) {
        setTestStatus(getTestStatus(test));
      }
    }, 30000);
    
    return () => clearInterval(interval);
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
        const testData = response.data.data.test;
        setTest(testData);
        setQuestionCount(response.data.data.questions.length);
        setTestStatus(getTestStatus(testData));
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

  const getTestStatus = (test) => {
    if (!test.schedule?.startTime || !test.schedule?.endTime) {
      return { status: 'not_scheduled', canStart: false, message: 'Test not scheduled' };
    }

    const now = new Date();
    const startTime = new Date(test.schedule.startTime);
    const endTime = new Date(test.schedule.endTime);

    // Strict timing - must be between start and end time
    if (now < startTime) {
      const diffTime = startTime - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));

      if (diffMinutes < 60) {
        return {
          status: 'starting_soon',
          canStart: false,
          message: `Test starts in ${diffMinutes} minutes`
        };
      } else if (diffHours < 24) {
        return {
          status: 'today',
          canStart: false,
          message: `Test starts in ${diffHours} hours`
        };
      } else if (diffDays === 1) {
        return {
          status: 'tomorrow',
          canStart: false,
          message: 'Test starts tomorrow'
        };
      }
      
      return { 
        status: 'upcoming', 
        canStart: false, 
        message: `Test will start on ${formatDate(startTime)} at ${formatTime(startTime)}` 
      };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'active', canStart: true, message: 'Test is active now!' };
    } else {
      return { status: 'ended', canStart: false, message: 'This test has ended' };
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

  const handleStartTest = () => {
    if (!testStatus?.canStart) {
      alert(testStatus?.message || 'Test is not available yet');
      return;
    }
    
    // Navigate to take-test page
    navigate(`/student/take-test/${testId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-indigo-600 text-lg font-medium">Loading test details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
              {error}
            </div>
            <button
              onClick={() => navigate('/student/tests')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!test) return null;

  const passingMarks = Math.round(test.totalMarks * 0.4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8 mb-6">
          <button
            onClick={() => navigate('/student/tests')}
            className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2 mb-4"
          >
            ← Back to Tests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{test.testTitle}</h1>
          <p className="text-gray-600 mt-2">Review test details before starting</p>
        </div>

        {/* Test Status Alert */}
        {testStatus && (
          <div className={`mb-6 p-4 rounded-2xl border-2 ${
            testStatus.status === 'active'
              ? 'bg-green-50 border-green-200' 
              : testStatus.status === 'ended'
              ? 'bg-red-50 border-red-200'
              : testStatus.status === 'starting_soon'
              ? 'bg-orange-50 border-orange-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`font-semibold ${
              testStatus.status === 'active'
                ? 'text-green-700'
                : testStatus.status === 'ended'
                ? 'text-red-700'
                : testStatus.status === 'starting_soon'
                ? 'text-orange-700'
                : 'text-yellow-700'
            }`}>
              {testStatus.status === 'active' && '🟢 '}
              {testStatus.status === 'starting_soon' && '⏰ '}
              {testStatus.status === 'ended' && '⏰ '}
              {testStatus.status === 'upcoming' && '📅 '}
              {testStatus.message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Test Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Test Description</h2>
              <p className="text-gray-700 leading-relaxed">
                This test evaluates your knowledge and skills. Make sure you have a stable internet connection and complete the test in one sitting. The timer will start as soon as you begin.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Instructions</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-semibold bg-indigo-100 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                  <span className="text-gray-700">Read each question carefully before answering.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-semibold bg-indigo-100 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                  <span className="text-gray-700">Each question carries equal marks.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-semibold bg-indigo-100 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                  <span className="text-gray-700">There is no negative marking for incorrect answers.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-semibold bg-indigo-100 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
                  <span className="text-gray-700">You can navigate between questions using Previous/Next buttons.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-semibold bg-indigo-100 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">5</span>
                  <span className="text-gray-700">The test will be auto-submitted when time expires.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-semibold bg-indigo-100 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">6</span>
                  <span className="text-gray-700">Once submitted, you cannot retake the test.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-semibold bg-indigo-100 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">7</span>
                  <span className="text-gray-700">Ensure you have a stable internet connection throughout the test.</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Important Notes
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Make sure you're in a quiet environment before starting.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Do not refresh the page during the test.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Your answers are saved automatically as you proceed.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Test Info Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Test Information</h2>

              <div className="space-y-5 text-sm">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Date</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(test.schedule?.startTime)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Time</span>
                  <span className="font-semibold text-gray-900">
                    {formatTime(test.schedule?.startTime)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Duration</span>
                  <span className="font-semibold text-gray-900">{test.duration} mins</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Total Marks</span>
                  <span className="font-semibold text-gray-900">{test.totalMarks}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Questions</span>
                  <span className="font-semibold text-gray-900">{questionCount}</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Passing Marks</span>
                  <span className="font-semibold text-gray-900">{passingMarks}</span>
                </div>
              </div>

              {testStatus?.canStart ? (
                <button
                  onClick={handleStartTest}
                  className="w-full mt-8 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  🚀 Start Test Now
                </button>
              ) : testStatus?.status === 'ended' ? (
                <div className="mt-8">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <p className="text-red-700 text-sm font-medium text-center">
                      This test has ended
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/student/performance')}
                    className="w-full bg-gray-600 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                  >
                    View Results
                  </button>
                </div>
              ) : (
                <div className="mt-8">
                  <div className={`border rounded-xl p-4 mb-4 ${
                    testStatus?.status === 'starting_soon'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <p className={`text-sm font-medium text-center ${
                      testStatus?.status === 'starting_soon'
                        ? 'text-orange-700'
                        : 'text-yellow-700'
                    }`}>
                      {testStatus?.status === 'starting_soon' 
                        ? 'Test will be available at the scheduled time'
                        : 'Test will be available at scheduled time'}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/student/tests')}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Back to Tests
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
                {testStatus?.canStart 
                  ? 'By starting this test, you agree to follow all instructions and complete it within the given time.'
                  : 'Please wait for the scheduled time to start this test.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}