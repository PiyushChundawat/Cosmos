import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

export default function Performance() {
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token') || localStorage.getItem('student_token');
  const studentId = localStorage.getItem('studentId') || localStorage.getItem('student_id');
  const studentName = localStorage.getItem('student_name');

  useEffect(() => {
    console.log('🔵 Performance mounting...');
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('StudentId:', studentId);
    
    if (!token || !studentId) {
      console.log('❌ Missing auth data, redirecting to login');
      navigate('/student/login');
      return;
    }
    
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔵 Fetching performance...');
      
      // Your backend route: GET /student/:studentId/performance
      const response = await api.get(`/student/${studentId}/performance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Performance response:', response.data);

      // Your backend returns: { success: true, data: { attempts, resumeScore } }
      if (response.data.success) {
        setPerformanceData(response.data.data);
      }
    } catch (error) {
      console.error('❌ Performance error:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('❌ Unauthorized, clearing localStorage');
        localStorage.clear();
        navigate('/student/login');
        return;
      }
      
      setError(error.response?.data?.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'bg-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'bg-green-500' };
    if (percentage >= 70) return { grade: 'B+', color: 'bg-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'bg-blue-500' };
    if (percentage >= 50) return { grade: 'C', color: 'bg-yellow-600' };
    if (percentage >= 40) return { grade: 'D', color: 'bg-orange-600' };
    return { grade: 'F', color: 'bg-red-600' };
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/student/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-indigo-600 text-lg font-medium">Loading performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Failed to load performance</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchPerformance}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-semibold transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Backend response: { attempts: [], resumeScore: number }
  const attempts = performanceData?.attempts || [];
  const resumeScore = performanceData?.resumeScore || 0;

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
          <h1 className="text-3xl font-bold text-gray-900">My Performance</h1>
          <p className="text-gray-600 mt-2">Track your test scores and overall progress</p>
        </div>

        {/* Resume Score Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Resume Readiness Score</h2>
              <p className="text-indigo-100">Based on your test performance</p>
            </div>
            <div className="text-center mt-4 md:mt-0">
              <p className="text-7xl font-bold">{resumeScore.toFixed(1)}</p>
              <p className="text-2xl font-semibold text-indigo-100 mt-2">/ 10.0</p>
            </div>
          </div>
        </div>

        {/* Test Attempts */}
        {attempts.length === 0 ? (
          <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Test Attempts Yet</h2>
            <p className="text-gray-600 mb-6">Start taking tests to see your performance here</p>
            <button
              onClick={() => navigate('/student/tests')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
            >
              View Available Tests
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Test Attempts ({attempts.length})</h2>
            </div>
            
            {attempts.map((attempt) => {
              const gradeInfo = getGrade(attempt.percentage || 0);
              
              return (
                <div
                  key={attempt._id}
                  className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {attempt.testTitle || attempt.testId?.testTitle || 'Test'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Attempted {getRelativeTime(attempt.attemptedAt || attempt.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Score */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {attempt.score}/{attempt.totalMarks}
                        </p>
                      </div>

                      {/* Percentage */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Percentage</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {attempt.percentage?.toFixed(1)}%
                        </p>
                      </div>

                      {/* Grade */}
                      <div className={`${gradeInfo.color} text-white px-6 py-3 rounded-xl text-center min-w-[80px]`}>
                        <p className="text-xs font-medium opacity-90">Grade</p>
                        <p className="text-3xl font-bold">{gradeInfo.grade}</p>
                      </div>
                    </div>
                  </div>

                  {/* Faculty Feedback */}
                  {attempt.facultyFeedback && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Faculty Feedback:</p>
                      <p className="text-gray-700 italic">"{attempt.facultyFeedback}"</p>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          attempt.percentage >= 75 ? 'bg-green-600' :
                          attempt.percentage >= 50 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${attempt.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}