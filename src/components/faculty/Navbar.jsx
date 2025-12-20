import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../HomeButton';

const Navbar = ({ facultyName = 'Faculty' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('facultyToken');
    localStorage.removeItem('facultyName');
    navigate('/faculty/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-3">
            <HomeButton />

            {/* Icon */}
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-blue-800">
              Faculty Portal
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-sm">
                  {facultyName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {facultyName}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
