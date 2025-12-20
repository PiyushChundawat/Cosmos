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

  const [studentPerformance, setStudentPerformance] = useState({
    below_40: [],
    between_40_70: [],
    above_70: []
  });
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

      const performanceRes = await api.get('/analytics/student/performance-bands');
      setStudentPerformance(performanceRes.data.data);

      const topPerformersRes = await api.get('/analytics/student/top-performers');
      setTopStudents(topPerformersRes.data.data);
    } catch (err) {
      setStudentError(err.response?.data?.message || 'Failed to load student analytics');
    } finally {
      setStudentLoading(false);
    }
  };

  const fetchFacultyAnalytics = async () => {
    try {
      setFacultyLoading(true);
      setFacultyError(null);

      const response = await api.get('/analytics/faculty/complete?subject=Mathematics');
      setFacultyAnalytics(response.data.data);
    } catch (err) {
      setFacultyError(err.response?.data?.message || 'Failed to load faculty analytics');
    } finally {
      setFacultyLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'student') fetchStudentAnalytics();
    if (activeTab === 'faculty') fetchFacultyAnalytics();
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
            {['overview', 'student', 'faculty'].map(tab => (
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
                  : tab === 'student'
                  ? 'Student Analytics'
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  className="cursor-pointer hover:border-[#2563EB]"
                  onClick={() => setActiveTab('student')}
                >
                  <h3 className="text-xl font-semibold mb-2">Student Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    Performance distribution & top performers.
                  </p>
                  <Button className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white">
                    View Details
                  </Button>
                </Card>

                <Card
                  className="cursor-pointer hover:border-[#2563EB]"
                  onClick={() => setActiveTab('faculty')}
                >
                  <h3 className="text-xl font-semibold mb-2">Faculty Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    Subject-wise faculty performance insights.
                  </p>
                  <Button className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white">
                    View Details
                  </Button>
                </Card>
              </div>
            </>
          )}

          {/* Student Analytics */}
          {activeTab === 'student' && (
            <>
              <h2 className="text-2xl font-bold text-[#1E40AF]">Student Analytics</h2>

              {studentLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin h-14 w-14 border-b-4 border-[#2563EB] rounded-full mx-auto" />
                  <p className="mt-4 text-gray-600">Loading student analytics...</p>
                </div>
              ) : studentError ? (
                <div className="text-center bg-red-50 p-8 rounded-xl">
                  <p className="text-red-600 font-semibold">{studentError}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <Chart type="bar" data={studentPerformanceData} options={chartOptions} />
                    </Card>
                    <Card>
                      <Chart type="pie" data={studentPerformanceData} />
                    </Card>
                  </div>

                  <Card>
                    <h3 className="text-xl font-semibold mb-4">Top Performers</h3>
                    <table className="w-full">
                      <thead className="bg-[#2563EB] text-white">
                        <tr>
                          <th className="px-4 py-2">Rank</th>
                          <th className="px-4 py-2">Student ID</th>
                          <th className="px-4 py-2">Score</th>
                          <th className="px-4 py-2">Avg %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topStudents.map((s, i) => (
                          <tr key={s.studentId} className="hover:bg-blue-50">
                            <td className="px-4 py-2">{i + 1}</td>
                            <td className="px-4 py-2">{s.studentId}</td>
                            <td className="px-4 py-2">{s.totalScore}</td>
                            <td className="px-4 py-2">{s.avgPercentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </>
              )}
            </>
          )}

          {/* Faculty Analytics */}
          {activeTab === 'faculty' && facultyAnalytics && (
            <>
              <h2 className="text-2xl font-bold text-[#1E40AF]">Faculty Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  ['Avg Score', facultyAnalytics.overallStats?.avgScore],
                  ['Avg %', facultyAnalytics.overallStats?.avgPercentage + '%'],
                  ['Students', facultyAnalytics.overallStats?.totalStudents],
                  ['Attempts', facultyAnalytics.overallStats?.totalAttempts]
                ].map(([label, value], i) => (
                  <Card key={i} className="text-center">
                    <p className="text-gray-500">{label}</p>
                    <p className="text-3xl font-bold text-[#2563EB] mt-2">{value}</p>
                  </Card>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}