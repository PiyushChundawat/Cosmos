import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ⚠️ CONFIGURE THIS
const API_BASE_URL = 'http://localhost:5000/api';

export default function TakeTest() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [testData, setTestData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!token || !studentId) {
      navigate('/student/login');
      return;
    }
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const fetchTest = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/test/${testId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const { test, questions } = response.data.data;
        setTestData(test);
        setQuestions(questions);
        
        // Set timer based on test duration (convert minutes to seconds)
        setTimeRemaining(test.duration * 60);
      }
    } catch (error) {
      console.error('Error fetching test:', error);
      setError(error.response?.data?.message || 'Failed to load test');
      
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/student/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time is up! Test will be submitted automatically.');
    handleSubmitTest();
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    setShowSubmitConfirm(false);

    try {
      // Format answers for backend: [{ questionId, selectedOption }]
      const formattedAnswers = Object.entries(answers).map(([questionIndex, optionIndex]) => ({
        questionId: questions[parseInt(questionIndex)]._id,
        selectedOption: optionIndex
      }));

      const response = await axios.post(
        `${API_BASE_URL}/student/test/${testId}/attempt`,
        {
          studentId,
          answers: formattedAnswers
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert(`Test submitted successfully! Score: ${response.data.data.score}/${response.data.data.totalMarks}`);
        navigate('/student/performance');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already attempted')) {
        alert('You have already attempted this test.');
        navigate('/student/performance');
      } else if (error.response?.status === 403) {
        alert('You are not allowed to attempt this test.');
        navigate('/student/tests');
      } else {
        alert(error.response?.data?.message || 'Failed to submit test. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
          <button
            onClick={() => navigate('/student/tests')}
            className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  if (!testData || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">No questions available for this test.</p>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Timer */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
            <p className={`text-3xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>

          {/* Progress */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{currentQuestion + 1}/{totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total Questions</span>
              <span className="font-semibold">{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Answered</span>
              <span className="font-semibold text-emerald-600">{answeredCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining</span>
              <span className="font-semibold text-red-600">{totalQuestions - answeredCount}</span>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Navigate Questions</p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors
                    ${i === currentQuestion ? 'bg-emerald-600 text-white border-emerald-600'
                    : answers[i] !== undefined ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={submitting}
              className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3 bg-gray-50 border border-gray-200 rounded-xl p-8">
          {/* Question Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Question {currentQuestion + 1} of {totalQuestions}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Marks: {(testData.totalMarks / totalQuestions).toFixed(1)}
            </p>
          </div>

          {/* Question Text */}
          <p className="text-lg font-medium text-gray-900 mb-6">
            {questions[currentQuestion].questionText}
          </p>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {questions[currentQuestion].options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setAnswers({ ...answers, [currentQuestion]: idx })}
                className={`w-full p-4 flex items-center gap-4 rounded-lg border text-left transition-colors
                  ${answers[currentQuestion] === idx
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-300 bg-white hover:bg-gray-100'}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${answers[currentQuestion] === idx ? 'border-emerald-600 bg-emerald-600' : 'border-gray-400'}`}
                >
                  {answers[currentQuestion] === idx && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-900 font-medium">{option}</span>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            <button
              disabled={currentQuestion === totalQuestions - 1}
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Test?</h2>

            <p className="text-gray-700 mb-2">
              You have answered <span className="font-bold text-emerald-600">{answeredCount}</span> out of <span className="font-bold">{totalQuestions}</span> questions.
            </p>

            {answeredCount < totalQuestions && (
              <p className="text-red-600 text-sm mb-4">
                ⚠️ {totalQuestions - answeredCount} questions are unanswered and will be marked as incorrect.
              </p>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}