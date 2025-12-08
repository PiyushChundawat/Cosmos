import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Student Analytics', path: '/tpo/student-analytics' },
    { name: 'Faculty Analytics', path: '/tpo/faculty-analytics' },
    { name: 'Dashboard', path: '/tpo/dashboard' }
  ];

  return (
    <aside className="w-64 bg-[#0C6B2F] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-green-900">
        <h1 className="text-2xl font-bold">TPO Admin</h1>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-md font-medium transition 
              ${
                location.pathname === item.path
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-800'
              }
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4">
        <button className="w-full bg-[#B91C1C] hover:bg-[#7F1D1D] text-white font-semibold py-2 rounded-md">
          Logout
        </button>
      </div>
    </aside>
  );
}
