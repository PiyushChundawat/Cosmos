import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chart from '../../components/Chart';
import api from '../../api/axios';

export default function TPODashboard() {
  const navigate = useNavigate();
  const collegeName = localStorage.getItem('tpo_college') || 'College';
  const userName = localStorage.getItem('tpo_user') || 'User';
  const [activeTab, setActiveTab] = useState('overview');

  const [codes, setCodes] = useState({ studentCode: '', facultyCode: '' });
  const [codesLoading, setCodesLoading] = useState(true);

  const [studentPerformance, setStudentPerformance] = useState({
    below_40: [],
    between_40_70: [],
    above_70: []
  });
  const [topStudents, setTopStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState(null);

  const [testsByFaculty, setTestsByFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState(null);
  const [expandedTest, setExpandedTest] = useState(null);

  const fetchCollegeCodes = async () => {
    try {
      setCodesLoading(true);
      // First try to get from localStorage (saved during signup)
      const storedStudentCode = localStorage.getItem('tpo_student_code');
      const storedFacultyCode = localStorage.getItem('tpo_faculty_code');
      
      if (storedStudentCode && storedFacultyCode) {
        setCodes({ studentCode: storedStudentCode, facultyCode: storedFacultyCode });
        setCodesLoading(false);
        return;
      }

      // If not in localStorage, fetch from API using authenticated user
      const response = await api.get(`/student/tpo/college-codes`);
      if (response.data && response.data.data) {
        const fetchedCodes = {
          studentCode: response.data.data.studentCode || '',
          facultyCode: response.data.data.facultyCode || ''
        };
        setCodes(fetchedCodes);
        // Save to localStorage for future use
        localStorage.setItem('tpo_student_code', fetchedCodes.studentCode);
        localStorage.setItem('tpo_faculty_code', fetchedCodes.facultyCode);
      }
    } catch (err) {
      console.error('Failed to fetch codes:', err);
      // Try localStorage as fallback
      const storedStudentCode = localStorage.getItem('tpo_student_code');
      const storedFacultyCode = localStorage.getItem('tpo_faculty_code');
      if (storedStudentCode && storedFacultyCode) {
        setCodes({ studentCode: storedStudentCode, facultyCode: storedFacultyCode });
      }
    } finally {
      setCodesLoading(false);
    }
  };

  useEffect(() => {
    fetchCollegeCodes();
  }, [collegeName]);

  const fetchStudentAnalytics = async () => {
    try {
      setStudentLoading(true);
      setStudentError(null);

      const performanceRes = await api.get('/tpo/student-analytics/performance-bands');
      setStudentPerformance(performanceRes.data.data);

      const topPerformersRes = await api.get('/tpo/student-analytics/top-performers');
      setTopStudents(topPerformersRes.data.data);
    } catch (err) {
      setStudentError(err.response?.data?.message || 'Failed to load student analytics');
    } finally {
      setStudentLoading(false);
    }
  };

  const fetchTestsByFaculty = async () => {
    try {
      setFacultyLoading(true);
      setFacultyError(null);

      const response = await api.get(`/tpo/faculty-analytics/tests-by-faculty`);
      setTestsByFaculty(response.data.data || []);
    } catch (err) {
      setFacultyError(err.response?.data?.message || 'Failed to load faculty tests');
    } finally {
      setFacultyLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'faculty') fetchTestsByFaculty();
  }, [activeTab]);

  const studentPerformanceData = {
    labels: ['Below 40%', '40-70%', 'Above 70%'],
    datasets: [
      {
        label: 'Student Count',
        data: [
          studentPerformance.below_40?.length || 0,
          studentPerformance.between_40_70?.length || 0,
          studentPerformance.above_70?.length || 0
        ],
        backgroundColor: ['#EF4444', '#F59E0B', '#2563EB'],
        borderColor: ['#B91C1C', '#B45309', '#1E40AF'],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/tpo/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#1E40AF]">TPO Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {collegeName} • Welcome, {userName}
              </p>
            </div>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b">
            {['overview', 'faculty'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition ${
                  activeTab === tab
                    ? 'border-b-4 border-[#2563EB] text-[#2563EB]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'overview'
                  ? 'Overview'
                  : 'Faculty Analytics'}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <Card>
                <h2 className="text-2xl font-bold text-[#1E40AF] mb-2">
                  Welcome to TPO Portal
                </h2>
                <p className="text-gray-700">
                  Track placements, performance and analytics in one place.
                </p>
              </Card>

              {/* Registration Codes Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
                  <span className="text-2xl">🔑</span> Registration Codes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Code */}
                  <div className="bg-white rounded-lg p-5 border-2 border-emerald-300 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-700 font-semibold">📚 Student Code</p>
                      <button
                        onClick={() => {
                          if (codes.studentCode && codes.studentCode !== '---') {
                            navigator.clipboard.writeText(codes.studentCode);
                            alert('✅ Student code copied!');
                          } else {
                            alert('⚠️ Student code not available');
                          }
                        }}
                        disabled={!codes.studentCode || codes.studentCode === '---'}
                        className={`text-sm px-3 py-1 rounded transition ${
                          codes.studentCode && codes.studentCode !== '---'
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-emerald-700 font-mono tracking-wider mb-2">
                      {codesLoading ? '⏳ Loading...' : (codes.studentCode || '---')}
                    </p>
                    <p className="text-gray-500 text-xs">Share this code with students for registration</p>
                  </div>

                  {/* Faculty Code */}
                  <div className="bg-white rounded-lg p-5 border-2 border-blue-300 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-700 font-semibold">👨‍🏫 Faculty Code</p>
                      <button
                        onClick={() => {
                          if (codes.facultyCode && codes.facultyCode !== '---') {
                            navigator.clipboard.writeText(codes.facultyCode);
                            alert('✅ Faculty code copied!');
                          } else {
                            alert('⚠️ Faculty code not available');
                          }
                        }}
                        disabled={!codes.facultyCode || codes.facultyCode === '---'}
                        className={`text-sm px-3 py-1 rounded transition ${
                          codes.facultyCode && codes.facultyCode !== '---'
                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-blue-700 font-mono tracking-wider mb-2">
                      {codesLoading ? '⏳ Loading...' : (codes.facultyCode || '---')}
                    </p>
                    <p className="text-gray-500 text-xs">Share this code with faculty members for registration</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  className="cursor-pointer hover:border-[#2563EB]"
                  onClick={() => setActiveTab('faculty')}
                >
                  <h3 className="text-xl font-semibold mb-2">Faculty Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    Tests by faculty and students who took them.
                  </p>
                  <Button className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white">
                    View Details
                  </Button>
                </Card>
              </div>
            </>
          )}

          {/* Faculty Analytics */}
          {activeTab === 'faculty' && (
            <>
              <h2 className="text-2xl font-bold text-[#1E40AF]">Faculty Analytics</h2>

              {facultyLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin h-14 w-14 border-b-4 border-[#2563EB] rounded-full mx-auto" />
                  <p className="mt-4 text-gray-600">Loading faculty tests...</p>
                </div>
              ) : facultyError ? (
                <div className="text-center bg-red-50 p-8 rounded-xl">
                  <p className="text-red-600 font-semibold">{facultyError}</p>
                </div>
              ) : testsByFaculty && testsByFaculty.length > 0 ? (
                <div className="space-y-4">
                  {testsByFaculty.map((test) => (
                    <div 
                      key={test._id}
                      className="border-2 border-gray-300 rounded-xl overflow-hidden hover:border-[#2563EB] transition"
                    >
                      {/* Test Summary */}
                      <div
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition"
                        onClick={() => setExpandedTest(expandedTest === test._id ? null : test._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#1E40AF] mb-2">{test.testTitle}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Faculty</p>
                                <p className="font-semibold text-gray-800">{test.facultyName || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Students</p>
                                <p className="text-2xl font-bold text-[#2563EB]">{test.studentCount || 0}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Attempts</p>
                                <p className="text-2xl font-bold text-[#2563EB]">{test.totalAttempts || 0}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Avg Score</p>
                                <p className="text-2xl font-bold text-[#059669]">{test.avgScore || 0}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Avg %</p>
                                <p className="text-2xl font-bold text-[#2563EB]">{test.avgPercentage || 0}%</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <svg 
                              className={`w-6 h-6 text-[#2563EB] transition transform ${expandedTest === test._id ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Student Details */}
                      {expandedTest === test._id && (
                        <div className="p-6 bg-white border-t-2 border-gray-300">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Students who took this test ({test.attempts?.length || 0})
                          </h4>
                          {test.attempts && test.attempts.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="px-4 py-2 text-left">Student Name</th>
                                    <th className="px-4 py-2 text-left">Roll Number</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-right">Score</th>
                                    <th className="px-4 py-2 text-right">%</th>
                                    <th className="px-4 py-2 text-center">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  {test.attempts.map((attempt, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                      <td className="px-4 py-3">{attempt.studentName}</td>
                                      <td className="px-4 py-3">{attempt.studentRoll}</td>
                                      <td className="px-4 py-3 text-xs text-gray-600">{attempt.studentEmail}</td>
                                      <td className="px-4 py-3 text-right font-semibold">{attempt.score}</td>
                                      <td className="px-4 py-3 text-right font-semibold">{attempt.percentage.toFixed(2)}%</td>
                                      <td className="px-4 py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                          attempt.status === 'completed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {attempt.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-8">No students have attempted this test yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center bg-yellow-50 p-12 rounded-xl">
                  <svg className="w-16 h-16 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p className="text-yellow-800 font-semibold text-lg">No tests created yet</p>
                  <p className="text-gray-600 text-sm mt-2">Faculty members haven't created any tests for your college</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}