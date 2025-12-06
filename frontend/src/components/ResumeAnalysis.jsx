import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import {
  TrendingUp,
  Award,
  Target,
  AlertCircle,
  CheckCircle2,
  Code,
  Database,
  Globe,
  ArrowRight,
} from 'lucide-react';

function ResumeAnalysis({ resumeData, goal }) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [overallScore] = useState(78);

  useEffect(() => {
    setTimeout(() => setShowAnalysis(true), 300);
  }, []);

  const skills = [
    { name: 'JavaScript', level: 85, icon: Code },
    { name: 'React', level: 90, icon: Code },
    { name: 'Node.js', level: 75, icon: Database },
    { name: 'TypeScript', level: 70, icon: Code },
    { name: 'REST APIs', level: 80, icon: Globe },
  ];

  const strengths = [
    'Strong frontend development skills',
    'Good understanding of modern frameworks',
    'Clean code practices',
  ];

  const improvements = [
    'Add more backend experience',
    'Include system design projects',
    'Highlight leadership experience',
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Resume Analysis
        </h1>
        <p className="text-gray-600 text-lg">
          AI-powered insights for your{' '}
          {goal === 'internship'
            ? 'internship'
            : goal === 'placement'
            ? 'placement'
            : 'learning'}{' '}
          journey
        </p>
      </div>

      {showAnalysis && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center animate-scaleIn">
              <div className="relative w-40 h-40 mb-6">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 70 * (1 - overallScore / 100)
                    }`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {overallScore}
                  </span>
                  <span className="text-gray-600 text-sm">Overall Score</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Good Profile</span>
                </div>
                <p className="text-sm text-gray-600">{resumeData?.fileName}</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-xl p-8 animate-slideInRight">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Skills Analysis
                  </h2>
                </div>

                <div className="space-y-4">
                  {skills.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">
                              {skill.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            {skill.level}%
                          </span>
                        </div>

                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${skill.level}%`,
                              transitionDelay: `${index * 100}ms`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-xl p-8 animate-slideInLeft">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Strengths</h2>
              </div>

              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl hover:bg-white transition-all duration-300"
                  >
                    <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl shadow-xl p-8 animate-slideInRight">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Areas to Improve
                </h2>
              </div>

              <ul className="space-y-3">
                {improvements.map((improvement, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl hover:bg-white transition-all duration-300"
                  >
                    <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link to  ="/dashboard" className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3">
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
      
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalysis;
