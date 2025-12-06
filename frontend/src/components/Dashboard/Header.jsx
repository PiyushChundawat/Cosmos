import React from "react";
import { GraduationCap } from "lucide-react";

export default function Header({ studentName }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg animate-bounce-slow">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
          Welcome, {studentName}!
        </h1>
      </div>
    </div>
  );
}
