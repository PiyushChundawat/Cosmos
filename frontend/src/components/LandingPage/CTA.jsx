import { ArrowRight, Rocket } from 'lucide-react';
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24 bg-linear-to-br from-blue-600 to-cyan-600">
      {/* Background Pattern */}
      <div>
        className="absolute inset-0 opacity-30 bg-[url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+\")]
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          <Rocket className="h-4 w-4" />
          Start Your Journey Today
        </div>

        {/* Heading */}
        <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
          Ready to grow your career?
        </h2>

        {/* Subtext */}
        <p className="mx-auto mb-10 max-w-2xl text-xl text-blue-100">
          Join thousands of students who are already transforming their careers with AI-powered guidance
        </p>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button className="group flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-2xl">
            Get Started
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
         <Link to="/login">
          <button className="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-white hover:text-blue-600">
            Login
          </button></Link>
        </div>
      </div>
    </section>
  );
}