import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const studentName = localStorage.getItem('student_name') || 'Student';

  const menuItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: '🏠' },
    { name: 'Upcoming Tests', path: '/student/tests', icon: '📝' },
    { name: 'Performance', path: '/student/performance', icon: '📊' },
    { name: 'Resume Analysis', path: '/student/resume', icon: '📄' },
    { name: 'Profile', path: '/student/profile', icon: '👤' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_name');
    navigate('/student/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold">🚀 COSMOS</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-emerald-700 to-green-800 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          {/* Logo */}
          <div className="p-6 border-b border-emerald-600">
            <h1 className="text-2xl font-bold">🚀 COSMOS</h1>
            <p className="text-emerald-200 text-sm mt-1">Placement Portal</p>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-emerald-600">
            <p className="text-emerald-100 text-sm">Welcome,</p>
            <p className="text-white font-semibold text-lg truncate">{studentName}</p>
          </div>

          {/* Menu */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'hover:bg-emerald-600 text-emerald-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
