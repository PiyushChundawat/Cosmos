import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chart from '../../components/Chart';

export default function TPODashboard() {
  const navigate = useNavigate();
  const collegeName = localStorage.getItem('tpo_college') || 'College';
  const userName = localStorage.getItem('tpo_user') || 'User';
  const [activeTab, setActiveTab] = useState('overview');

  const studentPerformanceData = {
    labels: ['Below 40%', '40-70%', 'Above 70%'],
    datasets: [
      {
        label: 'Student Count',
        data: [45, 120, 85],
        backgroundColor: ['#b91c1c', '#ca8a04', '#0C6B2F'],
        borderColor: ['#7f1d1d', '#a16207', '#06451f'],
        borderWidth: 2,
      },
    ],
  };

  const topStudents = [
    { rank: 1, name: 'Aarav Sharma', score: 95, percentage: 95, attempts: 5, subject: 'Mathematics' },
    { rank: 2, name: 'Priya Singh', score: 92, percentage: 92, attempts: 4, subject: 'Physics' },
    { rank: 3, name: 'Arjun Patel', score: 89, percentage: 89, attempts: 3, subject: 'Chemistry' },
    { rank: 4, name: 'Diya Verma', score: 87, percentage: 87, attempts: 4, subject: 'Biology' },
    { rank: 5, name: 'Rohan Kumar', score: 85, percentage: 85, attempts: 3, subject: 'English' },
  ];

  const facultyPerformanceData = {
    labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    datasets: [
      {
        label: 'Avg Student Score',
        data: [85, 78, 82, 88, 75],
        backgroundColor: '#0C6B2F',
        borderColor: '#06451f',
        borderWidth: 2,
      },
    ],
  };

  const facultyStats = [
    { name: 'Dr. Rajesh Kumar', subject: 'Mathematics', avgScore: 85, students: 45, attempts: 180 },
    { name: 'Prof. Anjali Singh', subject: 'Physics', avgScore: 78, students: 42, attempts: 168 },
    { name: 'Dr. Vikram Patel', subject: 'Chemistry', avgScore: 82, students: 40, attempts: 160 },
    { name: 'Prof. Meera Sharma', subject: 'Biology', avgScore: 88, students: 38, attempts: 152 },
    { name: 'Dr. Arjun Mishra', subject: 'English', avgScore: 75, students: 50, attempts: 200 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('tpo_token');
    localStorage.removeItem('tpo_college');
    localStorage.removeItem('tpo_user');
    navigate('/tpo/login', { replace: true });
  };

  const chartOptions = {
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true, max: 150 } },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">

        <header className="bg-white shadow-sm border-b-4 border-[#0C6B2F] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TPO Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">{collegeName} • Welcome, {userName}</p>
            </div>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex gap-4 mb-8 border-b border-gray-300">
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

          {activeTab === 'overview' && (
            <>
              <Card className="mb-8 bg-white border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TPO Portal</h2>
                <p className="text-gray-700">Manage placements and track performance insights.</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card><div className="text-center"><p className="text-gray-600 text-sm">Total Students</p><p className="text-4xl font-bold text-[#0C6B2F] mt-2">250</p></div></Card>
                <Card><div className="text-center"><p className="text-gray-600 text-sm">Faculty Members</p><p className="text-4xl font-bold text-[#0C6B2F] mt-2">15</p></div></Card>
                <Card><div className="text-center"><p className="text-gray-600 text-sm">Avg Score</p><p className="text-4xl font-bold text-[#0C6B2F] mt-2">78.5</p></div></Card>
                <Card><div className="text-center"><p className="text-gray-600 text-sm">Pass Rate</p><p className="text-4xl font-bold text-[#0C6B2F] mt-2">92%</p></div></Card>
              </div>

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

          {activeTab === 'student' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                  <Chart type="bar" data={studentPerformanceData} options={chartOptions} />
                </Card>

                <Card>
                  <Chart type="pie" data={studentPerformanceData} />
                </Card>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#0C6B2F] text-white">
                        <th className="px-6 py-3 text-sm">Rank</th>
                        <th className="px-6 py-3 text-sm">Name</th>
                        <th className="px-6 py-3 text-sm">Subject</th>
                        <th className="px-6 py-3 text-sm">Score</th>
                        <th className="px-6 py-3 text-sm">Percentage</th>
                        <th className="px-6 py-3 text-sm">Attempts</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {topStudents.map((s) => (
                        <tr key={s.rank} className="hover:bg-gray-100">
                          <td className="px-6 py-4 font-semibold">{s.rank}</td>
                          <td className="px-6 py-4">{s.name}</td>
                          <td className="px-6 py-4">{s.subject}</td>
                          <td className="px-6 py-4">{s.score}</td>
                          <td className="px-6 py-4">{s.percentage}%</td>
                          <td className="px-6 py-4">{s.attempts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'faculty' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Faculty Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card><div className="text-center"><p className="text-gray-600 text-sm">Total Faculty</p><p className="text-4xl font-bold text-[#0C6B2F] mt-2">15</p></div></Card>
                <Card><div className="text-center"><p className="text-gray-600 text-sm">Avg Faculty Score</p><p className="text-4xl font-bold text-[#0C6B2F] mt-2">81.6</p></div></Card>
                <Card><div className="text-center"><p className="text-gray-600 text-sm">Total Students</p><p className="text-4xl font-bold text-[#0C6B2F] mt-2">215</p></div></Card>
                <Card><div className="text-center"><p className="text-gray-600 text-sm">Total Attempts</p><p className="text-4xl font-bold text-[#0C6B2F] mt-2">860</p></div></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                  <Chart type="bar" data={facultyPerformanceData} options={chartOptions} />
                </Card>

                <Card>
                  <Chart
                    type="doughnut"
                    data={{
                      labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
                      datasets: [
                        {
                          data: [45, 42, 40, 38, 50],
                          backgroundColor: ['#0C6B2F', '#4b5563', '#6b7280', '#9ca3af', '#374151'],
                          borderWidth: 0,
                        },
                      ],
                    }}
                  />
                </Card>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#0C6B2F] text-white">
                        <th className="px-6 py-3 text-sm">Faculty Name</th>
                        <th className="px-6 py-3 text-sm">Subject</th>
                        <th className="px-6 py-3 text-sm">Avg Score</th>
                        <th className="px-6 py-3 text-sm">Students</th>
                        <th className="px-6 py-3 text-sm">Attempts</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {facultyStats.map((f, i) => (
                        <tr key={i} className="hover:bg-gray-100">
                          <td className="px-6 py-4 font-semibold">{f.name}</td>
                          <td className="px-6 py-4">{f.subject}</td>
                          <td className="px-6 py-4">{f.avgScore}</td>
                          <td className="px-6 py-4">{f.students}</td>
                          <td className="px-6 py-4">{f.attempts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
