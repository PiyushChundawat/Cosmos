import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ⚠️ CONFIGURE THIS
const API_BASE_URL = 'http://localhost:5000/api';

export default function UpcomingTests() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!token || !studentId) {
      navigate('/student/login');
      return;
    }
    fetchUpcomingTests();
  }, []);

  const fetchUpcomingTests = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/${studentId}/upcoming-tests`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setTests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching upcoming tests:', error);
      setError(error.response?.data?.message || 'Failed to load upcoming tests');
      
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
      month: 'short',
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

  const isTestLive = (test) => {
    if (!test.schedule?.startTime || !test.schedule?.endTime) return false;
    
    const now = new Date();
    const start = new Date(test.schedule.startTime);
    const end = new Date(test.schedule.endTime);
    
    return now >= start && now <= end;
  };

  const getRelativeDate = (dateString) => {
    if (!dateString) return '';
    
    const testDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    testDate.setHours(0, 0, 0, 0);
    
    const diffTime = testDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading upcoming tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Tests</h1>
          <p className="text-gray-600 mt-1">View and prepare for scheduled tests</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {tests.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Upcoming Tests</h3>
            <p className="text-gray-600">There are no scheduled tests at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map(test => {
              const isLive = isTestLive(test);
              const relativeDate = getRelativeDate(test.schedule?.startTime);

              return (
                <div
                  key={test._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="p-6 border-b border-gray-200 bg-white rounded-t-xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{test.testTitle}</h3>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                        isLive
                          ? 'bg-green-100 text-green-800 border-green-300 animate-pulse'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}>
                        {isLive ? '🔴 Live Now' : 'Upcoming'}
                      </span>

                      {relativeDate && (
                        <span className="px-3 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                          {relativeDate}
                        </span>
                      )}

                      <span className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
                        {test.duration} mins
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(test.schedule?.startTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-semibold text-gray-900">
                          {formatTime(test.schedule?.startTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-900">{test.duration} mins</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Marks</p>
                        <p className="font-semibold text-gray-900">{test.totalMarks}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/student/test-details/${test._id}`)}
                        className="flex-1 bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        View Details
                      </button>

                      {isLive && (
                        <button
                          onClick={() => navigate(`/student/take-test/${test._id}`)}
                          className="flex-1 bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Start Test
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}