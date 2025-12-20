import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BarChart3, TrendingUp, CheckCircle, Award, Zap, Target, Shield, ArrowRight, Sparkles } from 'lucide-react';
import HomeButton from '../components/HomeButton';

export default function CosmosLanding() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    students: 0,
    tests: 0,
    faculty: 0,
    score: 0
  });
  
  const [isVisible, setIsVisible] = useState({
    features: false,
    analytics: false,
    testimonials: false,
    pricing: false
  });

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    ['features', 'analytics', 'testimonials', 'pricing'].forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible.analytics) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      const targets = { students: 1820, tests: 2450, faculty: 45, score: 76 };
      let step = 0;

      const timer = setInterval(() => {
        step++;
        setCounts({
          students: Math.floor((targets.students / steps) * step),
          tests: Math.floor((targets.tests / steps) * step),
          faculty: Math.floor((targets.faculty / steps) * step),
          score: Math.floor((targets.score / steps) * step)
        });

        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible.analytics]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Priya Sharma",
      college: "SKIT Jaipur",
      dept: "Computer Science",
      text: "The practice tests helped me identify my weak areas before placement season. I improved my aptitude score by 35%.",
      avatar: "PS"
    },
    {
      name: "Rahul Mehta",
      college: "MNIT Jaipur",
      dept: "Electronics",
      text: "Faculty feedback on my resume was incredibly detailed. I landed 3 interview calls in the first week of placements.",
      avatar: "RM"
    },
    {
      name: "Anjali Verma",
      college: "NIT Trichy",
      dept: "Mechanical",
      text: "Tracking my progress over time kept me motivated. The platform made preparation structured and less stressful.",
      avatar: "AV"
    },
    {
      name: "Karan Singh",
      college: "VIT Vellore",
      dept: "Information Technology",
      text: "The variety of practice questions from different faculty gave me comprehensive preparation for all types of companies.",
      avatar: "KS"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">COSMOS</h1>
                <p className="text-xs text-gray-600">Placement readiness, clearly tracked.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HomeButton />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:scale-105" onClick={() => navigate('/landing')}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700">
                <Zap className="w-4 h-4" />
                Trusted by 50+ Institutions
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                One Platform for
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Placement Readiness
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                A comprehensive institutional platform supporting students, faculty, and placement monitoring across your college.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 group" onClick={() => navigate('/tpo/signup')}>
                  Buy Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Colleges</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 animate-float">
              <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-400 transition-all hover:shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Overall Readiness</h3>
                    <p className="text-sm text-gray-500">College Average</p>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                    82%
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 transition-all hover:shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tests Completed</h3>
                  <p className="text-sm text-gray-500 mb-3">This Month</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-1000 shadow-inner" style={{width: '68%'}}></div>
                  </div>
                  <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-3">1,240 / 1,820 Students</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 transition-all hover:shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Student Progress</h3>
                    <p className="text-sm text-gray-500 mb-2">Average Improvement</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">+23%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`relative max-w-7xl mx-auto px-8 py-20 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything Your Institution Needs</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-blue-500 transition-all hover:shadow-2xl hover:-translate-y-3 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">STUDENTS</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Resume review & improvement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Practice tests created by faculty</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Detailed performance breakdown</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Personal readiness tracking</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-blue-500 transition-all hover:shadow-2xl hover:-translate-y-3 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">FACULTY</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Create questions and assessments</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Monitor marks and attempts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Track improvement trends</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Support students individually</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-blue-500 transition-all hover:shadow-2xl hover:-translate-y-3 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">TPOs</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>College-wide readiness visibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Faculty activity tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Early gap identification</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Ensure placement preparedness</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className={`relative max-w-6xl mx-auto px-8 py-20 transition-all duration-1000 ${isVisible.analytics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-gray-200 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-200 rounded-full filter blur-3xl opacity-20 -mr-32 -mb-32"></div>
          
          <div className="relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-4">
                <Shield className="w-4 h-4" />
                Real-Time Data
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Analytics & Control</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real-time insights into placement readiness across your institution</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-blue-400 rounded-2xl p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform inline-block drop-shadow-lg">{counts.students}</div>
                <div className="text-blue-50 font-semibold text-lg">Total Students Registered</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 border-2 border-purple-400 rounded-2xl p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform inline-block drop-shadow-lg">{counts.tests}</div>
                <div className="text-purple-50 font-semibold text-lg">Total Tests Attempted</div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-400 rounded-2xl p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform inline-block drop-shadow-lg">{counts.faculty}</div>
                <div className="text-cyan-50 font-semibold text-lg">Active Faculty Members</div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-400 rounded-2xl p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform inline-block drop-shadow-lg">{counts.score}%</div>
                <div className="text-emerald-50 font-semibold text-lg">Average Test Score</div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-3xl p-10 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-center gap-16">
                <div className="relative">
                  {/* Animated Donut Chart */}
                  <svg className="w-64 h-64 transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="32"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="32"
                      strokeDasharray="628"
                      strokeDashoffset="130"
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.3))'
                      }}
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      fill="none"
                      stroke="url(#gradient2)"
                      strokeWidth="32"
                      strokeDasharray="628"
                      strokeDashoffset="330"
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(139, 92, 246, 0.3))'
                      }}
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      fill="none"
                      stroke="url(#gradient3)"
                      strokeWidth="32"
                      strokeDasharray="628"
                      strokeDashoffset="530"
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(99, 102, 241, 0.3))'
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#4F46E5" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white">
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">2,450</div>
                      <div className="text-xs text-gray-600 font-semibold">Total Attempts</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 w-full md:w-auto">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 hover:shadow-lg transition-all hover:scale-105 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold flex-1">Students</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">1,470</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 hover:shadow-lg transition-all hover:scale-105 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold flex-1">Teachers</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">735</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-5 hover:shadow-lg transition-all hover:scale-105 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold flex-1">TPO Review</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">245</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`relative max-w-7xl mx-auto px-8 py-20 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-4">
            <Award className="w-4 h-4" />
            Student Success
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Students Are Saying</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real feedback from students preparing for placements using COSMOS.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all hover:shadow-xl hover:-translate-y-2 group"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.college}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">{testimonial.text}</p>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-500">{testimonial.dept}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`relative max-w-7xl mx-auto px-8 py-20 transition-all duration-1000 ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-emerald-500 text-white text-sm font-bold px-6 py-2 rounded-bl-3xl shadow-lg">
              50% OFF
            </div>
            
            <div className="text-center relative">
              <div className="text-3xl text-gray-400 line-through mb-2">₹40,000</div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">₹20,000</div>
              <div className="text-base text-gray-600 mb-6">Per College • One-Time Payment</div>
              
              <div className="text-left space-y-3 mb-6">
                <div className="flex items-center gap-3 py-2 border-b border-gray-200 hover:bg-blue-50 rounded-lg px-2 transition-colors">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">One-time institutional pricing</span>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-gray-200 hover:bg-blue-50 rounded-lg px-2 transition-colors">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Unlimited students and faculty</span>
                </div>
                <div className="flex items-center gap-3 py-2 hover:bg-blue-50 rounded-lg px-2 transition-colors">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Complete analytics dashboard</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 group" onClick={() => navigate('/tpo/signup')}>
                Buy Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-xs text-gray-500 mt-3">🔒 Secure payment • 30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-8">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Transform Your Placement Process?</h2>
          <p className="text-xl mb-10 opacity-95">Join 50+ institutions already using COSMOS to improve placement outcomes.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 group" onClick={() => navigate('/tpo/signup')}>
              Buy Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-12 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Setup in 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free training included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">COSMOS</h3>
          </div>
          <p className="text-gray-400 mb-6">Empowering institutions with placement readiness solutions</p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-sm text-gray-500">© 2025 COSMOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}