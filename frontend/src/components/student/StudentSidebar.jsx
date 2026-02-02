import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function StudentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const studentName = localStorage.getItem('student_name') || 'Student';

  const menuItems = [
    { name: 'Dashboard', path: '/student/dashboard' },
    { name: 'Upcoming Tests', path: '/student/tests' },
    { name: 'Performance', path: '/student/performance' },
    { name: 'Resume Analysis', path: '/student/resume' },
    { name: 'Profile', path: '/student/profile' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_name');
    localStorage.removeItem('student_email');
    navigate('/student/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white min-h-screen border-r border-blue-800 fixed left-0 top-0 z-40 shadow-xl">

      {/* HEADER (ONLY COSMOS TEXT) */}
      <div className="p-6 border-b border-blue-500/30">
        <h1 className="text-2xl font-bold tracking-wide">COSMOS</h1>
        <p className="text-blue-100 text-sm mt-1">Placement Portal</p>
      </div>

      {/* Welcome Section */}
      <div className="p-6 border-b border-blue-500/30 bg-white/5">
        <p className="text-blue-100 text-sm">Welcome,</p>
        <p className="text-white font-semibold text-lg">{studentName}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-white text-blue-600 shadow-lg'
                : 'text-blue-50 hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
