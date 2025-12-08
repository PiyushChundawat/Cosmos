import React from 'react';

const Card = ({ children, title, icon, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md border border-emerald-100 p-6 hover:shadow-lg transition-shadow duration-200 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <span className="text-emerald-600">{icon}</span>}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
