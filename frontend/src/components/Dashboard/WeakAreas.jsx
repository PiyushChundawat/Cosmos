import React from "react";
import { AlertCircle, TrendingDown } from "lucide-react";

export default function WeakAreas() {
  const weakAreas = [
    { id: 1, subject: "Data Structures", score: 45 },
    { id: 2, subject: "Logical Reasoning", score: 52 },
    { id: 3, subject: "Verbal Ability", score: 58 },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-emerald-100 hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="w-6 h-6 text-amber-500" />
        <h2 className="text-2xl font-bold text-gray-800">Weak Areas</h2>
      </div>

      <div className="space-y-4">
        {weakAreas.map((area, index) => (
          <div
            key={area.id}
            className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:shadow-md transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-gray-800">{area.subject}</span>
              </div>
              <span className="text-sm font-bold text-amber-600">{area.score}%</span>
            </div>

            <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${area.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-emerald-700">Tip:</span> Focus on these areas to improve your overall placement readiness!
        </p>
      </div>
    </div>
  );
}
