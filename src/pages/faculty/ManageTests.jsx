import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ManageTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    selectedQuestions: [],
    startTime: '',
    endTime: ''
  });

  const facultyId = "675a1234567890abcdef1234"; // Hardcoded for demo

  useEffect(() => {
    fetchTests();
    fetchQuestions();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    setError('');
    try {
      // Match backend: GET /api/faculty/tests/:facultyId
      const response = await api.get(`/faculty/tests/${facultyId}`);
      console.log('Tests response:', response.data);
      
      if (response.data.success) {
        setTests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/faculty/questions');
      console.log('Questions response:', response.data);
      
      setQuestions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionSelect = (questionId) => {
    const isSelected = formData.selectedQuestions.includes(questionId);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedQuestions: formData.selectedQuestions.filter(id => id !== questionId)
      });
    } else {
      setFormData({
        ...formData,
        selectedQuestions: [...formData.selectedQuestions, questionId]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const testData = {
        facultyId,
        collegeId: "675a1234567890abcdef5678", // Hardcoded collegeId for demo
        testTitle: formData.title,
        questionIds: formData.selectedQuestions,
        schedule: {
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          isScheduled: true
        },
        duration: parseInt(formData.duration),
        totalMarks: formData.selectedQuestions.length
      };

      console.log('Creating test with data:', testData);

      // Match backend: POST /api/faculty/tests
      const response = await api.post('/faculty/tests', testData);
      console.log('Test creation response:', response.data);

      if (response.data.success) {
        alert('Test created successfully!');
        setShowCreateForm(false);
        resetForm();
        fetchTests();
      }
    } catch (error) {
      console.error('Error creating test:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to create test');
      alert(error.response?.data?.message || 'Failed to create test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      duration: '',
      selectedQuestions: [],
      startTime: '',
      endTime: ''
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Tests</h1>
              <p className="text-gray-600 mt-2">Create and schedule tests for students</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              CREATE NEW TEST
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
              {error}
            </div>
          )}

          {showCreateForm && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Create New Test</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Mid-Term Examination"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 90"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Questions <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-xl p-6 max-h-64 overflow-y-auto bg-gray-50">
                    {questions.length === 0 ? (
                      <p className="text-gray-500 text-center">No questions available. Create questions first.</p>
                    ) : (
                      <div className="space-y-3">
                        {questions.map((question) => (
                          <label
                            key={question._id}
                            className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedQuestions.includes(question._id)}
                              onChange={() => handleQuestionSelect(question._id)}
                              className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <span className="text-sm text-gray-700 block">{question.questionText}</span>
                              {question.tags && (
                                <span className="text-xs text-gray-500 mt-1 block">
                                  {question.tags.subject} • {question.tags.topic}
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Selected: {formData.selectedQuestions.length} question(s) | Total Marks: {formData.selectedQuestions.length}
                  </p>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading || formData.selectedQuestions.length === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? 'Creating Test...' : 'Create Test'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && tests.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading tests...</p>
              </div>
            ) : tests.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <p className="text-center text-gray-600">No tests created yet. Create your first test!</p>
              </div>
            ) : (
              tests.map((test) => (
                <div key={test._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{test.testTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        test.status === 'scheduled' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {test.status}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{test.questionIds?.length || 0} Questions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{test.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDateTime(test.schedule?.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{test.totalMarks} Marks</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/faculty/tests/${test._id}/analytics`)}
                      className="w-full mt-6 px-4 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium"
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTests;