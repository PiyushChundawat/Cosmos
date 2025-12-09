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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Tests</h1>
          <p className="text-gray-600 mt-1">Create and schedule tests for students</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          CREATE NEW TEST
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Test Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Test</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Mid-Term Examination"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Question Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Questions <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-center">No questions available. Create questions first.</p>
                ) : (
                  <div className="space-y-2">
                    {questions.map((question) => (
                      <label
                        key={question._id}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedQuestions.includes(question._id)}
                          onChange={() => handleQuestionSelect(question._id)}
                          className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
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
              <p className="text-sm text-gray-600 mt-2">
                Selected: {formData.selectedQuestions.length} question(s) | Total Marks: {formData.selectedQuestions.length}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || formData.selectedQuestions.length === 0}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Test...' : 'Create Test'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && tests.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading tests...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-md p-8">
            <p className="text-center text-gray-500">No tests created yet. Create your first test!</p>
          </div>
        ) : (
          tests.map((test) => (
            <div key={test._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{test.testTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    test.status === 'scheduled' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {test.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{test.questionIds?.length || 0} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{test.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDateTime(test.schedule?.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{test.totalMarks} Marks</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/faculty/tests/${test._id}/analytics`)}
                  className="w-full mt-4 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  View Analytics
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageTests;