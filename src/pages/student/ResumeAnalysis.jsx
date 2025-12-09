import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ⚠️ CONFIGURE THIS - Change to your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

export default function ResumeAnalysis() {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!token || !studentId) {
      navigate('/student/login');
      return;
    }
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/resume/latest/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setAnalysisData(response.data);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      
      if (error.response?.status === 404) {
        setError('No resume analysis found. Please upload your resume first.');
      } else {
        setError(error.response?.data?.message || 'Failed to load analysis');
      }

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/student/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent Resume';
    if (score >= 60) return 'Good Resume — Can Improve';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
          <button
            onClick={() => navigate('/student/resume-upload')}
            className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  if (!analysisData) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
          <p className="text-gray-600 mt-1">AI-powered insights and recommendations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Overall Score */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-10 text-center mb-10">
          <div className={`text-5xl font-bold ${getScoreColor(analysisData.score)}`}>
            {analysisData.score}/100
          </div>
          <p className="text-gray-700 mt-4 font-medium text-xl">
            {getScoreMessage(analysisData.score)}
          </p>
          <div className="w-full max-w-md mx-auto bg-gray-200 h-3 rounded-full mt-6">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${analysisData.score}%` }}
            />
          </div>
          {analysisData.analyzedAt && (
            <p className="text-sm text-gray-500 mt-4">
              Analyzed on {new Date(analysisData.analyzedAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Summary */}
        {analysisData.summary && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{analysisData.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Skills */}
          <div className="space-y-8">
            {analysisData.skills && analysisData.skills.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Key Skills Detected
                </h2>
                <div className="flex flex-wrap gap-3">
                  {analysisData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {analysisData.strengths && analysisData.strengths.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Strengths</h2>
                <ul className="space-y-3">
                  {analysisData.strengths.map((item, index) => (
                    <li
                      key={index}
                      className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-gray-900 flex items-start gap-3"
                    >
                      <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Improvements */}
          <div className="space-y-8">
            {analysisData.improvements && analysisData.improvements.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Suggested Improvements
                </h2>
                <ul className="space-y-3">
                  {analysisData.improvements.map((item, index) => (
                    <li
                      key={index}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-900 flex items-start gap-3"
                    >
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/student/resume-upload')}
            className="py-4 border border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Upload New Resume
          </button>
          {analysisData.fileUrl && (
            <a>
              href={'http://localhost:5000' + analysisData.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center flex items-center justify-center"
            
              View Original Resume
            </a>
          )}
        </div>
      </div>
    </div>
  );
}