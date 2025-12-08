import React from 'react';

export default function ResumeAnalysis() {
  const analysisData = {
    score: 78,
    totalScore: 100,
    skills: ['React', 'JavaScript', 'Python', 'Git', 'Problem Solving', 'Team Collaboration'],
    strengths: [
      'Clear and concise formatting',
      'Strong technical skills section',
      'Quantifiable achievements in project descriptions',
      'Good use of action verbs',
      'Well-structured work experience',
    ],
    improvements: [
      'Add more specific metrics to achievements',
      'Include certifications section',
      'Expand on leadership experience',
      'Add keywords relevant to target job role',
      'Include links to portfolio/GitHub',
      'Optimize for ATS compatibility',
    ],
    sections: [
      { name: 'Contact Information', score: 95, status: 'excellent' },
      { name: 'Professional Summary', score: 70, status: 'good' },
      { name: 'Work Experience', score: 80, status: 'good' },
      { name: 'Education', score: 90, status: 'excellent' },
      { name: 'Skills', score: 75, status: 'good' },
      { name: 'Projects', score: 65, status: 'needs-improvement' },
    ],
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getSectionColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'needs-improvement': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">📊 Resume Analysis Results</h1>
          <p className="text-gray-600 mt-1">Detailed insights and recommendations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overall Score */}
        <div className={`bg-gradient-to-r ${getScoreBgColor(analysisData.score)} rounded-xl shadow-2xl p-12 mb-8 text-white`}>
          <div className="text-center">
            <div className="text-7xl font-bold mb-4">
              {analysisData.score}/{analysisData.totalScore}
            </div>
            <h2 className="text-3xl font-bold mb-2">Overall Resume Score</h2>
            <p className="text-xl opacity-90">
              {analysisData.score >= 80 ? 'Excellent Resume!' : 
               analysisData.score >= 60 ? 'Good Resume - Room for Improvement' : 
               'Needs Significant Improvement'}
            </p>
            <div className="mt-6 max-w-2xl mx-auto bg-white/20 rounded-full h-4">
              <div
                className="bg-white h-4 rounded-full transition-all duration-1000"
                style={{ width: `${analysisData.score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Key Skills */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🔑</span>
                <span>Key Skills Detected</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {analysisData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-semibold shadow-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>💪</span>
                <span>Strengths</span>
              </h2>
              <ul className="space-y-3">
                {analysisData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-900">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Improvements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🎯</span>
                <span>Suggested Improvements</span>
              </h2>
              <ul className="space-y-3">
                {analysisData.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <span className="text-orange-600 text-xl flex-shrink-0">!</span>
                    <span className="text-gray-900">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section-wise Analysis */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📋</span>
            <span>Section-wise Breakdown</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisData.sections.map((section, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">{section.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-3xl font-bold ${getScoreColor(section.score)}`}>
                    {section.score}%
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSectionColor(section.status)}`}>
                    {section.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${getScoreBgColor(section.score)} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${section.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-4 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
            📄 Download Full Report (PDF)
          </button>
          <button className="flex-1 bg-white text-emerald-700 border-2 border-emerald-600 font-bold py-4 rounded-lg hover:bg-emerald-50 transition-all">
            🔄 Upload New Resume
          </button>
          <button className="flex-1 bg-white text-gray-900 border-2 border-gray-300 font-bold py-4 rounded-lg hover:bg-gray-50 transition-all">
            💾 Save Analysis
          </button>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">💡 Pro Tips</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Tailor your resume for each job application</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Use keywords from the job description</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Keep it concise - ideally 1-2 pages</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Proofread thoroughly for errors</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
