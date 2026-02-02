import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('studentId');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or DOCX file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    if (!token || !studentId) {
      alert('Please login first');
      navigate('/student/login');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('resume', selectedFile); // Backend expects "resume" field name
      formData.append('studentId', studentId);

      const response = await axios.post(
        `${API_BASE_URL}/resume/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.message) {
        // Success! Navigate to analysis page after brief delay
        setTimeout(() => {
          navigate('/student/resume-analysis');
        }, 500);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload resume');
      alert(error.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-2">Upload Your Resume</h2>
            <p className="text-gray-600">Supported formats: PDF, DOCX (Max 5MB)</p>
          </div>

          <div className="mb-8">
            <label
              htmlFor="resume-upload"
              className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50 transition-colors"
            >
              <div className="text-center">
                {selectedFile ? (
                  <>
                    <svg className="w-16 h-16 mx-auto text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-gray-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <p className="text-sm text-indigo-600 mt-3">Click to change file</p>
                  </>
                ) : (
                  <>
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      Click to choose file or drag and drop
                    </p>
                    <p className="text-gray-600">PDF or DOCX up to 5MB</p>
                  </>
                )}
              </div>
            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition shadow-md ${
              !selectedFile || uploading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {uploading ? 'Analyzing your resume...' : 'Upload & Analyze'}
          </button>

          {uploading && (
            <div className="mt-6 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                <div>
                  <p className="font-semibold text-indigo-800">
                    Analyzing your resume with AI...
                  </p>
                  <p className="text-sm text-indigo-700">This may take 10-30 seconds</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-indigo-800 mb-2">ATS Score</h3>
            <p className="text-gray-600 text-sm">
              Understand compatibility with applicant tracking systems
            </p>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-bold text-indigo-800 mb-2">AI Suggestions</h3>
            <p className="text-gray-600 text-sm">
              Get actionable recommendations powered by AI
            </p>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-indigo-800 mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Immediate evaluation after upload
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}