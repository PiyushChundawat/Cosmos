import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/faculty/Button';
import Card from '../../components/faculty/Card';
import InputField from '../../components/faculty/InputField';

const ManageTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    selectedQuestions: [],
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchTests();
    fetchQuestions();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    
    // Get tests from localStorage
    const storedTests = JSON.parse(localStorage.getItem('facultyTests') || '[]');
    
    if (storedTests.length === 0) {
      // Initialize with mock data
      const mockTests = [
        {
          id: 1,
          title: 'Data Structures Mid-Term',
          questionCount: 50,
          duration: '120 mins',
          startTime: '2025-12-10 10:00',
          endTime: '2025-12-10 12:00',
          status: 'scheduled'
        },
        {
          id: 2,
          title: 'Algorithms Quiz 3',
          questionCount: 25,
          duration: '60 mins',
          startTime: '2025-12-12 14:00',
          endTime: '2025-12-12 15:00',
          status: 'draft'
        }
      ];
      localStorage.setItem('facultyTests', JSON.stringify(mockTests));
      setTests(mockTests);
    } else {
      setTests(storedTests);
    }
    
    setLoading(false);
  };

  const fetchQuestions = async () => {
    // Get questions from localStorage
    const storedQuestions = JSON.parse(localStorage.getItem('facultyQuestions') || '[]');
    
    if (storedQuestions.length === 0) {
      // Mock data if no questions exist
      setQuestions([
        { id: 1, questionText: 'What is the time complexity of binary search?' },
        { id: 2, questionText: 'Which sorting algorithm has O(n log n) worst case?' },
        { id: 3, questionText: 'What is normalization in databases?' },
        { id: 4, questionText: 'Explain the concept of inheritance in OOP' },
        { id: 5, questionText: 'What is a deadlock in OS?' }
      ]);
    } else {
      setQuestions(storedQuestions);
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

    try {
      const facultyId = localStorage.getItem('facultyId');
      const storedTests = JSON.parse(localStorage.getItem('facultyTests') || '[]');

      const testData = {
        id: Date.now(),
        title: formData.title,
        duration: `${formData.duration} mins`,
        questionCount: formData.selectedQuestions.length,
        questions: formData.selectedQuestions,
        startTime: new Date(formData.startTime).toLocaleString(),
        endTime: new Date(formData.endTime).toLocaleString(),
        status: 'scheduled',
        facultyId,
        createdAt: new Date().toISOString()
      };

      storedTests.push(testData);
      localStorage.setItem('facultyTests', JSON.stringify(storedTests));

      alert('Test created successfully!');
      setShowCreateForm(false);
      resetForm();
      fetchTests();
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to create test. Please try again.');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Tests</h1>
          <p className="text-gray-600 mt-1">Create and schedule tests for students</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            CREATE NEW TEST
          </div>
        </Button>
      </div>

      {/* Create Test Form */}
      {showCreateForm && (
        <Card title="Create New Test">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Test Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Mid-Term Examination"
                required
              />
              <InputField
                label="Duration (minutes)"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 90"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Start Time"
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              <InputField
                label="End Time"
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
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
                        key={question.id}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedQuestions.includes(question.id)}
                          onChange={() => handleQuestionSelect(question.id)}
                          className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{question.questionText}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Selected: {formData.selectedQuestions.length} question(s)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading || formData.selectedQuestions.length === 0}>
                {loading ? 'Creating Test...' : 'Create Test'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.length === 0 ? (
          <Card className="col-span-full">
            <p className="text-center text-gray-500 py-8">No tests created yet. Create your first test!</p>
          </Card>
        ) : (
          tests.map((test) => (
            <Card key={test.id} className="hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{test.title}</h3>
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
                    <span>{test.questionCount} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{test.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{test.startTime}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate(`/faculty/tests/${test.id}/analytics`)}
                  className="mt-4"
                >
                  View Analytics
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageTests;
