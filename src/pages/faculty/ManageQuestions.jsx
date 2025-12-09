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
    correctAnswer: '1',
    subject: '',
    topic: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/faculty/questions');
      console.log('Fetch response:', response.data);
      setQuestions(response.data.data || response.data.questions || []);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
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
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Simple payload matching backend - including collegeId
      const payload = {
        facultyId: user.id || user._id || "675a1234567890abcdef1234",
        collegeId: user.collegeId || "675a1234567890abcdef5678", // Add collegeId
        questionText: formData.questionText,
        options: [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4
        ],
        correctAnswer: parseInt(formData.correctAnswer) - 1,
        tags: {
          subject: formData.subject,
          topic: formData.topic
        }
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      // Try the POST request
      const response = await api.post('/faculty/questions', payload);
      console.log('Response:', response.data);

      alert('Question created successfully!');
      setIsModalOpen(false);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create question';
      alert(`Error: ${errorMsg}\n\nFull details in console.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await api.delete(`/faculty/questions/${questionId}`);
      alert('Question deleted successfully!');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
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
      correctAnswer: '1',
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
          <p className="text-gray-600 mt-1">Create and manage test questions</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create New Question
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold">⚠️ {error}</p>
          <button
            onClick={fetchQuestions}
            className="mt-2 text-red-600 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      <Card>
        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg mb-2">No questions created yet</p>
            <p className="text-sm">Click "Create New Question" to get started</p>
          </div>
        ) : (
          <Table columns={columns} data={questions} />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Create New Question"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
              <option value="4">Option 4</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageQuestions;