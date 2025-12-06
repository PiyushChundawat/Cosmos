import React from "react";
import { ArrowRight, ClipboardList } from "lucide-react";

export default function ActionButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-in-up">
      <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl px-8 py-6 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className="flex items-center justify-between">
          <span>Continue Roadmap</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </button>

      <button className="group relative overflow-hidden bg-white border-2 border-emerald-500 text-emerald-600 rounded-2xl px-8 py-6 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:bg-emerald-50 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span>Take a Test</span>
          <ClipboardList className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </div>
      </button>
    </div>
  );
}
