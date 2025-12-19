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

  const [studentPerformance, setStudentPerformance] = useState({ below_40: [], between_40_70: [], above_70: [] });
  const [topStudents, setTopStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState(null);

  const [facultyAnalytics, setFacultyAnalytics] = useState(null);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState(null);

  const fetchStudentAnalytics = async () => {
    try {
      setStudentLoading(true);
      setStudentError(null);

      // Fetch performance bands
      const performanceRes = await api.get('/analytics/student/performance-bands');
      setStudentPerformance(performanceRes.data.data);

      // Fetch top performers
      const topPerformersRes = await api.get('/analytics/student/top-performers');
      setTopStudents(topPerformersRes.data.data);
    } catch (err) {
      console.error('Failed to fetch student analytics:', err);
      setStudentError(err.response?.data?.message || 'Failed to load student analytics');
    } finally {
      setStudentLoading(false);
    }
  };

  // Fetch faculty analytics
  const fetchFacultyAnalytics = async () => {
    try {
      setFacultyLoading(true);
      setFacultyError(null);

      // You can modify this to fetch for a specific subject or all subjects
      const response = await api.get('/analytics/faculty/complete?subject=Mathematics');
      setFacultyAnalytics(response.data.data);
    } catch (err) {
      console.error('Failed to fetch faculty analytics:', err);
      setFacultyError(err.response?.data?.message || 'Failed to load faculty analytics');
    } finally {
      setFacultyLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'student') {
      fetchStudentAnalytics();
    } else if (activeTab === 'faculty') {
      fetchFacultyAnalytics();
    }
  }, [activeTab]);

  // Prepare chart data for student performance
  const studentPerformanceData = {
    labels: ['Below 40%', '40-70%', 'Above 70%'],
    datasets: [
      {
        label: 'Student Count',
        data: [
          studentPerformance.below_40?.length || 0,
          studentPerformance.between_40_70?.length || 0,
          studentPerformance.above_70?.length || 0,
        ],
        backgroundColor: ['#b91c1c', '#ca8a04', '#0C6B2F'],
        borderColor: ['#7f1d1d', '#a16207', '#06451f'],
        borderWidth: 2,
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('tpo_token');
    localStorage.removeItem('tpo_college');
    localStorage.removeItem('tpo_user');
    navigate('/tpo/login', { replace: true });
  };

  const chartOptions = {
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TPO Dashboard</h1>
              <p className="text-gray-600 mt-1">{collegeName} • Welcome, {userName}</p>
            </div>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'overview'
                  ? 'border-b-4 border-[#0C6B2F] text-[#0C6B2F]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('student')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'student'
                  ? 'border-b-4 border-[#0C6B2F] text-[#0C6B2F]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student Analytics
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'faculty'
                  ? 'border-b-4 border-[#0C6B2F] text-[#0C6B2F]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Faculty Analytics
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <Card className="mb-8 bg-white border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TPO Portal</h2>
                <p className="text-gray-700">Manage placements and track performance insights.</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="cursor-pointer" onClick={() => setActiveTab('student')}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Analytics</h3>
                  <p className="text-gray-700 mb-4">View performance distribution and insights.</p>
                  <Button size="sm" className="w-full">View Details</Button>
                </Card>

                <Card className="cursor-pointer" onClick={() => setActiveTab('faculty')}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Faculty Analytics</h3>
                  <p className="text-gray-700 mb-4">View subject-wise faculty performance.</p>
                  <Button size="sm" className="w-full">View Details</Button>
                </Card>
              </div>
            </>
          )}

          {/* Student Analytics Tab */}
          {activeTab === 'student' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Analytics</h2>

              {studentLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0C6B2F] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading student analytics...</p>
                </div>
              ) : studentError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                  <p className="text-red-600 font-semibold">⚠️ {studentError}</p>
                  <button
                    onClick={fetchStudentAnalytics}
                    className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                      <Chart type="bar" data={studentPerformanceData} options={chartOptions} />
                    </Card>

                    <Card>
                      <Chart type="pie" data={studentPerformanceData} />
                    </Card>
                  </div>

                  <Card>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performers</h3>
                    {topStudents.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No student data available</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-[#0C6B2F] text-white">
                              <th className="px-6 py-3 text-sm">Rank</th>
                              <th className="px-6 py-3 text-sm">Student ID</th>
                              <th className="px-6 py-3 text-sm">Total Score</th>
                              <th className="px-6 py-3 text-sm">Avg Percentage</th>
                              <th className="px-6 py-3 text-sm">Attempts</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200">
                            {topStudents.map((student, index) => (
                              <tr key={student.studentId} className="hover:bg-gray-100">
                                <td className="px-6 py-4 font-semibold">{index + 1}</td>
                                <td className="px-6 py-4">{student.studentId}</td>
                                <td className="px-6 py-4">{student.totalScore}</td>
                                <td className="px-6 py-4">{student.avgPercentage}%</td>
                                <td className="px-6 py-4">{student.attemptCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </>
              )}
            </>
          )}

          {/* Faculty Analytics Tab */}
          {activeTab === 'faculty' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Faculty Analytics</h2>

              {facultyLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0C6B2F] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading faculty analytics...</p>
                </div>
              ) : facultyError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                  <p className="text-red-600 font-semibold">⚠️ {facultyError}</p>
                  <button
                    onClick={fetchFacultyAnalytics}
                    className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : facultyAnalytics ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Avg Score</p>
                        <p className="text-4xl font-bold text-[#0C6B2F] mt-2">
                          {facultyAnalytics.overallStats?.avgScore || 0}
                        </p>
                      </div>
                    </Card>
                    <Card>
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Avg Percentage</p>
                        <p className="text-4xl font-bold text-[#0C6B2F] mt-2">
                          {facultyAnalytics.overallStats?.avgPercentage || 0}%
                        </p>
                      </div>
                    </Card>
                    <Card>
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Total Students</p>
                        <p className="text-4xl font-bold text-[#0C6B2F] mt-2">
                          {facultyAnalytics.overallStats?.totalStudents || 0}
                        </p>
                      </div>
                    </Card>
                    <Card>
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Total Attempts</p>
                        <p className="text-4xl font-bold text-[#0C6B2F] mt-2">
                          {facultyAnalytics.overallStats?.totalAttempts || 0}
                        </p>
                      </div>
                    </Card>
                  </div>

                  <Card>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performers ({facultyAnalytics.subject})</h3>
                    {facultyAnalytics.topPerformers?.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No data available</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-[#0C6B2F] text-white">
                              <th className="px-6 py-3 text-sm">Rank</th>
                              <th className="px-6 py-3 text-sm">Student ID</th>
                              <th className="px-6 py-3 text-sm">Total Score</th>
                              <th className="px-6 py-3 text-sm">Avg Percentage</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200">
                            {facultyAnalytics.topPerformers?.map((student, index) => (
                              <tr key={student.studentId} className="hover:bg-gray-100">
                                <td className="px-6 py-4 font-semibold">{index + 1}</td>
                                <td className="px-6 py-4">{student.studentId}</td>
                                <td className="px-6 py-4">{student.totalScore}</td>
                                <td className="px-6 py-4">{student.avgPercentage}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </>
              ) : null}
            </>
          )}
        </main>
      </div>
    </div>
  );
}