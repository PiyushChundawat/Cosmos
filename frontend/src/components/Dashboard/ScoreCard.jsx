import React from "react";
import { TrendingUp } from "lucide-react";

export default function ScoreCard({ title, score, maxScore, delay = "0s" }) {
  const percentage = (score / maxScore) * 100;

  return (
    <div
      className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl shadow-xl p-6 border-2 border-emerald-200 hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 animate-slide-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <div className="bg-emerald-500 p-2 rounded-xl">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
            {score}
          </span>
          <span className="text-2xl font-semibold text-gray-400 mb-2">/ {maxScore}</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000 ease-out animate-progress"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 mt-3 font-medium">
        {percentage.toFixed(0)}% Complete
      </p>
    </div>
  );
}
