import React from 'react';

export default function Card({
  children,
  className = '',
  title,
  icon,
}) {
  return (
    <div className={`bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}