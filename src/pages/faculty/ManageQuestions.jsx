import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/faculty/Button';
import Card from '../../components/faculty/Card';
import Table from '../../components/faculty/Table';
import Modal from '../../components/faculty/Modal';
import InputField from '../../components/faculty/InputField';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    
    // Get questions from localStorage
    const storedQuestions = JSON.parse(localStorage.getItem('facultyQuestions') || '[]');
    
    if (storedQuestions.length === 0) {
      // Initialize with mock data
      const mockQuestions = [
        {
          id: 1,
          questionText: 'What is the time complexity of binary search?',
          subject: 'Data Structures',
          topic: 'Searching Algorithms',
          createdAt: '2025-12-01'
        },
        {
          id: 2,
          questionText: 'Which sorting algorithm has O(n log n) worst case?',
          subject: 'Algorithms',
          topic: 'Sorting',
          createdAt: '2025-11-28'
        },
        {
          id: 3,
          questionText: 'What is normalization in databases?',
          subject: 'Database Systems',
          topic: 'Database Design',
          createdAt: '2025-11-25'
        }
      ];
      localStorage.setItem('facultyQuestions', JSON.stringify(mockQuestions));
      setQuestions(mockQuestions);
    } else {
      setQuestions(storedQuestions);
    }
    
    setLoading(false);
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
      const facultyId = localStorage.getItem('facultyId');
      const storedQuestions = JSON.parse(localStorage.getItem('facultyQuestions') || '[]');

      const questionData = {
        id: Date.now(),
        questionText: formData.questionText,
        options: [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4
        ],
        correctAnswer: parseInt(formData.correctAnswer),
        subject: formData.subject,
        topic: formData.topic,
        facultyId,
        createdAt: new Date().toISOString()
      };

      storedQuestions.push(questionData);
      localStorage.setItem('facultyQuestions', JSON.stringify(storedQuestions));

      alert('Question created successfully!');
      setIsModalOpen(false);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Failed to create question. Please try again.');
    } finally {
      setLoading(false);
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
          {row.questionText}
        </div>
      )
    },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Topic', accessor: 'topic' },
    { 
      header: 'Created Date', 
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Questions</h1>
          <p className="text-gray-600 mt-1">Create and manage test questions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            CREATE NEW QUESTION
          </div>
        </Button>
      </div>

      {/* Questions Table */}
      <Card>
        <Table columns={columns} data={questions} />
      </Card>

      {/* Create Question Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Create New Question"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Question Text */}
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Option 1"
                type="text"
                name="option1"
                value={formData.option1}
                onChange={handleChange}
                placeholder="First option"
                required
              />
              <InputField
                label="Option 2"
                type="text"
                name="option2"
                value={formData.option2}
                onChange={handleChange}
                placeholder="Second option"
                required
              />
              <InputField
                label="Option 3"
                type="text"
                name="option3"
                value={formData.option3}
                onChange={handleChange}
                placeholder="Third option"
                required
              />
              <InputField
                label="Option 4"
                type="text"
                name="option4"
                value={formData.option4}
                onChange={handleChange}
                placeholder="Fourth option"
                required
              />
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer <span className="text-red-500">*</span>
              </label>
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
              </select>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Data Structures"
                required
              />
              <InputField
                label="Topic"
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Trees"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading} fullWidth>
                {loading ? 'Creating...' : 'Create Question'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageQuestions;
