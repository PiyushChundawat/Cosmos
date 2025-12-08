import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TakeTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const questions = [
    {
      id: 1,
      text: 'What is the next number in the sequence: 2, 4, 8, 16, ?',
      options: ['24', '32', '30', '28'],
    },
    {
      id: 2,
      text: 'If A is taller than B, and B is taller than C, who is the shortest?',
      options: ['A', 'B', 'C', 'Cannot determine'],
    },
    {
      id: 3,
      text: 'Complete the pattern: ABC, DEF, GHI, ?',
      options: ['JKL', 'KLM', 'LMN', 'MNO'],
    },
    {
      id: 4,
      text: 'Which number is the odd one out: 2, 4, 6, 9, 10?',
      options: ['2', '4', '9', '10'],
    },
    {
      id: 5,
      text: 'If today is Monday, what day will it be 100 days from now?',
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    },
  ];

  const totalQuestions = questions.length;
  const totalMarks = totalQuestions * 2;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handleSubmitTest = () => {
    // Calculate score
    const answered = Object.keys(answers).length;
    alert(`Test submitted!\nQuestions answered: ${answered}/${totalQuestions}`);
    navigate('/student/performance');
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Test Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 space-y-6">
              {/* Timer */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
                <div className={`text-3xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>

              <div className="border-t pt-6">
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{currentQuestion + 1}/{totalQuestions}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Questions</span>
                    <span className="font-bold text-emerald-700">{totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Answered</span>
                    <span className="font-bold text-blue-700">{answeredCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Remaining</span>
                    <span className="font-bold text-orange-700">{totalQuestions - answeredCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Marks</span>
                    <span className="font-bold text-purple-700">{totalMarks}</span>
                  </div>
                </div>
              </div>

              {/* Question Navigator */}
              <div className="border-t pt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick Navigation</p>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        index === currentQuestion
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                          : answers[index] !== undefined
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Right - Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Question Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </h2>
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold">
                    2 Marks
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <p className="text-xl text-gray-900 leading-relaxed">
                  {questions[currentQuestion].text}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      answers[currentQuestion] === index
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === index
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {answers[currentQuestion] === index && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="flex-1 font-medium text-gray-900 text-lg">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`flex-1 py-4 rounded-lg font-bold transition-all ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  ← Previous Question
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentQuestion === totalQuestions - 1}
                  className={`flex-1 py-4 rounded-lg font-bold transition-all ${
                    currentQuestion === totalQuestions - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg'
                  }`}
                >
                  Next Question →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Test?</h2>
            <p className="text-gray-600 mb-6">
              You have answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions.
              {answeredCount < totalQuestions && (
                <span className="text-orange-600 block mt-2">
                  ⚠️ You still have {totalQuestions - answeredCount} unanswered questions.
                </span>
              )}
            </p>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit? You cannot change your answers after submission.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
