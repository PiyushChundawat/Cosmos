import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HomeButton from '../../components/HomeButton';
import { studentAnalyticsAPI, facultyAnalyticsAPI } from '../../services/api';

export default function TPODashboard() {
  const [collegeName] = useState('St. Xavier College');
  const [userName] = useState('Dr. Smith');
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
  const [facultyLoading, setFaculyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState(null);

  const fetchStudentAnalytics = async () => {
    setStudentLoading(true);
    setStudentError(null);
    
    // Simulate API call with mock data
    setTimeout(() => {
      setStudentPerformance({
        below_40: [1, 2, 3, 4, 5],
        between_40_70: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        above_70: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      });
      
      setTopStudents([
        { studentId: 'STU001', totalScore: 950, avgPercentage: 95, attemptCount: 10 },
        { studentId: 'STU002', totalScore: 920, avgPercentage: 92, attemptCount: 10 },
        { studentId: 'STU003', totalScore: 890, avgPercentage: 89, attemptCount: 10 },
        { studentId: 'STU004', totalScore: 875, avgPercentage: 87.5, attemptCount: 10 },
        { studentId: 'STU005', totalScore: 860, avgPercentage: 86, attemptCount: 10 }
      ]);
      
      setStudentLoading(false);
    }, 1000);
  };

  const fetchFacultyAnalytics = async () => {
    setFaculyLoading(true);
    setFacultyError(null);
    
    // Simulate API call with mock data
    setTimeout(() => {
      setFacultyAnalytics({
        subject: 'Mathematics',
        overallStats: {
          avgScore: 78.5,
          avgPercentage: 78.5,
          totalStudents: 150,
          totalAttempts: 450
        },
        topPerformers: [
          { studentId: 'STU001', totalScore: 480, avgPercentage: 96 },
          { studentId: 'STU002', totalScore: 465, avgPercentage: 93 },
          { studentId: 'STU003', totalScore: 450, avgPercentage: 90 },
          { studentId: 'STU004', totalScore: 440, avgPercentage: 88 },
          { studentId: 'STU005', totalScore: 430, avgPercentage: 86 }
        ]
      });
      
      setFaculyLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (activeTab === 'student') {
      fetchStudentAnalytics();
    } else if (activeTab === 'faculty') {
      fetchFacultyAnalytics();
    }
  }, [activeTab]);

  // Prepare chart data
  const chartData = [
    { name: 'Below 40%', value: studentPerformance.below_40?.length || 0, color: '#b91c1c' },
    { name: '40-70%', value: studentPerformance.between_40_70?.length || 0, color: '#ca8a04' },
    { name: 'Above 70%', value: studentPerformance.above_70?.length || 0, color: '#0C6B2F' }
  ];

  const handleLogout = () => {
    alert('Logout clicked - In production, this would clear tokens and redirect');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* TABS */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-1 shadow-md">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Student Analytics
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === 'faculty'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Faculty Analytics
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Welcome to TPO Portal</h2>
              <p className="opacity-95">Manage placements and track performance insights for {collegeName}.</p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-violet-600 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: "Student Analytics", desc: "View performance distribution and insights", action: () => setActiveTab('student') },
                  { title: "Faculty Analytics", desc: "View subject-wise faculty performance", action: () => setActiveTab('faculty') }
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={item.action}
                    className="bg-white border-2 border-violet-200 rounded-2xl p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <h3 className="font-bold text-gray-800 text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{item.desc}</p>
                    <button className="w-full bg-violet-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-violet-700 transition shadow-md">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Student Analytics Tab */}
        {activeTab === 'student' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Student Analytics</h2>

            {studentLoading ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading student analytics...</p>
              </div>
            ) : studentError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
                <p className="font-semibold mb-3">{studentError}</p>
                <button
                  onClick={fetchStudentAnalytics}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-md"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Distribution (Bar)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Student Count">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Distribution (Pie)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Performers</h3>
                  {topStudents.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No student data available</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Avg Percentage</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {topStudents.map((student, index) => (
                            <tr key={student.studentId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-semibold text-gray-900">{index + 1}</td>
                              <td className="px-6 py-4 text-gray-900">{student.studentId}</td>
                              <td className="px-6 py-4 text-gray-900">{student.totalScore}</td>
                              <td className="px-6 py-4 text-gray-900">{student.avgPercentage}%</td>
                              <td className="px-6 py-4 text-gray-900">{student.attemptCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Faculty Analytics Tab */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Faculty Analytics</h2>

            {facultyLoading ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading faculty analytics...</p>
              </div>
            ) : facultyError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
                <p className="font-semibold mb-3">{facultyError}</p>
                <button
                  onClick={fetchFacultyAnalytics}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-md"
                >
                  Retry
                </button>
              </div>
            ) : facultyAnalytics ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                    <p className="text-gray-600 text-sm font-medium">Avg Score</p>
                    <p className="text-4xl font-bold text-blue-600 mt-3">
                      {facultyAnalytics.overallStats?.avgScore || 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                    <p className="text-gray-600 text-sm font-medium">Avg Percentage</p>
                    <p className="text-4xl font-bold text-blue-600 mt-3">
                      {facultyAnalytics.overallStats?.avgPercentage || 0}%
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                    <p className="text-gray-600 text-sm font-medium">Total Students</p>
                    <p className="text-4xl font-bold text-blue-600 mt-3">
                      {facultyAnalytics.overallStats?.totalStudents || 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                    <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
                    <p className="text-4xl font-bold text-blue-600 mt-3">
                      {facultyAnalytics.overallStats?.totalAttempts || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Top Performers ({facultyAnalytics.subject})
                  </h3>
                  {facultyAnalytics.topPerformers?.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No data available</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Avg Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {facultyAnalytics.topPerformers?.map((student, index) => (
                            <tr key={student.studentId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-semibold text-gray-900">{index + 1}</td>
                              <td className="px-6 py-4 text-gray-900">{student.studentId}</td>
                              <td className="px-6 py-4 text-gray-900">{student.totalScore}</td>
                              <td className="px-6 py-4 text-gray-900">{student.avgPercentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}