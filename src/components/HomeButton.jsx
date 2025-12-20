import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const HomeButton = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  return (
    <button
      onClick={handleHome}
      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
      title="Go to Home"
    >
      <Home size={20} />
      <span className="hidden sm:inline">Home</span>
    </button>
  );
};

export default HomeButton;