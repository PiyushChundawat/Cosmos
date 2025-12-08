import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import CollegeTable from '../components/CollegeTable';

function Dashboard() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-emerald-600">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-emerald-600">Super</span>Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">Welcome to the admin panel</p>
          </div>

          {/* Logout Button */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Logout
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Colleges Enrolled"
              value="17"
              icon="🏫"
            />
            <StatCard
              title="Active Plans"
              value="2"
              icon="✅"
            />
            <StatCard
              title="Trial Plans"
              value="1"
              icon="📋"
            />
            <StatCard
              title="Total Revenue"
              value="₹500000"
              icon="💰"
            />
          </div>
        </div>

        {/* Table Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrolled Colleges</h2>
          <CollegeTable />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-12">
        <p>&copy; 2025 SuperAdmin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;