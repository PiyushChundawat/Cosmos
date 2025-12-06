import React from "react";
import { User, BookOpen, Calendar } from "lucide-react";

export default function ProfileCard({ college, course, year }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-emerald-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-slide-in-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg ring-4 ring-emerald-100 animate-pulse-slow">
            <User className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">College</p>
            </div>
            <p className="text-lg font-bold text-gray-800">{college}</p>
          </div>

          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Year</p>
            </div>
            <p className="text-lg font-bold text-gray-800">{year}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Course</p>
            <p className="text-lg font-bold text-gray-800">{course}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
