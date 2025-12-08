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
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
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
    setTimeout(() => {
      setUploading(false);
      setTimeout(() => {
        setAnalyzing(false);
        navigate('/student/resume-analysis');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
          <p className="text-gray-600 mt-1">Upload your resume for analysis</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
            <p className="text-gray-600">Supported formats: PDF, DOCX</p>
          </div>

          <div className="mb-8">
            <label
              htmlFor="resume-upload"
              className="block w-full p-12 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 bg-white"
            >
              <div className="text-center">
                {selectedFile ? (
                  <>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-gray-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <p className="text-sm text-emerald-600 mt-3">Click to change file</p>
                  </>
                ) : (
                  <>
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
            className={`w-full py-4 rounded-lg font-semibold text-lg ${
              !selectedFile || uploading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Upload & Analyze'}
          </button>

          {uploading && (
            <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
              <p className="font-semibold text-gray-800">Uploading your resume...</p>
              <p className="text-sm text-gray-600">Please wait</p>
            </div>
          )}

          {analyzing && !uploading && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="font-semibold text-emerald-800">
                Analyzing your resume...
              </p>
              <p className="text-sm text-emerald-700">Processing content</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">ATS Score</h3>
            <p className="text-gray-600 text-sm">
              Understand compatibility with applicant tracking systems
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Suggestions</h3>
            <p className="text-gray-600 text-sm">
              Improve clarity, formatting, and keyword alignment
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Immediate evaluation after upload
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
