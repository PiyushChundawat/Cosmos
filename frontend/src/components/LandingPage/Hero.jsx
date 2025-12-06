import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-cyan-50 pt-20 pb-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjMzk0M2ZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Growth
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your smart{' '}
              <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                career mentor
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AI-powered resume analysis, personalized roadmaps & skill growth.
              Transform your career trajectory with intelligent insights and guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group bg-linear-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button><link to ="/login">
              <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                Login
              </button></link>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-cyan-400 rounded-3xl transform rotate-6 opacity-20 blur-2xl"></div>
              <div className="relative bg-linear-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-linear-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                      <svg className="w-20 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
                      <div className="h-3 bg-blue-200 rounded-full w-2/3 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
