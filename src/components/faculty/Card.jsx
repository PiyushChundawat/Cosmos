import React from 'react';

const Card = ({ children, title, icon, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white border-2 border-indigo-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {title && (
        <div className="flex items-center gap-3 mb-3">
          {icon && <span className="text-indigo-600">{icon}</span>}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

