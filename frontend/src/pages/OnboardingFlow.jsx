import { useState } from 'react';
import GoalSelection from '../components/GoalSelection';
import ResumeUpload from '../components/ResumeUpload';
import ResumeAnalysis from '../components/ResumeAnalysis';

function OnboardingFlow() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setTimeout(() => setCurrentPage(2), 300);
  };

  const handleResumeUpload = (fileName) => {
    setResumeData({
      fileName,
      uploadDate: new Date(),
    });

    setTimeout(() => setCurrentPage(3), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">

          {/* Top Logo + Steps */}
          <div className="flex items-center justify-between mb-12">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                CareerPath
              </span>
            </div>

            {/* Step indicators */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentPage >= step
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>

                  {step < 3 && (
                    <div
                      className={`w-12 h-1 mx-1 rounded transition-all duration-300 ${
                        currentPage > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Page Content */}
          <div className="transition-all duration-500">
            {currentPage === 1 && (
              <GoalSelection 
                onGoalSelect={handleGoalSelect} 
                selectedGoal={selectedGoal} 
              />
            )}

            {currentPage === 2 && (
              <ResumeUpload 
                onUploadComplete={handleResumeUpload} 
                goal={selectedGoal} 
              />
            )}

            {currentPage === 3 && (
              <ResumeAnalysis 
                resumeData={resumeData} 
                goal={selectedGoal} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
