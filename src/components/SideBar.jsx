import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Student Analytics', path: '/tpo/student-analytics', icon: '📊' },
    { name: 'Faculty Analytics', path: '/tpo/faculty-analytics', icon: '📈' },
    { name: 'Dashboard', path: '/tpo/dashboard', icon: '🏠' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 text-white min-h-screen shadow-lg">
      <div className="p-6 border-b border-emerald-600">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">🎓</span> TPO Admin
        </h1>
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
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition">
          Logout
        </button>
      </div>
    </aside>
  );
}