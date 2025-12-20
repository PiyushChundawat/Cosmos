import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeButton from './HomeButton';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Student Analytics', path: '/tpo/student-analytics' },
    { name: 'Faculty Analytics', path: '/tpo/faculty-analytics' },
    { name: 'Dashboard', path: '/tpo/dashboard' }
  ];

  return (
    <aside className="w-64 bg-indigo-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center gap-3 mb-2">
          <HomeButton />
          <h1 className="text-2xl font-bold">TPO Admin</h1>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-xl font-medium transition shadow-md
              ${
                location.pathname === item.path
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
              }
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition shadow-md">
          Logout
        </button>
      </div>
    </aside>
  );
}
