import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const options = [
    {
      id: 'student',
      title: 'Student',
      subtitle1: 'Detailed resume scoring to identify improvement areas.',
      subtitle2: 'Attempt structured skill-based placement tests.',
      subtitle3: 'View progress reports and performance tracking.'
    },
    {
      id: 'faculty',
      title: 'Faculty',
      subtitle1: 'Monitor batch performance with visual analytics.',
      subtitle2: 'Create and manage assessments effortlessly.',
      subtitle3: 'Review student progress with detailed insights.'
    },
    {
      id: 'tpo',
      title: 'TPO',
      subtitle1: 'Manage all placement activities efficiently.',
      subtitle2: 'Analyze institute readiness with dashboards.',
      subtitle3: 'Plan and track recruitment drives easily.'
    }
  ];

  const handleOptionClick = (id) => {
    if (id === 'tpo') navigate('/tpo/login');
    else if (id === 'student') navigate('/student/login');
    else if (id === 'faculty') navigate('/faculty/login');
    else if (id === 'superadmin') navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <header className="w-full bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">COSMOS</h1>

        <button
          onClick={() => handleOptionClick('superadmin')}
          className="text-sm bg-gray-900 text-white px-4 py-2 rounded-md"
        >
          SuperAdmin
        </button>
      </header>

      <div className="flex flex-col items-center mt-8">
        <h2 className="text-5xl font-bold text-gray-900">COSMOS</h2>

        <p className="text-lg text-gray-600 mt-3 tracking-wide">
          Placement • Analytics • Management • Assessment
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className="cursor-pointer"
            >
              <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 h-full min-h-[250px] transition-all">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {option.title}
                </h2>

                <div className="text-gray-700 text-sm space-y-1.5 mb-6 leading-snug">
                  <p>{option.subtitle1}</p>
                  <p>{option.subtitle2}</p>
                  <p>{option.subtitle3}</p>
                </div>

                <button className="w-full bg-emerald-600 text-white font-medium py-2 rounded-lg hover:bg-emerald-700 transition-all text-sm">
                  {option.title} Portal
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-6">
        <p>© 2025 COSMOS. All rights reserved.</p>
      </footer>
    </div>
  );
}
