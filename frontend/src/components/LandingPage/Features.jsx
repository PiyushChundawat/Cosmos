import { FileText, Map, ClipboardCheck, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Resume Score',
    description: 'Get an AI-powered score with actionable improvements to make your resume stand out.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Map,
    title: 'Roadmap Builder',
    description: 'Personalized career roadmap tailored to your goals and current skill level.',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: ClipboardCheck,
    title: 'Skill Tests',
    description: 'Identify your strengths and areas for improvement with comprehensive assessments.',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description: 'Track your progress, monitor skill development, and visualize your growth journey.',
    gradient: 'from-cyan-600 to-blue-700',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to{' '}
            <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools designed to accelerate your career growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className={`w-14 h-14 bg-linear-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
