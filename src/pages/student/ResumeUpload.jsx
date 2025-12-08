import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert('Please upload a PDF or DOCX file');
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setAnalyzing(true);

    // Simulate upload and analysis
    setTimeout(() => {
      setUploading(false);
      setTimeout(() => {
        setAnalyzing(false);
        navigate('/student/resume-analysis');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">📄 Resume Analysis</h1>
          <p className="text-gray-600 mt-1">Upload your resume for AI-powered analysis</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-lg p-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
            <p className="text-gray-600">Get instant feedback and improvement suggestions</p>
          </div>

          {/* File Input Area */}
          <div className="mb-8">
            <label
              htmlFor="resume-upload"
              className="block w-full p-12 border-4 border-dashed border-emerald-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all"
            >
              <div className="text-center">
                {selectedFile ? (
                  <>
                    <div className="text-5xl mb-4">✅</div>
                    <p className="text-xl font-semibold text-emerald-700 mb-2">{selectedFile.name}</p>
                    <p className="text-gray-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type.includes('pdf') ? 'PDF' : 'DOCX'}
                    </p>
                    <p className="text-sm text-emerald-600 mt-4">Click to change file</p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">📎</div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      Click to choose file or drag and drop
                    </p>
                    <p className="text-gray-600">Supported formats: PDF, DOCX (Max 5MB)</p>
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

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              !selectedFile || uploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            {uploading ? 'Uploading...' : analyzing ? 'Analyzing Resume...' : 'Upload & Analyze'}
          </button>

          {/* Status Messages */}
          {uploading && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin text-2xl">⏳</div>
                <div>
                  <p className="font-semibold text-blue-900">Uploading your resume...</p>
                  <p className="text-sm text-blue-700">Please wait while we process your file</p>
                </div>
              </div>
            </div>
          )}

          {analyzing && !uploading && (
            <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-pulse text-2xl">🤖</div>
                <div>
                  <p className="font-semibold text-emerald-900">Analyzing your resume...</p>
                  <p className="text-sm text-emerald-700">Our AI is evaluating your resume content</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-900 mb-2">ATS Score</h3>
            <p className="text-gray-600 text-sm">Get your Applicant Tracking System compatibility score</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="font-bold text-gray-900 mb-2">Smart Suggestions</h3>
            <p className="text-gray-600 text-sm">Receive personalized improvement recommendations</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Instant Analysis</h3>
            <p className="text-gray-600 text-sm">Get results within seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
