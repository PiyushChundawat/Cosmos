import React from 'react';

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-emerald-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {icon && (
          <div className="text-4xl opacity-20">
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;