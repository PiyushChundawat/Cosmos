import React from "react";
import { Target, Award, Clock } from "lucide-react";

export default function TestStats() {
  const stats = [
    { icon: Target, label: "Tests Taken", value: "24", color: "from-emerald-500 to-green-500" },
    { icon: Award, label: "Average Score", value: "78%", color: "from-green-500 to-emerald-600" },
    { icon: Clock, label: "Study Hours", value: "145h", color: "from-emerald-600 to-green-700" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-emerald-100 hover:shadow-2xl transition-all duration-300 animate-slide-in-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Stats</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-5 border border-emerald-200 hover:scale-105 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-bl-full from-emerald-400 to-green-500" />
            <div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3 group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
