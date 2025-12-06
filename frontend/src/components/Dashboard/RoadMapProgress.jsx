import React from "react";
import { MapPin, CheckCircle2, Circle } from "lucide-react";

export default function RoadMapProgress() {
  const roadmapItems = [
    { id: 1, title: "Resume Building", completed: true },
    { id: 2, title: "Aptitude Basics", completed: true },
    { id: 3, title: "Technical Skills", completed: true },
    { id: 4, title: "Mock Interviews", completed: false },
    { id: 5, title: "Advanced Coding", completed: false },
  ];

  const completedCount = roadmapItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / roadmapItems.length) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-emerald-100 hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-800">Roadmap Progress</h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">Overall Progress</span>
          <span className="text-sm font-bold text-emerald-600">
            {completedCount}/{roadmapItems.length} Completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {roadmapItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 transition-colors duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {item.completed ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 animate-check" />
            ) : (
              <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
            )}
            <span className={`font-medium ${item.completed ? "text-gray-800" : "text-gray-500"}`}>
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
