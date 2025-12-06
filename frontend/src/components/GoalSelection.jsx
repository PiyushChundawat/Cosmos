import { Target, Briefcase, GraduationCap } from 'lucide-react';

const goals = [
  {
    id: 'internship',
    title: 'Internship',
    description: 'Find and prepare for internship opportunities',
    icon: Target,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'placement',
    title: 'Placement (SDE)',
    description: 'Land your dream software engineering role',
    icon: Briefcase,
    gradient: 'from-blue-600 to-blue-500',
  },
  {
    id: 'learning',
    title: 'Learning',
    description: 'Upskill and expand your knowledge',
    icon: GraduationCap,
    gradient: 'from-cyan-500 to-blue-400',
  },
];

function GoalSelection({ onGoalSelect, selectedGoal }) {
  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
          What's Your Goal?
        </h1>
        <p className="text-gray-600 text-lg">
          Choose your career path and let's build your future together
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.id;

          return (
            <button
              key={goal.id}
              onClick={() => onGoalSelect(goal.id)}
              className={`group relative p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/50'
                  : 'bg-white hover:shadow-2xl shadow-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    isSelected
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br ' + goal.gradient
                  }`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3
                  className={`text-2xl font-bold mb-3 ${
                    isSelected ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {goal.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed ${
                    isSelected ? 'text-blue-50' : 'text-gray-600'
                  }`}
                >
                  {goal.description}
                </p>

                <div
                  className={`mt-6 w-12 h-1 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-white w-full'
                      : 'bg-gradient-to-r ' + goal.gradient + ' group-hover:w-full'
                  }`}
                ></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GoalSelection;
