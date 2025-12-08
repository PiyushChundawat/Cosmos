import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function StudentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
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
    localStorage.removeItem('student_email');
    navigate('/student/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 text-white min-h-screen shadow-lg fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-emerald-600">
        <h1 className="text-2xl font-bold">🚀 COSMOS</h1>
        <p className="text-emerald-200 text-sm mt-1">Placement Portal</p>
      </div>

      <div className="p-6 border-b border-emerald-600">
        <p className="text-emerald-100 text-sm">Welcome,</p>
        <p className="text-white font-semibold text-lg">{studentName}</p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
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

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}