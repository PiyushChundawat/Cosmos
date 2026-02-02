import React from 'react';

function StatCard({ title, value, icon, gradient = "from-blue-500 to-indigo-600", textColor = "text-blue-100" }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs ${textColor} font-medium`}>{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
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