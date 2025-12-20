import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Home } from 'lucide-react';
import HomeButton from '../HomeButton';

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentName = localStorage.getItem('student_name') || 'Student';

  const menuItems = [
    { name: 'Dashboard', path: '/student/dashboard' },
    { name: 'Upcoming Tests', path: '/student/tests' },
    { name: 'Performance', path: '/student/performance' },
    { name: 'Resume Analysis', path: '/student/resume' },
    { name: 'Profile', path: '/student/profile' }
  ];

  const handleHome = () => {
    navigate('/'); // ✅ Homepage
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_name');
    navigate('/student/login');
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-indigo-700 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <HomeButton onClick={handleHome} />
          <h1 className="text-xl font-bold">COSMOS</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex">

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64
          bg-indigo-700 text-white border-r border-indigo-900
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300`}
        >
          <div className="p-6 border-b border-indigo-900">
            <div className="flex items-center gap-3 mb-2">
              <HomeButton onClick={handleHome} />
              <h1 className="text-2xl font-bold">COSMOS</h1>
            </div>
            <p className="text-indigo-200 text-sm">Placement Portal</p>
          </div>

          <div className="p-6 border-b border-indigo-900">
            <p className="text-indigo-100 text-sm">Welcome,</p>
            <p className="font-semibold text-lg truncate">{studentName}</p>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition ${
                  location.pathname === item.path
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <button
              onClick={handleHome}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Home
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
