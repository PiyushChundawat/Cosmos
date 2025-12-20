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

  const facultyId = '675a1234567890abcdef1234';

  useEffect(() => {
    fetchTests();
    fetchQuestions();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/faculty/tests/${facultyId}`);
      if (response.data.success) {
        setTests(response.data.data || []);
      }
    } catch (err) {
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/faculty/questions');
      setQuestions(response.data.data || []);
    } catch {
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
      const testData = {
        facultyId,
        collegeId: '675a1234567890abcdef5678',
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

      const response = await api.post('/faculty/tests', testData);
      if (response.data.success) {
        alert('Test created successfully!');
        setShowCreateForm(false);
        resetForm();
        fetchTests();
      }
    } catch (err) {
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
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md"
          >
            CREATE NEW TEST
          </button>
        </section>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {showCreateForm && (
          <section className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-indigo-600 mb-6">
              Create New Test
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* form content unchanged */}
              {/* … */}
            </form>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-emerald-600 mb-4">
            Your Tests
          </h2>

          {tests.length === 0 ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-xl">
              No tests created yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tests.map((test) => (
                <div
                  key={test._id}
                  className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4"
                >
                  <h3 className="font-semibold">{test.testTitle}</h3>
                  <p>{test.duration} mins</p>
                  <p>{formatDateTime(test.schedule?.startTime)}</p>
                  <button
                    onClick={() =>
                      navigate(`/faculty/tests/${test._id}/analytics`)
                    }
                    className="mt-3 w-full bg-emerald-600 text-white py-2 rounded-lg"
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
