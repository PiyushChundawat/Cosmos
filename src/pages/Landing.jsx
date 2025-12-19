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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">

      <header className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-lg py-6 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">COSMOS</h1>

          <button
            onClick={() => handleOptionClick('superadmin')}
            className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium shadow-md"
          >
            SuperAdmin
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center mt-12 mb-8">
        <h2 className="text-6xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent mb-4">COSMOS</h2>

        <p className="text-xl text-gray-600 font-medium tracking-wide">
          Placement • Analytics • Management • Assessment
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className="cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 h-full min-h-[280px] group">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {option.title}
                </h2>

                <div className="text-gray-700 text-base space-y-3 mb-8 leading-relaxed">
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    {option.subtitle1}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    {option.subtitle2}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    {option.subtitle3}
                  </p>
                </div>

                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md group-hover:shadow-lg">
                  {option.title} Portal
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-center text-gray-600">© 2025 COSMOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
