import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

export default function StudentTests() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = localStorage.getItem('studentId') || localStorage.getItem('student_id');
  const token = localStorage.getItem('token') || localStorage.getItem('student_token');

  useEffect(() => {
    if (!studentId || !token) {
      navigate('/student/login');
      return;
    }
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/student/upcoming-tests/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/student/login');
        return;
      }
      
      setError(error.response?.data?.message || 'Failed to load tests');
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

  const getTestStatus = (test) => {
    if (!test.schedule?.startTime || !test.schedule?.endTime) {
      return { status: 'not_scheduled', label: 'Not Scheduled', color: 'gray', canStart: false };
    }

    const now = new Date();
    const startTime = new Date(test.schedule.startTime);
    const endTime = new Date(test.schedule.endTime);

    // Check if test is ACTIVE (between start and end time)
    if (now >= startTime && now <= endTime) {
      return { status: 'active', label: 'Active Now', color: 'green', canStart: true };
    }
    
    // Check if test ENDED
    if (now > endTime) {
      return { status: 'ended', label: 'Ended', color: 'red', canStart: false };
    }
    
    // Test hasn't started yet
    const diffTime = startTime - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return { 
        status: 'starting_soon', 
        label: `Starts in ${diffMinutes} min`, 
        color: 'orange',
        canStart: false  // NO EARLY ACCESS
      };
    } else if (diffHours < 24) {
      return { 
        status: 'today', 
        label: `Starts in ${diffHours} hours`, 
        color: 'yellow',
        canStart: false
      };
    } else if (diffDays === 1) {
      return { status: 'tomorrow', label: 'Tomorrow', color: 'blue', canStart: false };
    } else {
      return { status: 'upcoming', label: `In ${diffDays} days`, color: 'indigo', canStart: false };
    }
  };

  const handleTestAction = (test) => {
    const testStatus = getTestStatus(test);
    
    if (testStatus.canStart) {
      // Test is active - go STRAIGHT to taking the test
      navigate(`/student/take-test/${test._id}`);
    } else {
      // Show info about when test will be available
      if (testStatus.status === 'upcoming' || testStatus.status === 'today' || testStatus.status === 'tomorrow' || testStatus.status === 'starting_soon') {
        alert(`This test hasn't started yet. It will be available on ${formatDate(test.schedule?.startTime)} at ${formatTime(test.schedule?.startTime)}`);
      } else if (testStatus.status === 'ended') {
        alert('This test has ended. Check your Performance page to see results.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-indigo-600 text-lg font-medium">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Tests</h1>
          <p className="text-gray-600 mt-2">View and attempt scheduled tests</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6">
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchTests}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {tests.length === 0 ? (
          <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Upcoming Tests</h2>
            <p className="text-gray-600 mb-6">There are no tests scheduled at the moment</p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => {
              const testStatus = getTestStatus(test);
              const statusColors = {
                gray: 'bg-gray-100 text-gray-700',
                orange: 'bg-orange-100 text-orange-700',
                yellow: 'bg-yellow-100 text-yellow-700',
                blue: 'bg-blue-100 text-blue-700',
                indigo: 'bg-indigo-100 text-indigo-700',
                green: 'bg-green-100 text-green-700',
                red: 'bg-red-100 text-red-700'
              };

              return (
                <div
                  key={test._id}
                  className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1 pr-3">{test.testTitle}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusColors[testStatus.color]}`}>
                      {testStatus.label}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-lg">📅</span>
                      <span>{formatDate(test.schedule?.startTime)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-lg">🕐</span>
                      <span>{formatTime(test.schedule?.startTime)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-lg">⏱️</span>
                      <span>{test.duration} minutes</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-lg">📝</span>
                      <span>{test.totalMarks} marks</span>
                    </div>
                  </div>

                  {/* Status-based messages */}
                  {testStatus.status === 'active' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-700 font-medium">
                        🟢 Test is live! Click below to start.
                      </p>
                    </div>
                  )}

                  {testStatus.status === 'starting_soon' && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                      <p className="text-sm text-orange-700 font-medium">
                        ⏰ Test will start soon. Be ready!
                      </p>
                    </div>
                  )}

                  {testStatus.status === 'ended' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-700 font-medium">
                        ⏰ Test has ended. Check Performance page.
                      </p>
                    </div>
                  )}

                  {/* Action button */}
                  {testStatus.canStart ? (
                    <button
                      onClick={() => navigate(`/student/take-test/${test._id}`)}
                      className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-medium shadow-md"
                    >
                      🚀 Start Test Now
                    </button>
                  ) : testStatus.status === 'ended' ? (
                    <button
                      onClick={() => navigate('/student/performance')}
                      className="w-full bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition font-medium"
                    >
                      View Results
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTestAction(test)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
                    >
                      View Details
                    </button>
                  )}

                  {/* Additional info for upcoming tests */}
                  {!testStatus.canStart && testStatus.status !== 'ended' && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Test will be available at the scheduled time
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}