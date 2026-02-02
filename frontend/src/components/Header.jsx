import React from 'react';
import HomeButton from './HomeButton';

const Header = ({ title = 'COSMOS', rightContent }) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-lg py-6 px-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <HomeButton />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{title}</h1>
        </div>
        {rightContent}
      </div>
    </header>
  );
};

export default Header;