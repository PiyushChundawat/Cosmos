import React from 'react';

export default function Card({
  children,
  className = '',
  title,
  icon,
}) {
  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}