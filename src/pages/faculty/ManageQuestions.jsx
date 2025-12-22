import React, { useState, useEffect } from 'react';
import Button from '../../components/faculty/Button';
import Card from '../../components/faculty/Card';
import Table from '../../components/faculty/Table';
import Modal from '../../components/faculty/Modal';
import InputField from '../../components/faculty/InputField';
import api from '../../api/axios';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '0',  // Changed to 0-indexed
    subject: '',
    topic: ''
  });

  const token = localStorage.getItem('token') || localStorage.getItem('facultyToken');

  useEffect(() => {
    if (!token) {
      window.location.href = '/faculty/login';
      return;
    }
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/faculty/questions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Fetch response:', response.data);
      setQuestions(response.data.data || response.data.questions || []);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/faculty/login';
        return;
      }
      setError(err.response?.data?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple payload - backend will get collegeId from token
      const payload = {
        questionText: formData.questionText,
        options: [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4
        ],
        correctAnswer: parseInt(formData.correctAnswer), // Already 0-indexed
        tags: {
          subject: formData.subject,
          topic: formData.topic
        }
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      const response = await api.post('/faculty/questions', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);

      alert('Question created successfully!');
      setIsModalOpen(false);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/faculty/login';
        return;
      }
      
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create question';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await api.delete(`/faculty/questions/${questionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Question deleted successfully!');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/faculty/login';
        return;
      }
      
      alert(error.response?.data?.message || 'Failed to delete question');
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: '0',
      subject: '',
      topic: ''
    });
  };

  const columns = [
    { 
      header: 'Question', 
      accessor: 'questionText',
      render: (row) => (
        <div className="max-w-md truncate" title={row.questionText}>
          {row.questionText || 'N/A'}
        </div>
      )
    },
    { 
      header: 'Subject', 
      render: (row) => row.tags?.subject || 'N/A'
    },
    { 
      header: 'Topic', 
      render: (row) => row.tags?.topic || 'N/A'
    },
    { 
      header: 'Created', 
      render: (row) => row.createdAt 
        ? new Date(row.createdAt).toLocaleDateString('en-IN')
        : 'N/A'
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Delete
        </button>
      )
    }
  ];

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
              <p className="text-gray-600 mt-2">Create and manage test questions</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              Create New Question
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
              ⚠️ {error}
              <button
                onClick={fetchQuestions}
                className="block mt-2 text-red-600 hover:text-red-700 underline font-medium"
              >
                Retry
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {questions.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <p className="text-lg mb-3">No questions created yet</p>
                <p className="text-sm">Click "Create New Question" to get started</p>
              </div>
            ) : (
              <Table columns={columns} data={questions} />
            )}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title="Create New Question"
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text <span className="text-red-500">*</span>
              </label>
              <textarea
                name="questionText"
                value={formData.questionText}
                onChange={handleChange}
                placeholder="Enter your question here..."
                required
                rows="3"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Option 1"
                type="text"
                name="option1"
                value={formData.option1}
                onChange={handleChange}
                placeholder="First option"
                disabled={loading}
                required
              />
              <InputField
                label="Option 2"
                type="text"
                name="option2"
                value={formData.option2}
                onChange={handleChange}
                placeholder="Second option"
                disabled={loading}
                required
              />
              <InputField
                label="Option 3"
                type="text"
                name="option3"
                value={formData.option3}
                onChange={handleChange}
                placeholder="Third option"
                disabled={loading}
                required
              />
              <InputField
                label="Option 4"
                type="text"
                name="option4"
                value={formData.option4}
                onChange={handleChange}
                placeholder="Fourth option"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer <span className="text-red-500">*</span>
              </label>
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
              >
                <option value="0">Option 1</option>
                <option value="1">Option 2</option>
                <option value="2">Option 3</option>
                <option value="3">Option 4</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Data Structures"
                disabled={loading}
                required
              />
              <InputField
                label="Topic"
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Trees"
                disabled={loading}
                required
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? 'Creating...' : 'Create Question'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                disabled={loading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageQuestions;