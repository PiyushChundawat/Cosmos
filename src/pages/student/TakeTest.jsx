import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TakeTest() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const questions = [
    { id: 1, text: 'What is the next number in the sequence: 2, 4, 8, 16, ?', options: ['24', '32', '30', '28'] },
    { id: 2, text: 'If A is taller than B, and B is taller than C, who is the shortest?', options: ['A', 'B', 'C', 'Cannot determine'] },
    { id: 3, text: 'Complete the pattern: ABC, DEF, GHI, ?', options: ['JKL', 'KLM', 'LMN', 'MNO'] },
    { id: 4, text: 'Which number is the odd one out: 2, 4, 6, 9, 10?', options: ['2', '4', '9', '10'] },
    { id: 5, text: 'If today is Monday, what day will it be 100 days from now?', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
  ];

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/student/performance');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleSubmitTest = () => {
    navigate('/student/performance');
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
            <p className={`text-3xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{currentQuestion + 1}/{totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total Questions</span>
              <span className="font-semibold">{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Answered</span>
              <span className="font-semibold">{answeredCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining</span>
              <span className="font-semibold">{totalQuestions - answeredCount}</span>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Navigate Questions</p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium border 
                    ${i === currentQuestion ? 'bg-emerald-600 text-white border-emerald-600'
                    : answers[i] !== undefined ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg"
            >
              Submit Test
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 bg-gray-50 border border-gray-200 rounded-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Question {currentQuestion + 1} of {totalQuestions}
            </h2>
            <p className="text-gray-600 text-sm mt-1">Marks: 2</p>
          </div>

          <p className="text-lg font-medium text-gray-900 mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="space-y-4 mb-8">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setAnswers({ ...answers, [currentQuestion]: idx })}
                className={`w-full p-4 flex items-center gap-4 rounded-lg border text-left 
                  ${answers[currentQuestion] === idx
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-300 bg-white hover:bg-gray-100'}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border 
                    ${answers[currentQuestion] === idx ? 'border-emerald-600 bg-emerald-600' : 'border-gray-400'}`}
                />
                <span className="text-gray-900 font-medium">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={currentQuestion === totalQuestions - 1}
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Test</h2>

            <p className="text-gray-700 mb-6">
              You answered {answeredCount} out of {totalQuestions} questions.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitTest}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
