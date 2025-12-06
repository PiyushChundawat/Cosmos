import React from "react";
import { Flame } from "lucide-react";

export default function ActivityHeatmap() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeks = 4;

  const generateActivity = () => {
    const levels = ['none', 'low', 'medium', 'high'];
    return Array.from({ length: weeks }, () =>
      Array.from({ length: 7 }, () => levels[Math.floor(Math.random() * levels.length)])
    );
  };

  const activityData = generateActivity();

  const getColorClass = (level) => {
    switch (level) {
      case 'high': return 'bg-emerald-600 shadow-lg';
      case 'medium': return 'bg-emerald-400';
      case 'low': return 'bg-emerald-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-emerald-100 hover:shadow-2xl transition-all duration-300 animate-slide-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Flame className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Activity Heatmap</h2>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day, index) => (
            <div key={index} className="text-center text-xs font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          {activityData.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="grid grid-cols-7 gap-2 animate-fade-in"
              style={{ animationDelay: `${weekIndex * 0.1}s` }}
            >
              {week.map((level, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`aspect-square rounded-lg ${getColorClass(level)} hover:scale-110 transition-all duration-200 cursor-pointer`}
                  title={`Activity: ${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 mt-4 pt-4 border-t border-gray-200">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-100"></div>
          <div className="w-4 h-4 rounded bg-emerald-200"></div>
          <div className="w-4 h-4 rounded bg-emerald-400"></div>
          <div className="w-4 h-4 rounded bg-emerald-600"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
