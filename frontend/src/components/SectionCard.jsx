import React from 'react';

const SectionCard = ({ icon, title, children, badge, highlight }) => {
  const highlightColors = {
    success: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
    warning: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
    default: 'from-slate-800 to-slate-700 border-white/10 hover:border-blue-500/30'
  };

  const colorClass = highlight ? highlightColors[highlight] : highlightColors.default;

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      <div className={`relative bg-gradient-to-br ${colorClass} rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 transform hover:scale-102 hover:-translate-y-1`}>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
              {icon}
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>

          {badge && (
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {badge}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default SectionCard;
