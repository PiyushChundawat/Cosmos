import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';
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
    endTime: '',
  });

  const token = localStorage.getItem('token') || localStorage.getItem('facultyToken');
  const facultyId = localStorage.getItem('facultyId');

  useEffect(() => {
    if (!token || !facultyId) {
      navigate('/faculty/login');
      return;
    }
    fetchTests();
    fetchQuestions();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/faculty/tests/${facultyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setTests(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tests:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/faculty/login');
        return;
      }
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/faculty/questions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuestions(response.data.data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/faculty/login');
        return;
      }
      setQuestions([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionSelect = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.includes(id)
        ? prev.selectedQuestions.filter((q) => q !== id)
        : [...prev.selectedQuestions, id],
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      duration: '',
      selectedQuestions: [],
      startTime: '',
      endTime: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend will get collegeId from token
      const testData = {
        testTitle: formData.title,
        questionIds: formData.selectedQuestions,
        duration: Number(formData.duration),
        totalMarks: formData.selectedQuestions.length,
        schedule: {
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          isScheduled: true,
        },
      };

      const response = await api.post('/faculty/tests', testData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Test created successfully!');
        setShowCreateForm(false);
        resetForm();
        fetchTests();
      }
    } catch (err) {
      console.error('Error creating test:', err);
      
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        navigate('/faculty/login');
        return;
      }
      
      setError(err.response?.data?.message || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) =>
    date
      ? new Date(date).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : 'Not scheduled';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-indigo-600">Test Management</h2>
            <p className="text-gray-600">Create and schedule tests</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md hover:bg-indigo-700 transition"
          >
            {showCreateForm ? 'CANCEL' : 'CREATE NEW TEST'}
          </button>
        </section>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl text-red-700">
            ⚠️ {error}
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-600 hover:text-red-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {showCreateForm && (
          <section className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-indigo-600 mb-6">
              Create New Test
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  placeholder="e.g., Data Structures Midterm"
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
                  required
                  min="1"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  placeholder="60"
                />
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
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
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
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Questions <span className="text-red-500">*</span>
                  <span className="ml-2 text-indigo-600">({formData.selectedQuestions.length} selected)</span>
                </label>

                {questions.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
                    No questions available. Please create questions first.
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-xl p-4 space-y-2">
                    {questions.map((q) => (
                      <label
                        key={q._id}
                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedQuestions.includes(q._id)}
                          onChange={() => handleQuestionSelect(q._id)}
                          disabled={loading}
                          className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{q.questionText}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {q.tags?.subject} • {q.tags?.topic}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || formData.selectedQuestions.length === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? 'Creating Test...' : 'Create Test'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition disabled:opacity-50 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-emerald-600 mb-4">
            Your Tests
          </h2>

          {loading && tests.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tests...</p>
            </div>
          ) : tests.length === 0 ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 p-12 rounded-xl text-center">
              <p className="text-gray-600 mb-4">No tests created yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
              >
                Create Your First Test
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tests.map((test) => (
                <div
                  key={test._id}
                  className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{test.testTitle}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>⏱️ Duration: {test.duration} minutes</p>
                    <p>📝 Questions: {test.questionIds?.length || 0}</p>
                    <p>📊 Total Marks: {test.totalMarks}</p>
                    <p>📅 Start: {formatDateTime(test.schedule?.startTime)}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/faculty/tests/${test._id}/analytics`)}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                  >
                    View Analytics
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManageTests;